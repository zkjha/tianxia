import {Component, Input, OnInit} from '@angular/core';

/**
 * 交易记录 组件
 */
@Component({
  selector: 'app-transaction-record',
  templateUrl: './transaction-record.component.html',
  styleUrls: ['./transaction-record.component.scss']
})
export class TransactionRecordComponent implements OnInit {

  @Input()
  show= ''; //  显示哪个信息页

  constructor() { }

  ngOnInit() {
  }

}
