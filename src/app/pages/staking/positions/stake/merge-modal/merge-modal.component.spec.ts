import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MergeModalComponent } from './merge-modal.component';
import {JupStoreServiceMockProvider} from "../../../../../services/mocks";
import {Stake} from "../../../../../models";

describe('MergeModalComponent', () => {
  let component: MergeModalComponent;
  let fixture: ComponentFixture<MergeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), MergeModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MergeModalComponent);
    component = fixture.componentInstance;
    component.stakeAccounts = [];
    component.targetStake = {} as Stake;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
