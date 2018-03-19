import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-xiajiguanli",
  templateUrl: "./xiajiguanli.component.html",
  styleUrls: ["./xiajiguanli.component.scss"]
})
export class XiajiguanliComponent implements OnInit {
  index = 0;
  constructor() {}

  ngOnInit() {}
  selectedIndex(event) {
    this.index = event.index;
  }
}
