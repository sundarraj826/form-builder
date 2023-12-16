export class Credentials {
	/** Username of the user attempting to login */
	username: string;

	/** Password of the user attempting to login */
	password: string;

	constructor(username: string, password: string) {
		this.username = username;
		this.password = password;
	}
}
