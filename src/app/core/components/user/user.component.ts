import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StarRatingColor } from '../common/star-rating/star-rating.component';

@Component({
  selector: 'tq-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  toppings = new FormControl('');
  toppingList: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];


  rating: number = 3;
  starCount: number = 5;
  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;
  constructor() { }

  ngOnInit(): void {


  }

  onRatingChanged(rating: any) {
    console.log(rating);
    this.rating = rating;

  }
}
