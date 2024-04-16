import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OptionsPopoverComponent } from './options-popover.component';
import {LiquidStakeServiceMockProvider, SolanaHelpersServiceMockProvider} from "../../../../../services/mocks";
import {Stake} from "../../../../../models";

describe('OptionsPopoverComponent', () => {
  let component: OptionsPopoverComponent;
  let fixture: ComponentFixture<OptionsPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [ SolanaHelpersServiceMockProvider, LiquidStakeServiceMockProvider ],
      imports: [IonicModule.forRoot(), OptionsPopoverComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsPopoverComponent);
    component = fixture.componentInstance;
    component.stake = {} as Stake;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
