import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BurnNftModalComponent } from './burn-nft-modal.component';

describe('BurnNftModalComponent', () => {
  let component: BurnNftModalComponent;
  let fixture: ComponentFixture<BurnNftModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BurnNftModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BurnNftModalComponent);
    component = fixture.componentInstance;
    component.nfts = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
