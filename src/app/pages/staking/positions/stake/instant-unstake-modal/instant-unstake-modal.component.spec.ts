import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstantUnstakeModalComponent } from './instant-unstake-modal.component';
import {Stake} from "../../../../../models";
import {JupStoreServiceMockProvider} from "../../../../../services/mocks";

describe('InstantUnstakeModalComponent', () => {
  let component: InstantUnstakeModalComponent;
  let fixture: ComponentFixture<InstantUnstakeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), InstantUnstakeModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InstantUnstakeModalComponent);
    component = fixture.componentInstance;
    component.stake = {} as Stake;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
