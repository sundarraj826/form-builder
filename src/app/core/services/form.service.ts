import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';

import { FormList, ResponseOptions, responses } from '../types/forms';
import { Result } from '../types/result';
import { AbstractControl, Form } from '@angular/forms';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ResultBase } from '../types/result-base';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class FormService {
	private formDetails = new BehaviorSubject<FormList>(null!);

	private saveFormDetails: FormList = new FormList();


	constructor(private _httpClient: HttpClient, private _snackBar: MatSnackBar) { }

	setSaveFormValue(value: FormList) {
		this.saveFormDetails = value;
	}

	getSaveFormValue(): Observable<FormList> {
		return of(this.saveFormDetails);
	}

	setFormDetailsValue(value: FormList) {
		this.formDetails.next(value);
	}

	getFormDetailsValue() {
		return this.formDetails.asObservable();
	}


	//Get Available Form Api
	getFormList(): Observable<Result<FormList[]>> {
		return this._httpClient.get<Result<FormList[]>>('Api/Form/GetAvailableForms');
	}


	//Create Form Api
	addCreateForm(title: AbstractControl, description: AbstractControl): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>('Api/Form/Create', {
			title: title,
			description: description
		});
	}


	//Create Section Api
	addCreateSection(id: any): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>(`Api/Form/CreateSection?formId=${id}`, {})
	}



	getFormSetting(id: number): Observable<Result<FormList>> {
		const params = new HttpParams().set('formId', id.toString());
		return this._httpClient.get<Result<FormList>>('Api/Form/GetFormSettings', { params })

	}

	addQuestion(formId: number, sectionId: number, questionType: number): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>('Api/Form/CreateQuestion', {
			formId: formId,
			sectionId: sectionId,
			questionType: questionType
		})

	}

	saveResponseOptions(result: ResponseOptions): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>('Api/Form/CreateResponseOptions', result);

	}

	lockForm(id: number): Observable<ResultBase> {
		return this._httpClient.post<ResultBase>(`Api/Form/Lock?formId=${id}`, {});

	}

	//Delete Question Api
	deleteQuestion(formId: number, sectionId: number, questionId: number): Observable<Result<FormList>> {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			body: {
				"formId": formId,
				"sectionId": sectionId,
				"questionId": questionId
			}
		};
		return this._httpClient.delete<Result<FormList>>(`Api/Form/DeleteQuestion`, httpOptions);

	}


	deleteResponseOptions(formId: number, sectionId: number, questionId: number, options: string): Observable<Result<FormList>> {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			body: {
				"formId": formId,
				"sectionId": sectionId,
				"questionId": questionId,
				"options": [options]
			}
		};
		return this._httpClient.delete<Result<FormList>>(`Api/Form/DeleteResponseOptions`, httpOptions);

	}

	deleteSection(formId: number, sectionId: number): Observable<Result<FormList>> {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			body: {
				"formId": formId,
				"sectionId": sectionId,
			}
		};
		return this._httpClient.delete<Result<FormList>>(`Api/Form/DeleteSection`, httpOptions);

	}

	saveFormSettings(form: FormList): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>('Api/Form/SaveSettings', form).pipe(
			catchError(this.handleError)
		);

	}


	private handleError(error: HttpErrorResponse) {
		if (error.status === 400) {
			console.error('Bad Request:', error.error);
			return throwError(error.error); // Return the error response
		} else {
			console.error('An error occurred:', error.error);
			return throwError('Something went wrong; please try again later.');
		}
	}

	autoSaveFormValue(): Observable<Result<FormList>> {
		return this.getSaveFormValue().pipe(
			tap(data => {
				this._snackBar.open('Saving...', undefined, { duration: 500 });

			}),
			switchMap(data => this.saveFormSettings(data)),
			tap(res => {
				if (res.ok) {
					this._snackBar.open('Saved', undefined, { duration: 500 });


				} else {
					catchError(this.handleError)
				}
			})
		);
	}
}
