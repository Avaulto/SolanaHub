import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  headerObj = {
    "Content-Type": "application/json",
  };
  private _formatErrors(error: any) {
    console.warn('my err', error)
    // this._toasterService.msg.next({
    //   message: error.message,
    //   segmentClass: "toastError",
    // });
    return throwError((() => error))
  }

  get(path: string, params: HttpParams = new HttpParams(), headers?: any): Observable<any> {
    return this.http
      .get(`${path}`,headers)
      .pipe(
        catchError((error) => this._formatErrors(error))
        )
  }

  put(path: string, formData: FormData): Observable<any> {
    return this.http
      .put(`${path}`, formData, {
        headers: new HttpHeaders({
          // 'enctype': 'multipart/form-data;',
          // 'Accept': 'plain/text'
        }),
      })
      .pipe(
        catchError((error) => this._formatErrors(error))
        );
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${path}`, JSON.stringify(body), {
        headers: new HttpHeaders(this.headerObj),
      })
      .pipe(
        catchError((error) => this._formatErrors(error))
        );
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(`${path}`)
      .pipe(
        catchError((error) => this._formatErrors(error))
      );
  }
}
