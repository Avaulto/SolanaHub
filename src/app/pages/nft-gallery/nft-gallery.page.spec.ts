import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NftGalleryPage } from './nft-gallery.page';

describe('NftGalleryPage', () => {
  let component: NftGalleryPage;
  let fixture: ComponentFixture<NftGalleryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NftGalleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
