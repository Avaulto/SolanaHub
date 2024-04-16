import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmountInputComponent } from './amount-input.component';
import {JupStoreServiceMockProvider} from "../../../services/mocks";
import { Token } from 'src/app/models';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), AmountInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputComponent);
    component = fixture.componentInstance;
    component.token = {} as Token;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
