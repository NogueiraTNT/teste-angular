import { Component, EnvironmentInjector, runInInjectionContext, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { Database } from '../services/database';

export type UsuarioDoc = Record<string, unknown> & { id: string };

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

  formatCampo(val: unknown): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  trackById(_index: number, doc: UsuarioDoc): string {
    return doc.id;
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
