import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private openDialogOnce = false;

  constructor() {}

  setOpenDialogOnce(value: boolean) {
    this.openDialogOnce = value;
  }

  getOpenDialogOnce() {
    return this.openDialogOnce;
  }
}

