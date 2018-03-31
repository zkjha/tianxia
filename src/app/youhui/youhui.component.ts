import { Component, OnInit } from '@angular/core';
import {LoginAfterComponent} from '../login-after/login-after.component';
@Component({
  selector: 'app-youhui',
  templateUrl: './youhui.component.html',
  styleUrls: ['./youhui.component.css']
})
export class YouhuiComponent implements OnInit {
  currentName = {
    name: '优惠活动'
  };
  constructor() { }

  ngOnInit() {
  }

}
