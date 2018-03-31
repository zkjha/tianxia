import { Component, OnInit } from '@angular/core';
import {LoginAfterComponent} from '../login-after/login-after.component';
@Component({
  selector: 'app-tiyu',
  templateUrl: './tiyu.component.html',
  styleUrls: ['./tiyu.component.css']
})
export class TiyuComponent implements OnInit {
  currentName = {
    name: '体育博弈'
  };
  constructor() { }

  ngOnInit() {
  }

}
