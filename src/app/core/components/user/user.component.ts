import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { FormService } from '../../services/form.service';
import { UsersService } from '../../services/users.service';
import { Result } from '../../types/result';
import { FormList } from '../../types/forms';
import { QuestionTypes } from '../../types/question-type';
import { ActivatedRoute } from '@angular/router';
import { coerceStringArray } from '@angular/cdk/coercion';
// import { StarRatingColor } from '../common/star-rating/star-rating.component';

@Component({
  selector: 'tq-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  // toppings = new FormControl('');

  questionType = QuestionTypes;

  formSetting!: FormList;
  rating: number = 0;
  starCount: number = 5;

  userAnswersForm = new FormGroup({
    numericAnswer: new FormControl(),
    signleTypeAnswer: new FormControl(),
    multiTypeAnswer: new FormControl(),
    // ratingAnswer: new FormControl(),
    texTypeAnswer: new FormControl(),
    booleanTypeAnswer: new FormControl()
  })

  constructor(private _usersService: UsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.getFormDetails(id);
      }
    });

  }

  //Star Ratings
  onRatingChanged(rating: number) {
    // console.log(rating);
    this.rating = rating;

  }

  //Get form response
  getFormDetails(id: number) {
    this._usersService.getFormWithResponses(id).subscribe((res: Result<FormList>) => {
      this.formSetting = res.value!;
    });
  }

  userFormSubmit() {
    console.log(this.userAnswersForm.value)
  }

}
