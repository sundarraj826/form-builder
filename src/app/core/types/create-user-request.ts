import { UserType } from './user-type';

export class CreateUserRequest {
	userName!: string;
	password!: string;
	userType!: UserType;

	constructor(username: string, password: string, userType: UserType) {
		this.userName = username;
		this.password = password;
		this.userType = userType;
	}
}
