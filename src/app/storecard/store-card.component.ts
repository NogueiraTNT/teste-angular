import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-store-card',
  standalone: false,
  template: `
    <div class="card">
      <p>Loja: {{ nomeDaLoja }}</p>
      <button (click)="notificarPai()">Selecionar esta loja</button>
    </div>
  `,
})
export class StoreCardComponent {
  // @Input: Recebe o dado cindo do componete Pai
  @Input() nomeDaLoja: string = '';

  // @Output: Cria um evento para "gritar" algo para o Pai
  @Output() lojaSelecionada = new EventEmitter<string>();

  notificarPai() {
    this.lojaSelecionada.emit(this.nomeDaLoja);
  }
}
