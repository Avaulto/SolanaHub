import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(values: any, key: string, searchTerm?: string): any {
    return values?.filter((value) => {
      if(key.indexOf('.') > -1){
        return value[key.split('.')[0]][key.split('.')[1]].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      }
      return value[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
