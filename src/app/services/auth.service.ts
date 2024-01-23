import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  public redirect = false;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({ authOnly: false }))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
  }

  public async createUser(userData: IUser) {
    const { email, password, name, age, phoneNumber } = userData;

    if (!password) {
      throw new Error('Password not provided');
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      email as string,
      password as string
    );
    if (!userCred.user) {
      throw new Error("User can't be found");
    }
    this.usersCollection.doc(userCred.user?.uid).set({
      name,
      email,
      age,
      phoneNumber,
    });

    await userCred.user.updateProfile({
      displayName: userData.name,
    });
  }

  public async logout(event?: Event) {
    if (event) event.preventDefault();
    await this.auth.signOut();
    if (this.redirect) await this.router.navigateByUrl('/');
  }
}
