import {EventEmitter, Injectable} from '@angular/core';

/**
 * 组件间数据通信Service
 */
@Injectable()
export class StoreDataService {

  public obj: any;
  change: EventEmitter<any>;  // 组件间传递事件

  constructor() {
    this.change = new EventEmitter();
  }


}
