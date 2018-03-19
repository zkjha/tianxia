import {Component, Input, OnInit} from '@angular/core';

/**
 * 代理中心
 */
@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent implements OnInit {

  @Input()
  show= ''; //  显示哪个信息页

  constructor() { }

  ngOnInit() {
  }

}
