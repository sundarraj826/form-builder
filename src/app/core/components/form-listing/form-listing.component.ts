import { Component, OnInit } from '@angular/core';

import { AppRoutes } from '../../routes/app-routes';
import { FormList } from '../../types/forms';
import { FormService } from '../../services/form.service';
import { Result } from '../../types/result';
import { HttpClient } from '@angular/common/http';



@Component({
	selector: 'tq-form-listing',
	templateUrl: './form-listing.component.html',
	styleUrls: ['./form-listing.component.less']
})
export class FormListingComponent implements OnInit {
	formResponse!: Result<FormList[]>;


	constructor(private _formService: FormService, private _http: HttpClient) { }

	ngOnInit() {

		//Get Available Forms - Admin
		this._formService.getFormList().subscribe(
			(response) => {
				console.log(response)
				this.formResponse = response;
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
