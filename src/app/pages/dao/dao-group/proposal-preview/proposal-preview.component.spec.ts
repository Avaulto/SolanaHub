import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProposalPreviewComponent } from './proposal-preview.component';

describe('ProposalPreviewComponent', () => {
  let component: ProposalPreviewComponent;
  let fixture: ComponentFixture<ProposalPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ProposalPreviewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
