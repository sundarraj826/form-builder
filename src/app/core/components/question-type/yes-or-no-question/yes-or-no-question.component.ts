import { Component, OnInit } from '@angular/core';

import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-yes-or-no-question',
  templateUrl: './yes-or-no-question.component.html',
  styleUrls: ['./yes-or-no-question.component.less']
})
export class YesOrNoQuestionComponent implements OnInit {
  questionType = QuestionTypes;
  constructor() { }

  ngOnInit(): void {
  }

}
