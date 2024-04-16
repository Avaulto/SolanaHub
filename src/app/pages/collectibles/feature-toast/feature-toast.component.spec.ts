import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from "@ionic/angular";

import { FeatureToastComponent } from './feature-toast.component';

describe('FeatureToastComponent', () => {
  let component: FeatureToastComponent;
  let fixture: ComponentFixture<FeatureToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), FeatureToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
