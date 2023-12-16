import { UserType } from '../types/user-type';

export class User {
	private _id!: number;
	private _userName!: string;
	private _userType!: UserType;

	/** Id of the logged in user */
	get id(): number {
		return this._id;
	}

	/** Username of the logged in user */
	get userName(): string {
		return this._userName;
	}

	/** Represents what kind of user is logged in */
	get userType(): UserType {
		return this._userType;
	}
}
