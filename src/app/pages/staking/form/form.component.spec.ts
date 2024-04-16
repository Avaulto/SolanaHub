import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import { FormComponent } from './form.component';
import {
  JupStoreServiceMockProvider,
  LiquidStakeServiceMockProvider,
  LoyaltyLeagueServiceMockProvider,
  SolanaHelpersServiceMockProvider
} from "../../../services/mocks";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ModalController, useValue: jest.fn()}, JupStoreServiceMockProvider, LoyaltyLeagueServiceMockProvider, SolanaHelpersServiceMockProvider, LiquidStakeServiceMockProvider],
      imports: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
