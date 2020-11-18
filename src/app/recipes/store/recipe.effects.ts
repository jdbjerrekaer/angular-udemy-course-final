import { Store } from '@ngrx/store';
import { Recipe } from './../recipe.model';
import { HttpClient } from '@angular/common/http';
import { mergeMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipeActions from '../store/recipe.actions';
import * as fromRoot from '../../store/app.reducer';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(ofType(RecipeActions.FETCH_RECIPES),
    mergeMap((action: RecipeActions.FetchRecipes) => {
      return this.http.get<Recipe[]>(
        'https://angular-udemy-c6237.firebaseio.com/recipes.json'
      ), map((recipes: Recipe[]) => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
        map((recipes: Recipe[]) => {
          return new RecipeActions.SetRecipes(recipes);
        });
    }));

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipeState]) => {
      return this.http.put(
        'https://angular-udemy-c6237.firebaseio.com/recipes.json',
        recipeState.recipes
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromRoot.AppState>) { }
}

