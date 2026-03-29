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
  loading = false;
  passwordVisible = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  async onLogin(): Promise<void> {
    if (this.loading) {
      return;
    }
    this.errorMessage = '';
    this.loading = true;

    try {
      const result = await this.afAuth.signInWithEmailAndPassword(this.email.trim(), this.password);
      if (result.user) {
        await this.router.navigate(['/home']);
      }
    } catch (error: unknown) {
      console.error(error);
      this.errorMessage = 'E-mail ou senha incorretos. Verifique e tente de novo.';
    } finally {
      this.loading = false;
    }
  }
}
