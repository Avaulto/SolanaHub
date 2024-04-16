import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendNftModalComponent } from './send-nft-modal.component';

describe('SendNftModalComponent', () => {
  let component: SendNftModalComponent;
  let fixture: ComponentFixture<SendNftModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SendNftModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SendNftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
