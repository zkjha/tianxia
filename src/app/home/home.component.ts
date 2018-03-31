import {Component, OnInit} from '@angular/core';
import {HttpService} from '../service/http-service.service';
import {StorageService} from "../service/storage.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentName = {
    name: '首页'
  };
  shohid = 0;
  data = {};

  constructor(private http: HttpService, private storage: StorageService) {
  }

  ngOnInit() {
    const tip = this.storage.getStorage("tip");
    if (!tip) {
      this.logShow(1);
    }
  }

  tohome() {
    this.storage.setStorage("tip", "tip");
    this.shohid = 0;
  }

  logShow(event) {
    this.shohid = event;
    this.getAd();
  }

  getAd() {
    this.http.postRx(`/api/News/getBulletin`).subscribe(data => {
      this.data = data;
    });

  }

  cloself() {
    this.shohid = 0;
  }
}
