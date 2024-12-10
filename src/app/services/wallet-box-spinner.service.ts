import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class WalletBoxSpinnerService {
  private readonly state = signal<boolean>(false);
  public readonly spinner = this.state.asReadonly();

  public show(): void {
    this.state.set(true);
  }

  public hide(): void {
    this.state.set(false);
  }
}
