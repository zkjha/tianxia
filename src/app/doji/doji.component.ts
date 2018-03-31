import { Component, OnInit } from '@angular/core';
import {LoginAfterComponent} from '../login-after/login-after.component';

@Component({
  selector: 'app-doji',
  templateUrl: './doji.component.html',
  styleUrls: ['./doji.component.css']
})
export class DojiComponent implements OnInit {
  currentName = {
    name: '电子游艺'
  };
  constructor() { }

  ngOnInit() {
  }

}
