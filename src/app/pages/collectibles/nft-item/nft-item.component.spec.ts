import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NftItemComponent } from './nft-item.component';

describe('NftItemComponent', () => {
  let component: NftItemComponent;
  let fixture: ComponentFixture<NftItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NftItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NftItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
