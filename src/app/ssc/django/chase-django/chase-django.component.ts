import { HttpService } from '../../../service/http-service.service';
import { Component, OnInit } from '@angular/core';
import Tool from 'lodash';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { StorageService } from '../../../service/storage.service';

@Component({
  selector: 'app-chase-django',
  templateUrl: './chase-django.component.html',
  styleUrls: ['./chase-django.component.scss']
})
export class ChaseDjangoComponent implements OnInit {

  // 输入框数据
  betData = [];
  // 期数数据
  chaseData = [];

  allAmount = 0;

  allTimes = '';

  title = '';
  // 是否停止
  winStop: any;

  constructor(private subject: NzModalSubject,
    private message: NzMessageService,
    private storage: StorageService,
    private http: HttpService
  ) {
    // 监听显示
    this.subject.on('onShow', () => {
      let gameData = storage.getStorage('gameData');

      let chaseDjangoData = storage.getStorage('chaseDjangoData');

      this.winStop = chaseDjangoData['switchValue'];
      // console.log(this.winStop)

      this.title = gameData['title'];

      this.betData = chaseDjangoData['betData'];
      // console.log(this.betData)
      this.chaseData = chaseDjangoData['chaseData'];
      // console.log(this.chaseData)

      this.sumAllData();
      this.sumTimes();
    });
  }

  ngOnInit() {
  }


  // 点击确定
  emitDataOutside() {
    let user_id = this.storage.getStorage('user_id');
    let gameData = this.storage.getStorage('gameData');

    let issueData = [];
    this.chaseData.forEach(item => {
      if (item.select == true) {
        issueData.push(item);
      }
    });


    let params = {
      oneAmount: '',  //没用
      // 下单数据
      betData: this.betData,
      // 总金额
      allBetAmount: this.allAmount,

      // 追号数据
      issueData: issueData,
      user_id: user_id,
      // 是否中奖后停止追号, 1 为停止, 0 为继续追号
      winStop: this.winStop == true ? 1 : 0,
      // 追号期数
      issueCount: issueData.length,
      game_id: gameData['id'],
      play_id: '',    //该参数没用
      lastIssue: '',  //该参数没用
      firstIssue: '',  //该参数没用
    };
    console.log(params);
    this.http.postRxNormal(`/api/Games/chaseBet`, params).subscribe(
      data => {
        if(data['errormsg'] == null){
          this.message.success("追号成功");
        }
        this.subject.destroy('onCancel');
      }
    )
  }
  // 关闭
  handleCancel() {
    this.subject.destroy('onCancel');
  }
  // 删除

  onDelete(index) {
    this.betData.splice(index, 1);
    this.sumAllData();
    this.message.success(`删除成功！`);

    if (this.betData.length <= 0) {
      this.subject.destroy('onCancel');
    }


  }
  // 统计 期数分开统计
  sumAllData() {

    let sum = 0;
    let all = 0
    this.betData.forEach( item => {
      console.log(item);
      sum += item.amount * item.times * item.currency;
    })

    this.chaseData.forEach( item => {
      all += sum * item.times
    })
    this.allAmount = all;
  }

  // 统计期号
  sumTimes() {
    let allSum = []
    this.chaseData.forEach(item => {
      if (item.select == true) {
        allSum.push(item);
      }
    })

    this.allTimes = `${allSum[0]['issue']} 至 ${allSum[allSum.length - 1]['issue']} [ 共 ${allSum.length} 期]`
  }


}
