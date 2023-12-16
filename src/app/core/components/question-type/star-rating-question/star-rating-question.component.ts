import { Component, OnInit } from '@angular/core';

import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-star-rating-question',
  templateUrl: './star-rating-question.component.html',
  styleUrls: ['./star-rating-question.component.less']
})
export class StarRatingQuestionComponent implements OnInit {
  questionType = QuestionTypes;
  constructor() { }

  ngOnInit(): void {
  }

}
