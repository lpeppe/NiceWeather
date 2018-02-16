import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AuthProvider implements OnDestroy {

  sub: Subscription
  name: string;
  email: string;
  imgUrl: string;
  userId: string;
  loggedIn: boolean = false;

  constructor(public afAuth: AngularFireAuth, public googlePlus: GooglePlus, public platform: Platform) {
    this.sub = this.afAuth.authState.subscribe(data => {
      if (data) {
        this.name = data.displayName;
        this.email = data.email;
        this.imgUrl = data.photoURL;
        this.userId = data.uid;
        this.loggedIn = true;
      }
      else {
        this.loggedIn = false;
        this.name = null;
        this.email = null;
        this.imgUrl = null;
        this.userId = null;
      }
    })
  }

  login() {
    if (this.platform.is('core')) {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }
    else {
      this.googlePlus.login({
        webClientId: '189002884216-di1h47iafmdknqvk9hrkh82ec8dfel8v.apps.googleusercontent.com',
        offline: true
      })
        .then(res => {
          return firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        })
        .then(_ => console.log('login successful'))
        .catch(err => console.log(err))
    }
  }

  logout() {
    firebase.auth().signOut()
      .then(_ => console.log('logout successful'))
      .catch(err => console.log(err))
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
