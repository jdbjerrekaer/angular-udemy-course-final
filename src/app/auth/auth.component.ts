import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loginForm: FormGroup;
  isLoading = false;
  error: string = null;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  constructor(private store: Store<fromRoot.AppState>) { }

  ngOnInit() {
    this.initForm();

    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.isLoading = true;

    /* let authObservable: Observable<AuthResponseData>; */

    if (this.isLoginMode) {
      /* authObservable = this.authService.login(email, password); */
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      /* authObservable = this.authService.signUp(email, password); */
      this.store.dispatch(new AuthActions.SignupStart({email, password}));
    }

    /* authObservable.subscribe(
      (responseData) => {
        console.log(responseData);
        this.isLoading = false;
        this.route.navigate(['recipes']);
      }, errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }); */

    this.loginForm.reset();
  }
}
