import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormList } from '../../types/forms';
import { Result } from '../../types/result';
import { FormService } from '../../services/form.service';
import { AbstractControl, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { AppRoutes } from '../../routes/app-routes';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControlService } from '../../services/form-control.service';

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
  appRoute = AppRoutes;
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

  constructor(
    private _formService: FormService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formControlService: FormControlService) {
  }

  ngOnInit(): void {

    this._route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.formid = id;
        this.getFormDetails(id);
      }
    });

    this._formService.getFormDetailsValue().subscribe((res: FormList) => {
      this.saveSettingsForm = res;
      console.log(res)
    })

    //auto save form fields
    this.createForm.get('title')?.setValue(this.formData?.title);
    this.createForm.get('description')?.setValue(this.formData?.description)

    this.createForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((res: FormList) => {
        // const hasValidValues = (res.title.trim() ?? '') !== '' && (res.description.trim() ?? '') !== '';
        const hasValidValues = (res.title?.trim() ?? '') !== '' && (res.description?.trim() ?? '') !== '';

        // console.log(res)
        if (hasValidValues) {
          this.saveFormFormat.title = res.title.trim();
          this.saveFormFormat.description = res.description.trim();
          this._formService.setSaveFormValue(this.saveFormFormat);
          this._formService.autoSaveFormValue().subscribe();
          // console.log(res)
        }
      });


  }

  // get backBtn(): string {
  //   return '../' + AppRoutes.formListing;
  // }

  createFormSubmit() {
    this._formService.addCreateForm(this.createForm.controls.title.value, this.createForm.controls.description.value).subscribe(
      (response: Result<FormList>) => {
        this.getFormDetails(response.value?.formId);

        this._router.navigate(['account/create-form-admin', response.value?.formId]);
      },
      (error) => {
        console.error('Error for form creating:', error);
      }
    );
  }



  getFormDetails(id: any) {
    this._formService.getFormSetting(id).subscribe((res: Result<FormList>) => {

      // console.log(res)
      if (res.value) {
        this._formService.setFormDetailsValue(res.value);
        this.formData = res.value;
        this.formid = this.formData.formId;
        this.appendValue('title', this.formData.title);
        this.appendValue('description', this.formData.description);


        this._formService.getSaveFormValue().subscribe((res: FormList) => {
          this.saveFormFormat = res;
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

  appendValue(controlName: string, value: string): void {
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


  //lock form 
  lockForm() {
    this._formService.lockForm(this.formid).subscribe((res: Result<FormList>) => {
      // console.log(res)
      if (res.ok) {
        alert("Form has been Locked");
        this._router.navigate(['account/form-listing']);
      } else {
        alert(res.errors);
      }

    })
  }


  submitForm() {
    this._formControlService.markAllFormsAsTouched();
    if (this._formControlService.formsValid()) {
      this._formService.getFormSetting(this.formData.formId).subscribe((res: Result<FormList>) => {
        this.saveformSetting = res.value!;
        this._formService.saveFormSettings(this.saveformSetting).subscribe((res) => {
          // alert(res.ok)
          alert("Form Saved Successfully!!!")
          console.log(res)
        });

      });
    } else {
      alert('You have some required fields left... Please fill all required fields to save the form settings')
    }
  }
}
