import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormComponent } from './form.component';
import {JupStoreServiceMockProvider, SolanaHelpersServiceMockProvider} from "../../../services/mocks";
import {ActivatedRoute} from "@angular/router";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SolanaHelpersServiceMockProvider, JupStoreServiceMockProvider, {
        provide: ActivatedRoute, useValue: jest.fn() }],
      imports: [IonicModule.forRoot(), FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
