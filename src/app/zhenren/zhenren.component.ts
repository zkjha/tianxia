import { Component, OnInit } from '@angular/core';
import {LoginAfterComponent} from '../login-after/login-after.component';

@Component({
  selector: 'app-zhenren',
  templateUrl: './zhenren.component.html',
  styleUrls: ['./zhenren.component.css']
})
export class ZhenrenComponent implements OnInit {
  currentName = {
    name: '真人娱乐'
  };
  constructor() { }

  ngOnInit() {
  }

}
