import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import{ IonSearchbar } from '@ionic/angular/standalone';
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports:[IonSearchbar]
})
export class SearchBoxComponent {
  @ViewChild(IonSearchbar, { static: true }) searchInput: IonSearchbar;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Input() placeholder: string;
  @Input() time: number = 0;
  @Input() value: string = ''


  public onSearch(val) {
    this.search.emit(val.detail.value);
  }

}
