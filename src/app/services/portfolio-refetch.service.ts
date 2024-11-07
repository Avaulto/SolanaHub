import { Injectable } from "@angular/core";
import { Observable, shareReplay, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PortfolioFetchService {

  private refetchSubject = new Subject<{shouldRefresh: boolean, fetchType: 'full' | 'partial'}>();

  refetchPortfolio() {
    return this.refetchSubject.asObservable();
  }

  triggerFetch(fetchType: 'full' | 'partial' = 'partial') {
    this.refetchSubject.next({shouldRefresh: true, fetchType});
  }


}
