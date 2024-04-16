import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { ActionBoxComponent } from './action-box.component';
import {SolanaHelpersServiceMockProvider, TxInterceptorServiceMockProvider, JupStoreServiceMockProvider} from "../../../../../services/mocks";
import {Token} from "../../../../../models";

describe('ActionBoxComponent', () => {
  let component: ActionBoxComponent;
  let fixture: ComponentFixture<ActionBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SolanaHelpersServiceMockProvider, TxInterceptorServiceMockProvider, JupStoreServiceMockProvider],
      imports: [ActionBoxComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionBoxComponent);
    component = fixture.componentInstance;
    component.token = {} as Token;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
