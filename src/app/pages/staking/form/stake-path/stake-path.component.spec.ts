import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StakePathComponent } from './stake-path.component';

describe('StakePathComponent', () => {
  let component: StakePathComponent;
  let fixture: ComponentFixture<StakePathComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StakePathComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StakePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
