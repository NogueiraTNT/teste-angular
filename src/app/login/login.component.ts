import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  async onLogin() {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if (result.user) {
        console.log('Login sucesso!', result.user);
        this.errorMessage = '';
        // Aqui você redirecionaria para a home, ex:
        // this.router.navigate(['/home']);
        alert('Login realizado com sucesso! (Veja o console)');
      }
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Email ou senha inválidos.';
    }
  }
}
