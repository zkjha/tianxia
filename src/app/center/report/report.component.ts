import {Component, Input, OnInit} from '@angular/core';

/**
 * 个人报表
 */
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @Input()
  show= ''; //  显示哪个信息页

  constructor() { }

  ngOnInit() {
  }

}
