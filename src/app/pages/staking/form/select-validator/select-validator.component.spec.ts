import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import { SelectValidatorComponent } from './select-validator.component';

describe('SelectValidatorComponent', () => {
  let component: SelectValidatorComponent;
  let fixture: ComponentFixture<SelectValidatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ModalController, useValue: jest.fn()}],
      imports: [SelectValidatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
