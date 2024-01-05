import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormList, FormSection, Question } from '../../types/forms';
import { QuestionTypes } from '../../types/question-type';
import { FormService } from '../../services/form.service';
import { Result } from '../../types/result';
import { debounceTime, distinctUntilChanged, first, skip } from 'rxjs/operators';

@Component({
  selector: 'tq-question-type',
  templateUrl: './question-type.component.html',
  styleUrls: ['./question-type.component.less']
})
export class QuestionTypeComponent implements OnInit {
  // selectedTeam = '';
  questionType = QuestionTypes;
  questionTypes = Object.values(QuestionTypes).filter(value => typeof value === 'string') as string[];
  // questionForms: FormGroup[] = [];

  @Input('sectionIndex') sectionIndex!: number;
  @Input('questionIndex') questionIndex!: number;
  @Input('formData') formData!: FormList;
  @Input('section') section!: FormSection;
  @Input('question') question!: Question;
  constructor(private _fb: FormBuilder, private _formService: FormService) { }

  // form!: FormGroup;
  options!: FormArray;
  questionForms = new FormGroup({
    formId: new FormControl(''),
    sectionId: new FormControl(''),
    questionId: new FormControl(''),
    question: new FormControl(''),
    questionType: new FormControl(''),
    isRequired: new FormControl(''),
    // responseOptions: new FormControl('')

  })

  ngOnInit(): void {

  }

  // createItem(): FormGroup {
  //   return this._fb.group({
  //     field: ''
  //   });
  // }



  getQuestionType(value: number): QuestionTypes {
    return QuestionTypes[value as unknown as keyof typeof QuestionTypes];
  }

  // makeEnum(value: number | string) {
  //   const enumValue: QuestionTypes = QuestionTypes[value as keyof typeof QuestionTypes];
  //   return enumValue!;
  // }

  deleteQuestion(question: Question) {
    this._formService.deleteQuestion(this.formData.formId, this.section.sectionId, question.questionId).subscribe((res: Result<FormList>) => {
      this._formService.setFormDetailsValue(res.value!);
    });

  }


}
