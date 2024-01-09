import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tq-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.less']
})
export class StarRatingComponent implements OnInit {

  @Input('rating') rating!: number;
  @Input('starCount') starCount!: number;
  @Input('disabled') disabled!: boolean;
  // @Input('color') color: string = 'primary';
  @Output() ratingUpdated = new EventEmitter();

  snackBarDuration: number = 2000;
  ratingArr: number[] = [];

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    // console.log('a ' + this.starCount);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: number) {
    console.log(rating);
    // this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
    //   duration: this.snackBarDuration,
    // });
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}

