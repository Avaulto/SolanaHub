import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListNftModalComponent } from './list-nft-modal.component';

describe('ListNftModalComponent', () => {
  let component: ListNftModalComponent;
  let fixture: ComponentFixture<ListNftModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ListNftModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ListNftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
