import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LockStakeComponent } from './lock-stake.component';

describe('LockStakeComponent', () => {
  let component: LockStakeComponent;
  let fixture: ComponentFixture<LockStakeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), LockStakeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LockStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
