import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromRoot from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* user = new BehaviorSubject<User>(null); */
  private tokenExpirationTimer: ReturnType<typeof setTimeout>;

  constructor(private store: Store<fromRoot.AppState>) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.store.dispatch(new AuthActions.Logout()), expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /* signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(
      errorResponse => {
        let errorMessage = 'An unknown error occurred';
        if (!errorResponse.error || !errorResponse.error.error) {
          return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'The email address is already in use by another account.';
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Password sign-in is disabled for this project.';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
        }
        return throwError(errorMessage);
      }
    ), tap(
      (responseData) => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      })
    );

  } */

  /* logout() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    // this.router.navigate(['auth']);
    localStorage.removeItem('userDataRecipeBook');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  } */



  /* autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExperationDate: string
    } = JSON.parse(localStorage.getItem('userDataRecipeBook'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExperationDate));
    if (loadedUser.token) {
      // this.user.next(loadedUser); 
      this.store.dispatch(new AuthActions.Login(loadedUser));
      const expirationTime = new Date(userData._tokenExperationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
    }
  } */


  /* login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(
      errorResponse => {
        let errorMessage = 'An error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
          return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted, or incorrect input.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'The password is invalid.';
            break;
          case 'USER_DISABLED':
            errorMessage = 'The user account has been disabled by an administrator.';
            break;
        }
        return throwError(errorMessage);
      }
    ), tap(
      (responseData) => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      })
    );
  } */

  // Optimering?? private handleError()?

  /* private handleAuthentication(email: string, userID: string, token: string, expiresIn: number) {
    const experationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userID, token, experationDate);
    // this.user.next(user);
    this.store.dispatch(new AuthActions.Login(user));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userDataRecipeBook', JSON.stringify(user));
  } */

}
