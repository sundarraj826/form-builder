import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormList } from '../../types/forms';
import { Result } from '../../types/result';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionTypes } from '../../types/question-type';
import { AppRoutes } from '../../routes/app-routes';
import { ActivatedRoute, Router } from '@angular/router';
import { empty } from 'rxjs';
import { ResultBase } from '../../types/result-base';

@Component({
  selector: 'create-form-admin',
  templateUrl: './create-form-admin.component.html',
  styleUrls: ['./create-form-admin.component.less']
})
export class CreateFormAdminComponent implements OnInit {
  formResponse!: Result<FormList[]>;
  formid!: number;
  formData!: FormList;
  inputValue!: string;
  saveSettingsForm!: FormList;
  stepForms: FormGroup[] = [];
  saveFormFormat!: FormList;
  @ViewChild('qesSelect') qesSelect!: ElementRef;

  createForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200)
    ])

  })
  saveformSetting!: FormList;

  constructor(private _formService: FormService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.formid = id;
        this.getFormDetails(id);
      }
    });

    this._formService.getFormDetailsValue().subscribe((res: FormList) => {
      this.saveSettingsForm = res;
    })


  }

  get backBtn(): string {
    return '../' + AppRoutes.formListing;
  }

  createFormSubmit() {
    this._formService.addCreateForm(this.createForm.controls.title.value, this.createForm.controls.description.value).subscribe(
      (response: Result<FormList>) => {
        this.getFormDetails(response.value?.formId);
        this.router.navigate(['account/create-form-admin', response.value?.formId]);
      },
      (error) => {
        console.error('Error for form creating:', error);
      }
    );

  }

  getFormDetails(id: any): any {
    this._formService.getFormSetting(id).subscribe((res: Result<FormList>) => {
      if (res.value) {
        this._formService.setFormDetailsValue(res.value);
        this.formData = res.value;
        this.formid = this.formData.formId;
        this.appendValue('title', this.formData.title);
        this.appendValue('description', this.formData.description);


        this._formService.getSaveFormValue().subscribe((tes: FormList) => {
          this.saveFormFormat = tes;
          this.saveFormFormat.formId = this.formid;
          this.saveFormFormat.title = this.formData.title;
          this.saveFormFormat.description = this.formData.description;
          this._formService.setSaveFormValue(this.saveFormFormat);
        })

      }
    });
  }




  get title() {
    return this.createForm.get('title');
  }

  get description() {
    return this.createForm.get('description');
  }

  appendValue(controlName: string, value: any): void {
    const control = this.createForm.get(controlName) as FormControl;
    if (control) {
      control.setValue(value);
    }
  }

  createSection() {
    this._formService.addCreateSection(this.formid).subscribe((result: Result<FormList>) => {
      this.getFormDetails(result.value?.formId);
    });
  }


  lockForm() {
    this._formService.lockForm(this.formid).subscribe((res: ResultBase) => {
      if (res.ok) {
        alert("Form Locked");
      } else {
        alert(res.errors);
      }
    })
  }

  submitForm() {
    this._formService.getFormSetting(this.formData.formId).subscribe((res: Result<FormList>) => {
      this.saveformSetting = res.value!
      this._formService.saveFormSettings(this.saveformSetting).subscribe((res: Result<FormList>) => {
        if (res.ok) {
          alert('Saved');
        } else {
          alert(res.errors)
        }
      });
    });
  }
}
