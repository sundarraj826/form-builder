import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormList, CreateQuestion, FormSection, Question } from '../../types/forms';
import { QuestionTypes } from '../../types/question-type';
import { FormService } from '../../services/form.service';
import { Result } from '../../types/result';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tq-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.less']
})
export class CreateSectionComponent implements OnInit {
  stepForms: FormGroup[] = [];
  // selectedTeam = '';
  questionType = QuestionTypes;
  questionTypes = Object.values(QuestionTypes).filter(value => typeof value === 'string') as string[];
  @Input('formData') formData!: FormList;
  questionset: number = 0;
  // createQuestion: CreateQuestion[] = []
  saveFormFormat!: FormList;
  questionNull: Question = new Question();


  constructor(private _fb: FormBuilder, private _formService: FormService, private _http: HttpClient) { }

  ngOnInit(): void {


    this._formService.getSaveFormValue().subscribe((res: FormList) => {
      console.log(res)
      this.saveFormFormat = res;
      this.saveFormFormat.sections = [];
    });


    this.formData?.sections.forEach((section, index) => {
      const formGroup = this._fb.group({
        name: new FormControl(''),
        description: new FormControl(''),
        sectionId: [''],
        formId: [''],
        questionType: [''],
      });




      this.stepForms.push(formGroup);

      if (this.formData.sections[index].name)
        this.stepForms[index].get('name')?.setValue(this.formData.sections[index].name);
      if (this.formData.sections[index].description)
        this.stepForms[index].get('description')?.setValue(this.formData.sections[index].description);

      this.stepForms[index].valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged()
        )
        .subscribe((res: FormSection) => {
          const hasValidValues = (res.name?.trim() ?? '') !== '' && (res.description?.trim() ?? '') !== '';
          if (hasValidValues) {
            this.saveFormFormat.sections[index] = {
              ...this.saveFormFormat.sections[index],
              ...res,
              questions: []
            };
            this._formService.setSaveFormValue(this.saveFormFormat);
            this._formService.autoSaveFormValue().subscribe();
          }
        });


    });

  }


  // getRange(count: number): number[] {
  //   return new Array(count).fill(0).map((_, index) => index + 1);
  // }

  makeEnum(value: string) {
    const enumValue: QuestionTypes = QuestionTypes[value as keyof typeof QuestionTypes];
    return enumValue!;
  }


  // addQuestionSet() {
  //   this.questionset = this.questionset + 1;
  // }

  createQuestion(section: FormSection, question: FormGroup) {
    if (this.makeEnum(question.value.questionType) != undefined) {
      this._formService.addQuestion(this.formData.formId,
        section.sectionId,
        this.makeEnum(question.value.questionType)).subscribe((res: Result<FormList>) => {
          this._formService.setFormDetailsValue(res.value!);
          question.get('questionType')?.setValue(null);
        });
    }
  }

  deleteSection(id: number) {
    this._formService.deleteSection(this.formData.formId, id).subscribe((res: Result<FormList>) => {
      this._formService.setFormDetailsValue(res.value!);

    })
  }

}
