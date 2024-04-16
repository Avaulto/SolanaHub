import {ApiService} from "../api.service";
import {Observable, of} from "rxjs";

class ApiServiceMock {
  get(...args): Observable<any> {
    return of({})
  }

  put(...args): Observable<any> {
    return of({})
  }

  post(...args): Observable<any> {
    return of({})
  }
}

export const ApiServiceMockProvider = {
  provide: ApiService,
  useClass: ApiServiceMock
}
