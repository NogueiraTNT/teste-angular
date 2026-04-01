import { Component, EventEmitter, Input, Output, computed, inject, input } from '@angular/core';

@Component({
  selector: 'app-calc',
  standalone: false,
  template: `
    <div class="d-flex justify-content-center py-4">
      <div class="card shadow-sm p-3" style="width: 320px;">
        <div class="bg-dark text-white rounded p-3 mb-3 text-end">
          <div class="small text-secondary">{{ valor1 }} {{ operador }} {{ valor2 }}</div>
          <div class="fs-3 fw-bold">{{ total }}</div>
        </div>

        <div class="d-grid gap-2 mb-2">
          <input
            type="number"
            class="form-control"
            placeholder="Primeiro valor"
            [(ngModel)]="valor1"
          />
          <input
            type="number"
            class="form-control"
            placeholder="Segundo valor"
            [(ngModel)]="valor2"
          />
        </div>

        <div class="row g-2">
          <div class="col-6">
            <button class="btn btn-primary w-100" (click)="somar()">Somar</button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary w-100" (click)="subtrair()">Subtrair</button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary w-100" (click)="multiplicar()">Multriplicar</button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary w-100" (click)="dividir()">Dividir</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CalcComponent {
  valor1 = 0;
  valor2 = 0;
  total = 0;
  operador = '';

  somar() {
    this.total = this.valor1 + this.valor2;
    this.calcular('+');
  }
  subtrair() {
    this.total = this.valor1 - this.valor2;
    this.calcular('-');
  }
  dividir() {
    this.total = this.valor1 / this.valor2;
    this.calcular('/');
  }
  multiplicar() {
    this.total = this.valor1 * this.valor2;
    this.calcular('*');
  }
  calcular(operador: string) {
    this.operador = operador;
  }
}
