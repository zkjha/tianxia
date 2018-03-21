import { HttpService } from '../../../service/http-service.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../service/storage.service';
import { NzMessageService, NzModalService, NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-chase-history-django',
  templateUrl: './chase-history-django.component.html',
  styleUrls: ['./chase-history-django.component.scss']
})
export class ChaseHistoryDjangoComponent implements OnInit {

  data: any = {};

  chaseData;

  detail = [];

  code = null

  constructor(
    private storage: StorageService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private subject: NzModalSubject,
    private http: HttpService
  ) {
    // 监听显示
    this.subject.on('onShow', () => {
      this.getData()

    });

  }
  getData() {
    this.chaseData = this.storage.getStorage('zuihaoData');
    this.http.postRx(`/api/Games/chaseBetDetail`, { id: this.chaseData['id'], })
      .subscribe((data) => {
        this.data = data;
        this.detail = data['detail'];
        this.code = this.detail[0].code;
        // console.log(data)
      })
  }

  // 撤单
  revoked(id) {
    this.http.postRx(`/api/Games/cancelBet`, { id: id, })
      .subscribe((data) => {
        this.message.success('撤单成功！');
        this.getData();
      })

  }
  // 点击确定
  emitDataOutside(e) {
    this.subject.destroy('onCancel');
  }

  ngOnInit() {
  }

}
