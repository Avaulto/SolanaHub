import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PointsStatsComponent } from './points-stats.component';
import {LoyaltyLeagueServiceMockProvider} from "../../../services/mocks/loyalty-league.service.mock";

describe('PointsStatsComponent', () => {
  let component: PointsStatsComponent;
  let fixture: ComponentFixture<PointsStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyLeagueServiceMockProvider],
      imports: [IonicModule.forRoot(), PointsStatsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PointsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
