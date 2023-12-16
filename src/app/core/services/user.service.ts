import { CreateUserRequest } from './../types/create-user-request';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../types/result';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private httpClient: HttpClient) { }

	/**
	 * Creates a user.
	 * @param createUserRequest - request object with which to create the user.
	 * @returns A result object with boolean value to represent if the user creation was successful or not.
	 */
	createUser(createUserRequest: CreateUserRequest): Observable<Result<number>> {
		return this.httpClient.post<Result<number>>(`Api/User/Create`, createUserRequest);
	}
}
