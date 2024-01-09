import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../types/result';
import { FormList, responses } from '../types/forms';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _httpClient: HttpClient) { }



  /**User API's */
  //Get Form Responses
  getFormWithResponses(id: number): Observable<Result<FormList>> {
    const params = new HttpParams().set('formId', id.toString());
    return this._httpClient.get<Result<FormList>>('Api/Form/GetFormWithResponses', { params })
  }


  submitResponses(id: number): Observable<Result<FormList>> {
    return this._httpClient.post<Result<FormList>>(`Api/Form/SubmitResponses?formId=${id}`, {})
  }

  autoSaveFormResponses(result: responses): Observable<Result<FormList>> {
    return this._httpClient.post<Result<FormList>>('Api/Form/SaveResponses', result);
  }
}
