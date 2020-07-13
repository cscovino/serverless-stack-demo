import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = null;

  constructor() { }

  async signup(username, password) {
    try {
      const user = await Auth.signUp(username, password);
      this.user = user.user
      return {error: null, success: true};
    } catch (error) {
      //console.log("ERROR", error);
      return {error: error, success: null};
    }
  }

  async confirmSignup(username, code) {
    try {
      await Auth.confirmSignUp(username, code);
      return {error: null, success: true};
    } catch (error) {
      //console.log("ERROR", error);
      return {error: error, success: null};
    }
  }

  async login(username, password) {
    try {
      const user = await Auth.signIn(username, password);
      this.user = user.user
      return {error: null, success: true};
    } catch (error) {
      //console.log("ERROR", error);
      return {error: error, success: null};
    }
  }

  async logout() {
    try {
      await Auth.signOut();
      this.user = null;
      return {error: null, success: true};   
    } catch (error) {
      //console.log("ERROR", error);
      return {error: error, success: null};  
    }
  }
}
