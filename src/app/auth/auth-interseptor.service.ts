import { User } from './user.model';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthInterseptorService implements HttpInterceptor {

  constructor(private authSrevice: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
    return this.authSrevice.user.pipe(take(1), exhaustMap((user: User) => {
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
