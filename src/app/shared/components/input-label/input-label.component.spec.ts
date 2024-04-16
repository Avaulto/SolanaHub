import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputLabelComponent } from './input-label.component';
import {PortfolioServiceMockProvider, UtilServiceMockProvider} from "../../../services/mocks";
import {Token} from "../../../models";

describe('InputLabelComponent', () => {
  let component: InputLabelComponent;
  let fixture: ComponentFixture<InputLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, UtilServiceMockProvider],
      imports: [IonicModule.forRoot(), InputLabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputLabelComponent);
    component = fixture.componentInstance;
    component.asset = {} as Token;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
