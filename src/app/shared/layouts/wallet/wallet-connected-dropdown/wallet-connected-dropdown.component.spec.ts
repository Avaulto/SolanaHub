import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletConnectedDropdownComponent } from './wallet-connected-dropdown.component';
import {PortfolioServiceMockProvider} from "../../../../services/mocks";
import {WalletStore} from "@heavy-duty/wallet-adapter";
import {of} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('WalletConnectedDropdownComponent', () => {
  let component: WalletConnectedDropdownComponent;
  let fixture: ComponentFixture<WalletConnectedDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, { provide: WalletStore, useValue: jest.fn() }],
      declarations: [ WalletConnectedDropdownComponent],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletConnectedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
