import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoolStatsComponent } from './pool-stats.component';
import {LoyaltyLeagueServiceMockProvider} from "../../../services/mocks/loyalty-league.service.mock";

describe('PoolStatsComponent', () => {
  let component: PoolStatsComponent;
  let fixture: ComponentFixture<PoolStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyLeagueServiceMockProvider],
      imports: [IonicModule.forRoot(), PoolStatsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoolStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
