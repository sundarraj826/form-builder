export class RefreshOrRemoveTokenRequest {
	/** Refresh Token for JWT refresh */
	refreshToken: string | null;

	/** JWT token */
	jwt: string | null;

	constructor(refreshToken: string | null, jwt: string | null) {
		this.refreshToken = refreshToken;
		this.jwt = jwt;
	}
}
