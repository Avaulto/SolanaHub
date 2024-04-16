import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmptySubsComponent } from './empty-subs.component';
import {NotificationsService} from "../../../services/notifications.service";

describe('EmptySubsComponent', () => {
  let component: EmptySubsComponent;
  let fixture: ComponentFixture<EmptySubsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: NotificationsService, useValue: { getDapps: jest.fn()}}],
      imports: [IonicModule.forRoot(), EmptySubsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptySubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
