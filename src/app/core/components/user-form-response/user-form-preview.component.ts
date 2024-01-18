import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Result } from '../../types/result';
import { FormList } from '../../types/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tq-user-form-preview',
  templateUrl: './user-form-preview.component.html',
  styleUrls: ['./user-form-preview.component.less']
})
export class UserFormResponseComponent implements OnInit {
  formResponse!: FormList;
  constructor(private _usersService: UsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.getFormDetails(id);
      }
    });

  }
  getFormDetails(id: number) {
    this._usersService.getFormWithResponses(id).subscribe((res: Result<FormList>) => {
      console.log(res.value)
      this.formResponse = res.value!;
    });
  }

}
