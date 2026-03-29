import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class Database {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Busca documentos em `users` onde o campo `email` coincide.
   * `idField` inclui o id do documento Firestore no objeto.
   */
  getUsuarioPorEmail(email: string) {
    return this.firestore
      .collection<Record<string, unknown>>('users', (ref) => ref.where('email', '==', email))
      .valueChanges({ idField: 'id' });
  }
}
