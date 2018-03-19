import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from "../../service/http-service.service";

/**
 * 财务中心
 */
@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {

  @Input() show = ''; //  显示哪个信息页

  constructor() {

  }

  ngOnInit() {
  }

}
