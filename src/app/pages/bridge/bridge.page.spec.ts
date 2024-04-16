import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { BridgePage } from './bridge.page';

describe('BridgePage', () => {
  let component: BridgePage;
  let fixture: ComponentFixture<BridgePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BridgePage]
    }).compileComponents();

    fixture = TestBed.createComponent(BridgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
