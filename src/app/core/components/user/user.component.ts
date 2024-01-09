import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { FormService } from '../../services/form.service';
import { UsersService } from '../../services/users.service';
import { Result } from '../../types/result';
import { FormList } from '../../types/forms';
import { QuestionTypes } from '../../types/question-type';
import { ActivatedRoute } from '@angular/router';
import { coerceStringArray } from '@angular/cdk/coercion';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { StarRatingColor } from '../common/star-rating/star-rating.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
@Component({
  selector: 'tq-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  // toppings = new FormControl('');
  @ViewChild(UserQuestionsComponent) userQuestionsComponent!: UserQuestionsComponent;
  questionType = QuestionTypes;
  formSetting!: FormList;

  constructor(private _usersService: UsersService, private route: ActivatedRoute, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.getFormDetails(id);
      }
    });
  }

  //Get form response
  getFormDetails(id: number) {
    this._usersService.getFormWithResponses(id).subscribe((res: Result<FormList>) => {
      this.formSetting = res.value!;
    });
  }
  submitForm() {
    if (this.userQuestionsComponent && this.userQuestionsComponent.userAnswersForm.valid) {
      this.userQuestionsComponent.onSubmit();
    } else {
      this.userQuestionsComponent.userAnswersForm.markAllAsTouched();
    }
  }
  userFormSubmit() {
    this._usersService.submitResponses(this.formSetting.formId).subscribe((res: any) => {
      console.log(res)
    })
  }

}
