import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DaoGroupComponent } from './dao-group.component';

describe('DaoGroupComponent', () => {
  let component: DaoGroupComponent;
  let fixture: ComponentFixture<DaoGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), DaoGroupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DaoGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
