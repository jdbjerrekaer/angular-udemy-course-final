import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { User } from './../user.model';
import { environment } from './../../../environments/environment';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import { mergeMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (responseData: AuthResponseData) => {
  const experationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
  const user = new User(responseData.email, responseData.localId, responseData.idToken, experationDate);
  localStorage.setItem('userDataRecipeBook', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess(user, true);
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_NOT_FOUND':
      // tslint:disable-next-line: max-line-length
      errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted, or incorrect input.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(ofType(AuthActions.SIGNUP_START),
    mergeMap((action: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: action.payload.email,
          password: action.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap((responseData: AuthResponseData) => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
        }),
        map((responseData: AuthResponseData) => {
          return handleAuthentication(responseData);
        }),
        catchError(errorResponse => {
          return handleError(errorResponse);
        }));
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    mergeMap((action: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: action.payload.email,
          password: action.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap((responseData: AuthResponseData) => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
        }),
        map((responseData: AuthResponseData) => {
          return handleAuthentication(responseData);
        }),
        catchError(errorResponse => {
          return handleError(errorResponse);
        }));
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userDataRecipeBook');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  authAutoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExperationDate: string
    } = JSON.parse(localStorage.getItem('userDataRecipeBook'));
    if (!userData) {
      return { type: 'DUMMY' };
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExperationDate));
    if (loadedUser.token) {
      /* this.user.next(loadedUser); */
      tap((responseData: AuthResponseData) => {
        const expirationTime = new Date(userData._tokenExperationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationTime);
      });
      return new AuthActions.AuthenticateSuccess(loadedUser, false);
      /* this.autoLogout(expirationTime); */
    }
    return { type: 'DUMMY' };
  }));

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.redirect) {
        this.router.navigate(['/']);
      }

    }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}
