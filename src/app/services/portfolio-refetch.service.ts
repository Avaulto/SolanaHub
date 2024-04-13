import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PortfolioFetchService {

  private readonly _fetchPortfolio: Subject<boolean> = new Subject()

  triggerFetch(): void {
    this._fetchPortfolio.next(true);
  }

  refetchPortfolio(): Observable<boolean> {
    return this._fetchPortfolio.asObservable();
  }
}
