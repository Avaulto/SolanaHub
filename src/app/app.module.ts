import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';


import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';
import { SideMenuPage } from './side-menu/side-menu.page';
import { TabsMenuComponent } from './tabs-menu/tabs-menu.component';
import { inject } from '@vercel/analytics';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LogoComponent } from './side-menu/logo/logo.component';
import { OptionsPopupComponent } from './settings/options-popup/options-popup.component';
import { SettingsComponent } from './settings/settings.component';
import { WalletModule } from './shared/wallet.module';
import { LoyaltyModule } from './pages/stake-with-us/loyalty/loyalty.module';
import { V2PopupComponent } from './v2-popup/v2-popup.component';

inject({mode: "auto"});

@NgModule({
    schemas: [ CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        V2PopupComponent,
        AppComponent,
        LogoComponent,
        SideMenuPage,
        TabsMenuComponent,
        OptionsPopupComponent,
        SettingsComponent,
    ],
    imports: [
        LoyaltyModule,
        WalletModule,
        HttpClientModule,
        IonicModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HdWalletAdapterModule.forRoot({ autoConnect: true })
    ],
    providers: [
        DecimalPipe,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
     
    }
}
