import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplitModalComponent } from './split-modal.component';
import {JupStoreServiceMockProvider} from "../../../../../services/mocks";
import {Stake} from "../../../../../models";

describe('SplitModalComponent', () => {
  let component: SplitModalComponent;
  let fixture: ComponentFixture<SplitModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), SplitModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SplitModalComponent);
    component = fixture.componentInstance;
    component.stake = {} as Stake;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
