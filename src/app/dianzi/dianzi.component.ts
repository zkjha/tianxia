import { Component, OnInit } from '@angular/core';
import {LoginAfterComponent} from '../login-after/login-after.component';

@Component({
  selector: 'app-dianzi',
  templateUrl: './dianzi.component.html',
  styleUrls: ['./dianzi.component.css']
})
export class DianziComponent implements OnInit {
  currentName = {
    name: '电子游艺'
  };

  constructor() { }

  ngOnInit() {
  }

}
