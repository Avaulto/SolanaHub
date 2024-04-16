import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferAuthModalComponent } from './transfer-auth-modal.component';
import {JupStoreServiceMockProvider} from "../../../../../services/mocks";
import {Stake} from "../../../../../models";

describe('TransferAuthModalComponent', () => {
  let component: TransferAuthModalComponent;
  let fixture: ComponentFixture<TransferAuthModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), TransferAuthModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferAuthModalComponent);
    component = fixture.componentInstance;
    component.stake = {} as Stake;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
