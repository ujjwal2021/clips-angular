import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
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
}
