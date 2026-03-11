import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.scss'],
 
})
export class DatetimepickerComponent{
   @Output() dateTime= new EventEmitter<string>();
   @Output() dateTimeRange= new EventEmitter<string>();
   @Input() type!:String
   maxDate=new Date();
   @Input() selectedRange:any;
   public onselectDateTime(event:any){
    // console.log(event);
    this.dateTime.emit(event.value)
    
   }

   public onselectDateTimeRange(event:any){
    // console.log(event);
    this.dateTimeRange.emit(event.value)
    
   }


}
