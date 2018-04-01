import {Component, OnInit} from '@angular/core';
import {HttpService} from "../service/http-service.service";
import Tool from 'lodash';
// import axios from 'axios';

@Component({
  selector: "app-line-selection",
  templateUrl: "./line-selection.component.html",
  styleUrls: ["./line-selection.component.scss"]
})
export class LineSelectionComponent implements OnInit {
  api = "/api/captcha/getCaptchaCode";
  data: any = [
    {
      url: `http://fire.m178n.com`,
      time: 0,
      type: 0,
      show: true
    },
    {
      url: `http://lurck.cn`,
      time: 0,
      type: 0,
      show: true
    },
    {
      url: `http://lurck.net`,
      time: 0,
      type: 0,
      show: true
    },
    {
      url: `http://www.lurck.net`,
      time: 0,
      type: 0,
      show: true
    },
    {
      url: `http://www.lurck.cn`,
      time: 0,
      type: 0,
      show: true
    }
  ];

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.RequestAgain();
  }

  RequestAgain() {
    this.data.forEach((item, index) => {
      const beginTime: number = Date.now();
      this.httpService.postRx(`${item.url}${this.api}`, {}).subscribe(
        data => {
          item.time = Date.now() - beginTime;
          if (item.time > 0) {
            if (item.time < 100) {
              item.type = 1;
              item.show = false;
            } else if (item.time < 500) {
              item.type = 2;
              item.show = false;
            } else if (item.time < 2000) {
              item.type = 3;
              item.show = false;
            } else {
              item.time = 4;
              item.show = false;
            }
          }
        },
        error => {
          item.time = 4;
        }
      );
    });
  }
}
