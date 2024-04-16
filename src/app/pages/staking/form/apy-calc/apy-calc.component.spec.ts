import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApyCalcComponent } from './apy-calc.component';

describe('ApyCalcComponent', () => {
  let component: ApyCalcComponent;
  let fixture: ComponentFixture<ApyCalcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ApyCalcComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ApyCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
