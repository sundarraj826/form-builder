import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { FormList } from '../types/forms';
import { Result } from '../types/result';
import { AbstractControl } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class FormService {
	formResponse!: Result<FormList[]>;
	private formDetails = new BehaviorSubject<FormList>(null!);
	private saveFormDetails = new BehaviorSubject<FormList>(null!);
  
	constructor(private _httpClient: HttpClient) { }
	
	setFormDetailsValue(value: FormList) {
		this.formDetails.next(value);
	}
	
	getFormDetailsValue() {
		return this.formDetails.asObservable();
	}

	setSaveFormValue(value: FormList) {
		this.saveFormDetails.next(value);
	}
	
	getSaveFormValue() {
		return this.saveFormDetails.asObservable();
	}

    //Get Available Form Api
	getFormList(): Observable<Result<FormList[]>>{
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
		return this._httpClient.get<Result<FormList>>('Api/Form/GetFormSettings', {params})
		
	}
	
	addQuestion(formId: number, sectionId: number, questionType: number): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>('Api/Form/CreateQuestion', {
			formId: formId,
			sectionId: sectionId,
			questionType: questionType
		  })
		
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

	saveFormSettings(form: any): Observable<Result<FormList>> {
		return this._httpClient.post<Result<FormList>>('Api/Form/SaveSettings', form)
		
	}
}
