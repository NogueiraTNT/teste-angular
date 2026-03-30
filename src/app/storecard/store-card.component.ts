import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-store-card',
  standalone: false,
  template: `
    <div class="max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <h4 class="text-lg font-bold">Loja: {{ nomeDaLoja }}</h4>
        <p class="text-gray-600">Selecione esta loja para ver mais informações.</p>
      </div>
      <button
        (click)="notificarPai()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Selecionar esta loja {{ nomeDaLoja }}
      </button>
    </div>
  `,
})
export class StoreCardComponent {
  // @Input: Recebe o dado vindo do componete Pai
  @Input() nomeDaLoja: string = '';

  // @Output: Cria um evento para "gritar" algo para o Pai
  @Output() lojaSelecionada = new EventEmitter<string>();

  notificarPai() {
    this.lojaSelecionada.emit(this.nomeDaLoja);
  }
}
