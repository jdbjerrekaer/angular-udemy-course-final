import * as authActions from './auth.actions';
import { User } from './../user.model';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state: State = initialState, action: authActions.authActions) {
  switch (action.type) {
    case authActions.LOGOUT: {
      return {
        ...state,
        user: null,
        loading: false
      };
    }
    case authActions.AUTHENTICATE_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        authError: null,
        loading: false
      };
    }
    case authActions.LOGIN_START:
    case authActions.SIGNUP_START: {
      return {
        ...state,
        authError: null,
        loading: true
      };
    }
    case authActions.AUTHENTICATE_FAIL: {
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    }
    default: {
      return state;
    }
  }
}
