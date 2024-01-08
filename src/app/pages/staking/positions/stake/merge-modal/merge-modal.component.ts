import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { StakeAccount } from 'src/app/models';
import { StakeComponent } from '../stake.component';
import {
  IonLabel,
  IonInput,
  IonText,
  IonCheckbox
} from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DecimalPipe, NgClass } from '@angular/common';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilService } from 'src/app/services';
@Component({
  selector: 'merge-modal',
  templateUrl: './merge-modal.component.html',
  styleUrls: ['./merge-modal.component.scss'],
  standalone:true,
  imports: [
    StakeComponent, 
    IonLabel,
    IonInput,
    IonText,
    IonCheckbox,
    ScrollingModule,
    NgClass,
    DecimalPipe
  ]
})
export class MergeModalComponent  implements OnInit {
  @Input() targetStakeAccount: StakeAccount;
  @Input() stakeAccounts: StakeAccount[];
  @Output() onAccountsSelected = new EventEmitter();
  @ViewChildren('checkAccounts') checkAccounts: QueryList<IonCheckbox>
  public accountsToMerge: WritableSignal<StakeAccount[]> = signal(null);
  public mergedBalance = computed(() => this.accountsToMerge() ? this.accountsToMerge().reduce((accumulator, currentValue: StakeAccount) => accumulator + currentValue.balance, 0): 0)
  public selectedAccounts =[]
  constructor() {
    effect(() => console.log(this.accountsToMerge(), this.mergedBalance()))
  }

  selectAccount(checkbox, valid){
    if(valid){

      checkbox.checked = !checkbox.checked
      const checkedItems = this.checkAccounts.filter(box => box.checked).map(item => item.value)

      this.accountsToMerge.set(checkedItems)
      // this.accountsToMerge.update(checkedItems => checkedItems = checkedItems.push(this.targetStakeAccount))
      console.log(this.accountsToMerge());
      if(this.accountsToMerge().length > 0){
        this.onAccountsSelected.emit({accountsToMerge: this.accountsToMerge()})
      }
    }
    
  }


  ngOnInit() {
    // hide the target stake account from the list 
    this.stakeAccounts = this.stakeAccounts.filter(acc => acc.addr != this.targetStakeAccount.addr);
  }
}
