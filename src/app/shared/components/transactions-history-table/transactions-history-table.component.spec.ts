import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransactionsHistoryTableComponent } from './transactions-history-table.component';
import {PortfolioServiceMockProvider} from "../../../services/mocks";

describe('TransactionsHistoryTableComponent', () => {
  let component: TransactionsHistoryTableComponent;
  let fixture: ComponentFixture<TransactionsHistoryTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider],
      imports: [IonicModule.forRoot(), TransactionsHistoryTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
