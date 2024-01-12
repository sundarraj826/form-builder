import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { FormService } from '../../services/form.service';
import { UsersService } from '../../services/users.service';
import { Result } from '../../types/result';
import { FormList } from '../../types/forms';
import { QuestionTypes } from '../../types/question-type';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { coerceStringArray } from '@angular/cdk/coercion';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { StarRatingColor } from '../common/star-rating/star-rating.component';
// import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { FormControlService } from '../../services/form-control.service';
@Component({
  selector: 'tq-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  // toppings = new FormControl('');
  // @ViewChild(UserQuestionsComponent) userQuestionsComponent!: UserQuestionsComponent;
  questionType = QuestionTypes;
  formSetting!: FormList;

  constructor(private _usersService: UsersService, private route: ActivatedRoute, private _fb: FormBuilder, private router: Router,
    private _formControlService: FormControlService) { }

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
      console.log(res)
    });
  }
  submitForm() {
    // if (this.userQuestionsComponent && this.userQuestionsComponent.userAnswersForm.valid) {
    //   this.userQuestionsComponent.onSubmit();
    //   alert("Form has been Submit Successfully!!!");
    //   this.router.navigate(['account/form-listing']);
    // } else {
    //   this.userQuestionsComponent.userAnswersForm.markAllAsTouched();
    // }
    this._formControlService.markAllFormsAsTouched();
    if (this._formControlService.formsValid()) {
      this._usersService.submitResponses(this.formSetting.formId).subscribe((res: Result<FormList>) => {
        // alert(res.ok)
        this.formSetting = res.value!;
        alert("Form Saved Successfully!!!")
        console.log(res)
        this.router.navigate(['account/form-listing']);
      });
    } else {
      alert('You have some required fields left... Please fill all required fields')
    }
  }


  // userFormSubmit() {
  //   this._usersService.submitResponses(this.formSetting.formId).subscribe((res: Result<FormList>) => {
  //     console.log(res)
  //   })
  // }

}
