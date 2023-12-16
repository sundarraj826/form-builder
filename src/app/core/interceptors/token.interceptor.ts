import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthResult } from '../types/auth-result';
import { Result } from '../types/result';
import { RefreshOrRemoveTokenRequest } from '../types/refresh-or-remove-token-request';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	private isJwtRefreshing: boolean;
	private refreshTokenSubject: BehaviorSubject<unknown>;

	constructor(private authService: AuthService) {
		this.isJwtRefreshing = false;
		this.refreshTokenSubject = new BehaviorSubject<unknown>(null);
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const jwt = this.authService.jwt;

		if (jwt) {
			request = this.addJwtToRequestHeader(request, jwt);
		}

		return next.handle(request)
			.pipe(catchError(error => {
				if (error instanceof HttpErrorResponse && error.status === 401) {
					return this.handleUnauthorizedResponse(request, next);
				} else {
					return throwError(() => new Error(error));
				}
			}));
	}

	/** Handles unauthorized HTTP responses */
	private handleUnauthorizedResponse(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		if (!this.isJwtRefreshing) {
			this.isJwtRefreshing = true;
			this.refreshTokenSubject.next(null);

			return this.authService.refreshJwtToken().pipe(
				switchMap((authResult: Result<AuthResult>) => {
					if (authResult.ok) {
						this.isJwtRefreshing = false;
						this.refreshTokenSubject.next(authResult.value?.jwt);
						return next.handle(this.addJwtToRequestHeader(request, authResult.value?.jwt));
					} else {
						return EMPTY;
					}
				}));

		} else {
			return this.refreshTokenSubject.pipe(
				filter(jwt => jwt !== null),
				take(1),
				switchMap(jwtToken => {
					return next.handle(this.addJwtToRequestHeader(request, jwtToken));
				}));
		}
	}

	/** Adds JWT as bearer token to each HTTP request */
	private addJwtToRequestHeader(request: HttpRequest<unknown>, jwt: string | unknown): HttpRequest<unknown> {
		if (request.url.includes('Logout')) {
			return request.clone({
				body: new RefreshOrRemoveTokenRequest(this.authService.refreshToken, this.authService.jwt),
				setHeaders: {
					Authorization: `Bearer ${jwt}`
				}
			});
		}

		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${jwt}`
			}
		});
	}
}
