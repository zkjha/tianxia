import { StorageService } from "./../../service/storage.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
declare let $: any;
@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  isVisible = false; //是否显示弹窗

  type = "phone"; // 类型手机或pc
  showType = "iphone";

  constructor(private router: Router, private storage: StorageService) {}

  ngOnInit() {}

  lineSelect() {
    this.router.navigate(["/lineSelection"]);
  }
  openMOdel() {
    this.isVisible = true;
  }

  handleCancel = e => {
    this.isVisible = false;
  };

  hide() {
    $(".oul1").hide();
    $(".oul2").show();
  }
  show() {
    $(".oul1").show();
    $(".oul2").hide();
  }
  tohelp() {
    this.router.navigate(["/home/main/helpCenter"]);
  }

  open() {
    let newWin = window.open("wait");

    newWin.location.href = "http://kefu.qycn.com/vclient/chat/?websiteid=132757";
  }

  onClick(type) {
    let body = $("body");
    body.removeClass();
    if (type == "zhongnan") {
      body.removeClass();
      this.storage.setStorage(null, "bc");
    } else {
      body.addClass(type);
      this.storage.setStorage(type, "bc");
    }

  }
}
