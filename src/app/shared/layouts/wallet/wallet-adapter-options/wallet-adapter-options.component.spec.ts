import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletAdapterOptionsComponent } from './wallet-adapter-options.component';
import {WalletStore} from "@heavy-duty/wallet-adapter";
import {of} from "rxjs";

describe('WalletAdapterOptionsComponent', () => {
  let component: WalletAdapterOptionsComponent;
  let fixture: ComponentFixture<WalletAdapterOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WalletStore, useValue: { wallets$: of()}}],
      declarations: [ WalletAdapterOptionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletAdapterOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
