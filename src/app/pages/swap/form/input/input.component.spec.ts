import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputComponent } from './input.component';
import {JupStoreServiceMockProvider, PortfolioServiceMockProvider} from "../../../../services/mocks";

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [JupStoreServiceMockProvider, PortfolioServiceMockProvider],
      imports: [IonicModule.forRoot(), InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.tokenControl = {};

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
