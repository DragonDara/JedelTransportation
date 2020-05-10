import { EventEmitter, Injectable } from '@angular/core';
@Injectable({providedIn:'root'})
export class SharedDataService{
    private arr:any;
    public onClick:EventEmitter<number> = new EventEmitter();

    public doClick(){
        this.onClick.emit(this.arr);
      }
}