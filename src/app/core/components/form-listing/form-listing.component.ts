import { Component, OnInit } from '@angular/core';

import { AppRoutes } from '../../routes/app-routes';
import { FormList } from '../../types/forms';
import { FormService } from '../../services/form.service';
import { Result } from '../../types/result';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';


@Component({
	selector: 'tq-form-listing',
	templateUrl: './form-listing.component.html',
	styleUrls: ['./form-listing.component.less']
})
export class FormListingComponent implements OnInit {
	authService: AuthService;
	formResponse!: Result<FormList[]>;
	appRoute = AppRoutes;



	constructor(private _formService: FormService, private _http: HttpClient, public _authService: AuthService) {
		this.authService = _authService;
	}

	ngOnInit() {

		//Get Available Forms - Admin
		this._formService.getFormList().subscribe(
			(response) => {

				this.formResponse = response;
				console.log(this.formResponse.value)
			},
			(error) => {
				console.error('Error fetching response:', error);
			});

	}

	get createFormBtn(): string {
		return '../' + AppRoutes.createFormAdmin;
	}


	editForm(formId: number) {
		// console.log('id: ', formId)
		return '../' + AppRoutes.createFormAdmin + '/' + formId;
	}

	//Delete Form 
	deleteForm(id: number) {
		const delRequest = this._http.delete<Result<FormList[]>>('Api/Form/Delete?formId=' + id);

		delRequest.subscribe(() => {
			this.formResponse.value = this.formResponse.value?.filter((formDel) => {
				return formDel.formId !== id
			})
		})
	}

}