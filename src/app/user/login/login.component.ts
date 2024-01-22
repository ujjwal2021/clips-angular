import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  constructor(private auth: AngularFireAuth) {}
  showAlert = false;
  alertMsg = '';
  alertColor = 'blue';
  inSubmission = false;

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait, checking credentials!';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (e) {
      console.error(e);
      this.inSubmission = false;
      this.showAlert = true;
      this.alertMsg = 'Authentication failed, please try again later!';
      this.alertColor = 'red';
      return;
    }
    this.showAlert = true;
    this.alertMsg = 'Successfully logged in!';
    this.alertColor = 'green';
  }
}
