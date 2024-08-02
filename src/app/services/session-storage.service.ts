import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public saveData(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
      
    }
  }

  public getData(key: string) {
    try {
    return sessionStorage.getItem(key)
    }catch (error) {
      console.log(error);
      return null
    }
  }
  public removeData(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    sessionStorage.clear();
  }
}