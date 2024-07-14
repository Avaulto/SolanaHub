import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExtractableStakeAccountsComponent } from './extractable-stake-accounts.component';

describe('ExtractableStakeAccountsComponent', () => {
  let component: ExtractableStakeAccountsComponent;
  let fixture: ComponentFixture<ExtractableStakeAccountsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractableStakeAccountsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExtractableStakeAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
