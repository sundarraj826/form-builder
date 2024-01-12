import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControlService } from 'src/app/core/services/form-control.service';
import { UsersService } from 'src/app/core/services/users.service';
import { FormList, Question, responses } from 'src/app/core/types/forms';
import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-user-questions',
  templateUrl: './user-questions.component.html',
  styleUrls: ['./user-questions.component.less']
})
export class UserQuestionsComponent implements OnInit {

  @Input('questions') questions!: any;
  @Input('index') index!: number;
  @Input('formId') formId!: number;
  questionType = QuestionTypes;
  rating: number = 0;
  userAnswersForm!: FormGroup;
  formResponses: responses = new responses();
  @Output() formSubmitted = new EventEmitter();

  constructor(private _fb: FormBuilder, private _userService: UsersService, private _cdr: ChangeDetectorRef, private formControlService: FormControlService) { }

  ngOnInit(): void {
    this.createForm();
    this.subscribeToFormChanges();

    // console.log(this.questionType)
    if (this.questions.response) {
      if (this.questions.questionType == 5) {
        const selectedOption = this.questions.response.split('|');
        this.userAnswersForm.get('question' + this.index)?.setValue(Object.values(selectedOption));
      }
      else if (this.questions.questionType == 4) {
        this.rating = this.questions.response;
      }
      else
        this.userAnswersForm.get('question' + this.index)?.setValue(this.questions.response);

      this._cdr.detectChanges();
    }

  }


  private createForm(): void {
    this.userAnswersForm = this._fb.group({
      ['question' + this.index]: [null, this.questions.required ? Validators.required : null],
      // ['numericAnswer' + this.index]: [null, this.questions.required ? Validators.required : null],
    }) as FormGroup;
    this.formControlService.registerForm(this.userAnswersForm);
    // console.log(this.userAnswersForm)
  }


  private subscribeToFormChanges(): void {
    this.userAnswersForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        // console.log(res)
        let responseObjValue;
        if (res['question' + this.index] instanceof Object) {
          if (res['question' + this.index].length > 0)
            responseObjValue = res['question' + this.index].map((item: { key: string; }) => `${item}`).join('|');
          else
            responseObjValue = res['question' + this.index].key;
        } else {
          responseObjValue = res['question' + this.index];
        }
        this.saveResponse(responseObjValue);
      });
  }


  onSubmit() {
    Object.values(this.userAnswersForm.controls).forEach(control => {
      console.log(control)
      control.markAsTouched();
    });
    this.formSubmitted.emit();
  }

  onRatingChanged(rating: number, index: number) {
    // console.log(rating);
    this.rating = rating;
    this.saveResponse(this.rating);
    this.userAnswersForm.get('question' + index)?.setValue(rating)
  }


  saveResponse(response: any) {
    this.formResponses.formId = this.formId;
    this.formResponses.responses = [{
      questionId: this.questions.questionId,
      response: response
    }];

    this._userService.autoSaveFormResponses(this.formResponses).subscribe(res => {
      // console.log(res);
    });
  }



}
