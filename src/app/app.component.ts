import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as fromRoot from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromRoot.AppState>) {

  }

  ngOnInit() {
    /* this.authService.autoLogin(); */
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
