import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NftModalItemComponent } from './nft-modal-item.component';
import {NFT} from "../../../models";

describe('NftModalItemComponent', () => {
  let component: NftModalItemComponent;
  let fixture: ComponentFixture<NftModalItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NftModalItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NftModalItemComponent);
    component = fixture.componentInstance;
    component.nft = {} as NFT;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
