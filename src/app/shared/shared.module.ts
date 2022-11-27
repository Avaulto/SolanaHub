import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";


// import pipes
import { FilterPipe, SafePipe, ReversePipe } from "./pipes";

// import componenets
import {
  DataBoxComponent,
  LogoComponent,
  WalletNotConnectedStateComponent,
  GoBackBtnComponent,
  WalletConnectComponent,
  WalletAdapterOptionsComponent,
  WalletConnectedDropdownComponent,
  LoaderComponent,
  SelectBoxComponent,
  SelectItemComponent,
  LabelLayoutComponent,
  NftPreviewComponent,
  TransactionReviewComponent,
  ImagePlaceholderComponent,
  NftBurnComponent,
  NftListingComponent,
  NftSendComponent,
  ChartComponent,
  StakeComponent,
  ApyCalcComponent,
  SearchInputComponent
} from "./components";

// // import directives
// import {
  
  // } from "./directives";
  

  // font awesome
  import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

  // toop tip
<<<<<<< HEAD
  import { TooltipModule } from '@cloudfactorydk/ng2-tooltip-directive';
  import { CustomInterceptor } from "../services";
=======
import { CustomInterceptor } from "../services";
import { TooltipModule } from "@cloudfactorydk/ng2-tooltip-directive";
>>>>>>> hotfix/0.2.1
@NgModule({
  declarations: [
    FilterPipe,
    SafePipe,
    ReversePipe,
    ReversePipe,
    DataBoxComponent,
    LogoComponent,
    GoBackBtnComponent,
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    LoaderComponent,
    SelectBoxComponent,
    SelectItemComponent,
    LabelLayoutComponent,
    NftPreviewComponent,
    TransactionReviewComponent,
    ImagePlaceholderComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    ChartComponent,
    WalletNotConnectedStateComponent,
    StakeComponent,
    ApyCalcComponent,
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FontAwesomeModule,
    IonicModule,
    TooltipModule,
    
  ],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
  ],
  exports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    RouterModule,
    FilterPipe,
    SafePipe,
    ReversePipe,
    DataBoxComponent,
    LogoComponent,
    GoBackBtnComponent,
    TooltipModule,
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    LoaderComponent,
    SelectBoxComponent,
    SelectItemComponent,
    LabelLayoutComponent,
    NftPreviewComponent,
    TransactionReviewComponent,
    ImagePlaceholderComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    ChartComponent,
    WalletNotConnectedStateComponent,
    StakeComponent,
    ApyCalcComponent,
    SearchInputComponent
  ]
})
export class SharedModule {}
