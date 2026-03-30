import { Component, EnvironmentInjector, runInInjectionContext, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { Database } from '../services/database';

export type UsuarioDoc = Record<string, unknown> & { id: string };

export type TarefaDoc = { id: string; titulo: string; etapa: string };

/** Dados fictícios para o quadro de etapas (substituir por Firestore quando quiser). */
const TAREFAS_MOCK: TarefaDoc[] = [
  { id: 'm1', titulo: 'Enviar documento para assinatura', etapa: 'assinatura' },
  { id: 'm2', titulo: 'Validar identidade do cliente', etapa: 'assinatura' },
  { id: 'm3', titulo: 'Revisar cláusulas do contrato', etapa: 'assinatura' },
  { id: 'm4', titulo: 'Aprovar minuta jurídica', etapa: 'assinatura' },
  { id: 'm5', titulo: 'Emitir boleto / PIX', etapa: 'assinatura' },
  { id: 'm6', titulo: 'Confirmar recebimento', etapa: 'assinatura' },
  { id: 'm7', titulo: 'Agendar entrega', etapa: 'assinatura' },
  { id: 'm8', titulo: 'Conferência final com o cliente', etapa: 'assinatura' },
];

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  readonly loadingDados = signal(true);
  readonly usuarios = signal<UsuarioDoc[]>([]);
  readonly loadError = signal<string | null>(null);
  readonly semUsuarioAuth = signal(false);
  readonly signingOut = signal(false);

  readonly etapas = signal<string[]>(['assinatura', 'contrato', 'pagamento', 'entrega']);
  readonly etapaAtiva = signal<string>(this.etapas()[0]);
  readonly tarefas = signal<TarefaDoc[]>(TAREFAS_MOCK);

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: Database,
    // EnvironmentInjector permite reabrir o contexto de injeção dentro de callbacks assíncronos.
    private envInjector: EnvironmentInjector,
  ) {
    this.afAuth.authState
      .pipe(
        switchMap((user) => {
          if (!user?.email) {
            return of({ kind: 'no-user' as const, docs: [] as UsuarioDoc[] });
          }
          // AngularFirestore.collection() chama inject() internamente (camada compat).
          // Fora do constructor isso lança NG0203, então reabrimos o contexto explicitamente.
          const dados$ = runInInjectionContext(this.envInjector, () =>
            this.db.getUsuarioPorEmail(user.email!),
          );
          return dados$.pipe(
            map((docs) => ({ kind: 'ok' as const, docs: docs as UsuarioDoc[] })),
            catchError((err: unknown) =>
              of({
                kind: 'error' as const,
                message: err instanceof Error ? err.message : String(err),
                docs: [] as UsuarioDoc[],
              }),
            ),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.loadingDados.set(false);
        if (result.kind === 'no-user') {
          this.semUsuarioAuth.set(true);
          this.usuarios.set([]);
          this.loadError.set(null);
        } else if (result.kind === 'error') {
          this.semUsuarioAuth.set(false);
          this.loadError.set(result.message);
          this.usuarios.set([]);
          console.error('Erro no Firebase:', result.message);
        } else {
          this.semUsuarioAuth.set(false);
          this.loadError.set(null);
          this.usuarios.set(result.docs);
          console.log('Dados do banco:', result.docs);
        }
      });
  }

  tarefasNaEtapa(etapa: string): TarefaDoc[] {
    return this.tarefas().filter((t) => t.etapa === etapa);
  }

  /** Indica se `etapa` já é a última da ordem (não há próximo passo). */
  ultimaEtapa(etapa: string): boolean {
    const ordem = this.etapas();
    const i = ordem.indexOf(etapa);
    return i < 0 || i >= ordem.length - 1;
  }

  /** Move a tarefa para a próxima etapa na ordem definida em `etapas`. */
  avancarEtapa(tarefaId: string): void {
    const ordem = this.etapas();
    this.tarefas.update((lista) => {
      const idx = lista.findIndex((x) => x.id === tarefaId);
      if (idx === -1) return lista;
      const t = lista[idx];
      const iEtapa = ordem.indexOf(t.etapa);
      if (iEtapa < 0 || iEtapa >= ordem.length - 1) return lista;
      const proxima = ordem[iEtapa + 1];
      const copia = [...lista];
      copia[idx] = { ...t, etapa: proxima };
      return copia;
    });
  }

  selecionarEtapa(etapa: string) {
    this.etapaAtiva.set(etapa);
  }

  formatCampo(val: unknown): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  trackById(_index: number, doc: UsuarioDoc): string {
    return doc.id;
  }

  trackByTarefaId(_index: number, t: TarefaDoc): string {
    return t.id;
  }

  async logout(): Promise<void> {
    if (this.signingOut()) return;
    this.signingOut.set(true);
    try {
      await this.afAuth.signOut();
      await this.router.navigate(['/login']);
    } finally {
      this.signingOut.set(false);
    }
  }
}
