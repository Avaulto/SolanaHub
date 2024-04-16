import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimatedIconComponent } from './animated-icon.component';

describe('AnimatedIconComponent', () => {
  let component: AnimatedIconComponent;
  let fixture: ComponentFixture<AnimatedIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AnimatedIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
