import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-my-news",
  templateUrl: "./my-news.component.html",
  styleUrls: ["./my-news.component.scss"]
})
export class MyNewsComponent implements OnInit {
  index = 0;
  constructor() {}

  ngOnInit() {}
  selectedIndex(event) {
    this.index = event.index;

  }
}
