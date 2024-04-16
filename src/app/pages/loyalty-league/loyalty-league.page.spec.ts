import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {IonicModule} from "@ionic/angular";

import { LoyaltyLeaguePage } from './loyalty-league.page';
import {LoyaltyLeagueServiceMockProvider} from "../../services/mocks/loyalty-league.service.mock";
import {SolanaHelpersServiceMockProvider} from "../../services/mocks/solana-helpers.service.mock";
import {ActivatedRoute} from "@angular/router";

describe('LoyaltyLeaguePage', () => {
  let component: LoyaltyLeaguePage;
  let fixture: ComponentFixture<LoyaltyLeaguePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyLeagueServiceMockProvider, SolanaHelpersServiceMockProvider, {provide: ActivatedRoute, useValue: jest.fn()}],
      imports: [IonicModule.forRoot(), LoyaltyLeaguePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoyaltyLeaguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
