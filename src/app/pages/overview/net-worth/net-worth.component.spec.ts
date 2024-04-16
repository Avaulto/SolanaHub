import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NetWorthComponent } from './net-worth.component';
import {PortfolioServiceMockProvider} from "../../../services/mocks";

describe('NetWorthComponent', () => {
  let component: NetWorthComponent;
  let fixture: ComponentFixture<NetWorthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider],
      imports: [IonicModule.forRoot(), NetWorthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NetWorthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
