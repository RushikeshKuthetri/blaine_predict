import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  addSuccessToast() {
    this.toastr.success('Record Updated Successfully');
  }
  addErrorToast(msg:any) {
      this.toastr.error(msg);
  }
}
