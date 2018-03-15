import {AfterViewInit, Injectable, OnInit, ViewChild} from '@angular/core';
import {NzModalService, NzModalSubject} from 'ng-zorro-antd';
import {LoadingComponent} from '../loading/loading.component';
import {StoreDataService} from './store-data.service';

@Injectable()
export class LoadingService {

  private nzModalSubject: NzModalSubject;

  constructor(private confirmServ: NzModalService,
              private storeDataService: StoreDataService) {
  }

  loading(message) {
    this.storeDataService.obj = message;
    this.nzModalSubject = this.confirmServ.open({
      title: null,
      zIndex:9999,
      content: LoadingComponent,
      width: 280,
      closable: false,
      maskClosable: false,
      footer: null
    });
  }

  close() {
    this.nzModalSubject.destroy();
  }


}
