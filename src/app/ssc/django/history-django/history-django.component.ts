import { HttpService } from '../../../service/http-service.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../service/storage.service';
import { NzMessageService, NzModalService, NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-history-django',
  templateUrl: './history-django.component.html',
  styleUrls: ['./history-django.component.scss']
})
export class HistoryDjangoComponent implements OnInit {

  data:any = {}

    constructor(
      private storage: StorageService,
      private message: NzMessageService,
      private modalService: NzModalService,
      private subject: NzModalSubject,
    ) {

      this.subject.on('onShow', () => {

        this.data = storage.getStorage('infoData');

      });

    }

  emitDataOutside() {
    this.subject.destroy('onCancel');
  }

    ngOnInit() {
    }

}
