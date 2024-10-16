import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  effect,
  signal
} from '@angular/core';

import { API, APIDefinition, Config, DefaultConfig } from 'ngx-easy-table';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-mft',
  templateUrl: './mft.component.html',
  styleUrls: ['./mft.component.scss'],
})
// multi functional table
export class MftComponent implements OnInit {
  @Input() label: string;
  @Input() desc: string;
  @Input() tableId: string;
  @Input() checkBox: boolean = false
  @Input() paginationEnabled: boolean = false
  @Input() tableRows = 5;
  @Input() tableMenuOptions: string[] = []
  @Input() tableColumns
  @Input() tableData
  @Input() expandDetails: boolean = false


  @Input('searchBoxEnable') searchBoxEnable: boolean = false
  @Output() onData = new EventEmitter()
  @Output('onTabSelected') onTabSelected = new EventEmitter()
  @Output('onSearch') onSearch = new EventEmitter()

  //@ts-ignore
  @ViewChild('table', { static: true }) table: APIDefinition;


  public tab = signal(this.tableMenuOptions[0])

  public tabSelected(tab: string) {
    this.tab.set(tab);
    this.onTabSelected.emit(tab);
    this.table.apiEvent({
      type: API.setPaginationCurrentPage,
      value: 1,
    });
  }

  public configuration: Config = {
    ...DefaultConfig,
    orderEnabled: true,
    // threeWaySort: true,
    showDetailsArrow: true,
    paginationRangeEnabled: false,
    paginationEnabled: false,
    detailsTemplate: false,
    // showDetailsArrow: this.expandDetails,
    // fixedColumnWidth: true,
    // horizontalScroll: true,
    isLoading: true,
  };
  ngOnInit(): void {
    this.configuration.checkboxes = this.checkBox
    this.configuration.rows = this.tableRows;
    this.configuration.checkboxes = this.checkBox;
    this.configuration.detailsTemplate = this.expandDetails
    if (this._platform.width() < 992) {
      this.configuration.horizontalScroll = true;
    }
  }

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
    const itemsPerPage = this.tableRows
    let lastPage = this.table.apiEvent({
      type: API.getPaginationTotalItems,
    }) / itemsPerPage;
    const currentPage = this.table.apiEvent({
      type: API.getPaginationCurrentPage,
    });

    if (lastPage > currentPage) {
      this.table.apiEvent({
        type: API.setPaginationCurrentPage,
        value: currentPage + 1,
      });
    }


  }
  constructor(private _platform: Platform) {
    effect(() => {
      if (!this.tableData) {
        this.configuration.isLoading = true;
        this.configuration.paginationEnabled = false;
        return;
      }

      const data = this.tableData();
      this.configuration.isLoading = data === undefined;
      this.configuration.paginationEnabled = data?.length >= this.tableRows;

    });
  }
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term);
    this.onSearch.emit(term)

    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: this.searchTerm(),
    });
  }
  public selected = new Set();

  eventEmitted($event: { event: string; value: any }): void {
    if (['onCheckboxSelect', 'onSelectAll', 'onClick'].includes($event.event)) {
    let data = $event.value;
    switch ($event.event) {
      case 'onCheckboxSelect':

        if (this.selected.has($event.value.rowId)) {
          this.selected.delete($event.value.rowId);
        } else {
          this.selected.add($event.value.rowId);
        }
        data = this.tableData().filter((_, index) => this.selected.has(index))
        break;
      case 'onSelectAll':
        if ($event.value) {
          data = this.tableData()
        } else {
          data = []
        }
        break;
      case 'onClick':
        console.log($event);
        
        this.table.apiEvent({
          type: API.toggleRowIndex,
          value: $event.value.rowId,
        });
        
        // check if the data is an array, if yes, remove it from the array if it exists, if data is not an array, return data as new array and with selected data
        if (Array.isArray(data)) {
          data = data.filter(item => item !== $event.value)
        } else {
          data = []
          data.push($event.value.row)
        }
        break;
    }
    // emit data only if its on of the above cases
      this.onData.emit(data)
    }
  }
}
