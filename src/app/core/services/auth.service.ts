import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppRoutes } from '../routes/app-routes';
import { AuthResult } from '../types/auth-result';
import { Credentials } from '../types/credentials';
import { Result } from '../types/result';
import { RefreshOrRemoveTokenRequest } from '../types/refresh-or-remove-token-request';
import { SessionService } from './session.service';
import { User } from '../types/user';
import { BroadcastService } from './broadcast.service';
import { AuthEvent } from '../types/auth-event';
import { UserType } from '../types/user-type';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly JWT_TOKEN: string;
	private readonly REFRESH_TOKEN: string;
	private loggedInUser?: User;

	constructor(
		private route: ActivatedRoute,
		private broadcastService: BroadcastService,
		private httpClient: HttpClient,
		private sessionService: SessionService,
		private router: Router
	) {
		this.JWT_TOKEN = 'authorization_token';
		this.REFRESH_TOKEN = 'refresh_token';

		this.broadcastService.messageStream.subscribe(message => {
			if (message === AuthEvent.Logout) {
				this.logout();
			}
		});
	}

	/** Gets the Logged in User */
	get currentUser(): User | undefined {
		return this.loggedInUser;
	}

	/** `true` if a user is logged in else `false` */
	get isLoggedIn(): boolean {
		return !!this.loggedInUser;
	}

	/** Gets the `JWT` token from `localStorage` */
	get jwt(): string | null {
		return localStorage.getItem(this.JWT_TOKEN);
	}

	/** Gets the `Refresh token` from `localStorage` */
	get refreshToken(): string | null {
		return localStorage.getItem(this.REFRESH_TOKEN);
	}

	/** A boolean value to represents if the currently logged in user is an 'Admin' or not. */
	get isAdmin(): boolean {
		return !!this.loggedInUser && this.loggedInUser.userType === UserType.Admin;
	}

	/**********************************************************************************************************/
	/**
	 * Performs Login for a user.
	 * @param userCredentials - user's credentials with which to login.
	 * @returns An `Observable` with a `Result` object containing user's authentication tokens.
	 */
	login(userCredentials: Credentials): Observable<Result<AuthResult>> {
		return this.httpClient
			.post<Result<AuthResult>>(`Api/Auth/Authenticate`, userCredentials)
			.pipe(tap(async authResult => {
				if (authResult.ok && authResult.value) {
					this.storeTokens(authResult.value);

					await this.tryInitiateSession();

					this.router.navigate([AppRoutes.account], { relativeTo: this.route })
						.then(navResult => {
							if (!navResult) { this.loggedInUser = undefined; }
						});
				}
			}));
	}

	/**********************************************************************************************************/
	/**
	 * Logs a user out of the system
	 * @returns A subscription that loges the user out when the associated callback function runs.
	 */
	logout(): Subscription {
		return this.httpClient.post<Result<boolean>>(`Api/Auth/Logout`,
			new RefreshOrRemoveTokenRequest(this.refreshToken, this.jwt)
		).subscribe(this.endSession);
	}

	/**********************************************************************************************************/
	/**
	 * Refreshes `JWT` token for a user
	 * @returns An `Observable` with a `Result` object containing the new Authentication tokens for the user.
	 */
	refreshJwtToken(): Observable<Result<AuthResult>> {
		return this.httpClient
			.post<Result<AuthResult>>(`Api/Auth/RefreshToken`, new RefreshOrRemoveTokenRequest(this.refreshToken, this.jwt))
			.pipe(tap(logoutResult => {
				if (logoutResult.ok && logoutResult.value) { this.storeTokens(logoutResult.value); }
				else { this.endSession(); }
			}));
	}

	/**********************************************************************************************************/
	/**
	 * Sets the currently logged in user and initializes their session.
	 * @returns A promise which will set the currently logged in user if the Authentication was successful.
	 */
	tryInitiateSession(): Promise<void> {
		if (this.jwt) {
			return this.httpClient.get<Result<User>>(`Api/User/GetUser`)
				.toPromise()
				.then(result => {
					this.sessionService.initialize();
					this.loggedInUser = result.ok ? result.value : undefined;
				}).catch(_ => this.loggedInUser = undefined);
		}

		return Promise.resolve().then(_ => this.loggedInUser = undefined);
	}

	/**********************************************************************************************************/
	/** Logs a user out of the system and removes `JWT` and `Refresh token` */
	private endSession = () => {
		this.loggedInUser = undefined;
		this.removeTokens();
		this.sessionService.performCleanUp();
		this.router.navigate([AppRoutes.empty]);
	}

	/**********************************************************************************************************/
	/**
	 * Stores `JWT` and `Refresh token` in `localStorage`
	 * @param authResult - The token which need to be stored.
	 */
	private storeTokens(authResult: AuthResult): void {
		localStorage.setItem(this.JWT_TOKEN, authResult.jwt);
		localStorage.setItem(this.REFRESH_TOKEN, authResult.refreshToken);
	}

	/**********************************************************************************************************/
	/** removes `JWT` and `Refresh token` from `localStorage` */
	private removeTokens(): void {
		localStorage.removeItem(this.JWT_TOKEN);
		localStorage.removeItem(this.REFRESH_TOKEN);
	}
}
