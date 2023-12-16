import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormList } from '../../types/forms';
import { Result } from '../../types/result';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionTypes } from '../../types/question-type';
import { AppRoutes } from '../../routes/app-routes';
import { ActivatedRoute, Router } from '@angular/router';
import { empty } from 'rxjs';

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
      console.log(result);
      this.getFormDetails(result.value?.formId);
    });
  }

  saveFormSetting(event: any) {
    // if(event.formId)
      // this.getFormDetails(event.formId);

    if(event.sectionId){
        this.saveSettingsForm.sections.some((section, sectionIndex) => { 
            if(section.sectionId === event.sectionId) {
              if(event.Section)
                  this.saveSettingsForm.sections[sectionIndex].name = event.Section;
              if(event.sectionDesc)
                  this.saveSettingsForm.sections[sectionIndex].description = event.sectionDesc;

              if(event.questionId) {
                section.questions.some((question, quesIndex) => {
                  if(question.questionId === event.questionId) {
                    console.log(event)
                      this.saveSettingsForm.sections[sectionIndex].questions[quesIndex].type = event.questionType;
                      this.saveSettingsForm.sections[sectionIndex].questions[quesIndex].text = event.question;
                      this.saveSettingsForm.sections[sectionIndex].questions[quesIndex].required = event.isRequired;
                  }
                 });
              }
            }

        });
    }


    
    // this.saveSettingsForm.formId = 346;
    // this.saveSettingsForm.sections[0].sectionId = 347;
    // this.saveSettingsForm.sections[0].name = "Section Name";
    // this.saveSettingsForm.sections[0].description = "description Desc";
    // this.saveSettingsForm.sections[0].questions[0].questionId = 348;
    // this.saveSettingsForm.sections[0].questions[0].text = "How are you?";
    // this.saveSettingsForm.sections[0].questions[0].required = true;

    console.log(this.saveSettingsForm)
    this._formService.saveFormSettings(this.saveSettingsForm).subscribe(res => {

   });
  }


}
