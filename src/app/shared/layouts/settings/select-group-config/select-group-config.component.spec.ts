import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectGroupConfigComponent } from './select-group-config.component';
import {SolanaHelpersServiceMockProvider} from "../../../../services/mocks";
import {Config} from "../../../../models";

describe('SelectGroupConfigComponent', () => {
  let component: SelectGroupConfigComponent;
  let fixture: ComponentFixture<SelectGroupConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SolanaHelpersServiceMockProvider],
      imports: [IonicModule.forRoot(), SelectGroupConfigComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGroupConfigComponent);
    component = fixture.componentInstance;
    component.configs = [] as Config[];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
