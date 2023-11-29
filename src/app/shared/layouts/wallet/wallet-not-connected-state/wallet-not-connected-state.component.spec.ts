import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletNotConnectedStateComponent } from './wallet-not-connected-state.component';

describe('WalletNotConnectedStateComponent', () => {
  let component: WalletNotConnectedStateComponent;
  let fixture: ComponentFixture<WalletNotConnectedStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletNotConnectedStateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletNotConnectedStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
