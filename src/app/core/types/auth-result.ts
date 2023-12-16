export class AuthResult {
	private _jwt!: string;
	private _refreshToken!: string;

	/** Gets the current user's JWT */
	get jwt(): string {
		return this._jwt;
	}

	/** Gets the current user's Refresh token */
	get refreshToken(): string {
		return this._refreshToken;
	}
}
