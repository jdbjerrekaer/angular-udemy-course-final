import { Store } from '@ngrx/store';
import { User } from './user.model';
import { take, exhaustMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as fromRoot from '../store/app.reducer';


@Injectable({
  providedIn: 'root'
})
export class AuthInterseptorService implements HttpInterceptor {

  constructor(private authSrevice: AuthService, private store: Store<fromRoot.AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap((user: User) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      }));
  }

}
