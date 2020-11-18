import { User } from './../user.model';
import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const LOGOUT = '[Auth] Logout';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(public payload: User, public redirect: boolean) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {email: string; password: string}) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: {email: string, password: string}) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type authActions =
| AutoLogin
| SignupStart
| AuthenticateFail
| LoginStart
| Logout
| AuthenticateSuccess;
