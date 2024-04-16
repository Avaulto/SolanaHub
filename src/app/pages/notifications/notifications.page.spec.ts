import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { NotificationsPage } from './notifications.page';
import {IonicModule} from "@ionic/angular";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NotificationsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
