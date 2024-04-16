import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddressInputComponent } from './address-input.component';
import {UtilServiceMockProvider} from "../../../services/mocks";

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UtilServiceMockProvider],
      imports: [IonicModule.forRoot(), AddressInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
