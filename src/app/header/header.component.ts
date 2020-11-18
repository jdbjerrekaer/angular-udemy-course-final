import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromRoot from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
private userSubription: Subscription;
isAuthenticated = false;

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit() {
    this.userSubription = this.store.select('auth').pipe(
      map(authState => {
        return authState.user;
      } )
    ).subscribe(
      user => {
        if (user) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.userSubription.unsubscribe();
  }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    /* this.authService.logout(); */
    this.store.dispatch(new AuthActions.Logout());
  }
}
