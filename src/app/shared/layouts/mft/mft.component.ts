import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  signal
} from '@angular/core';
import { API, APIDefinition, Config, DefaultConfig } from 'ngx-easy-table';
@Component({
  selector: 'app-mft',
  templateUrl: './mft.component.html',
  styleUrls: ['./mft.component.scss'],
})
// multi functional table
export class MftComponent {
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  @Input('tableMenuOptions') tableMenuOptions: string[] = []
    //@ts-ignore
  @Input('tableColumns') tableColumns 
    //@ts-ignore
  @Input('tableData') tableData 
  @Input('searchBoxEnable') searchBoxEnable: boolean = false
  @Output('onRowClicked') onRowClicked = new EventEmitter()
  @Output('onTabSelected') onTabSelected = new EventEmitter()
  //@ts-ignore
  @ViewChild('table', { static: true }) table: APIDefinition;


  public tab = signal(this.tableMenuOptions[0])

  public tabSelected(tab: string) {
    this.tab.set(tab);
    this.onTabSelected.emit(tab);
  }

  public configuration: Config = {
    ...DefaultConfig,
    orderEnabled: true,
    threeWaySort: true,
    showDetailsArrow: true,
    rows: 5,
    paginationRangeEnabled: false,
    paginationEnabled: false
  };
  
  previousPage() {
    const res = this.table.apiEvent({
      type: API.getPaginationCurrentPage,
    });
    this.table.apiEvent({
      type: API.setPaginationCurrentPage,
      value: res - 1,
    });

  }
  nextPage() {
    let lastPage = this.table.apiEvent({
      type: API.getPaginationTotalItems,
    });
    const currentPage = this.table.apiEvent({
      type: API.getPaginationCurrentPage,
    });
    console.log( lastPage, this.tableColumns());
    
    if (lastPage > currentPage) {
      this.table.apiEvent({
        type: API.setPaginationCurrentPage,
        value: currentPage + 1,
      });
    }


  }
  constructor() { 
    effect(() =>{
      console.log('mft loaded', this.tableData());
      if(this.tableData().length > 5){
        this.configuration.paginationEnabled = true
      }
    })
  }
  handleInput(event: any) {
    // const query = event.target.value.toLowerCase();
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }
}
