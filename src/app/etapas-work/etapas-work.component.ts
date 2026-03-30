import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-etapas-work',
  standalone: false,
  template: `
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold mt-2">Assinatura de Contrato</h3>
    </div>
  `,
})
export class EtapasWorkComponent {
  @Input() etapaAtiva: string = '';
  @Output() etapaAtivaChange = new EventEmitter<string>();
}
