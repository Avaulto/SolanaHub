import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { NotificationsPage } from './notifications.page';
import {IonicModule} from "@ionic/angular";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {SolanaHelpersServiceMockProvider} from "../../services/mocks";
import {NotificationsService} from "../../services/notifications.service";

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: NotificationsService, useValue: { getMessages: jest.fn()}}],
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
