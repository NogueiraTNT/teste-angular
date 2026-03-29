import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  signingOut = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  async logout(): Promise<void> {
    if (this.signingOut) {
      return;
    }
    this.signingOut = true;
    try {
      await this.afAuth.signOut();
      await this.router.navigate(['/login']);
    } finally {
      this.signingOut = false;
    }
  }
}
