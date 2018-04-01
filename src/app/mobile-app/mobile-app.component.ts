import {Component, OnInit} from '@angular/core';

@Component({
  selector: "app-mobile-app",
  templateUrl: "./mobile-app.component.html",
  styleUrls: ["./mobile-app.component.scss"]
})
export class MobileAppComponent implements OnInit {
  type = 'ios';

  constructor() {
  }

  ngOnInit() {
  }

  xiazai() {
    if (this.type == 'ios') {
      setTimeout(() => {
        // "href="http://kefu.qycn.com/vclient/chat/?websiteid=130143&clerkid=2059806"
        window.open("http://fir.im/dhfk");
      }, 500);
    } else if (this.type == 'a') {
      setTimeout(() => {
        // "href="http://kefu.qycn.com/vclient/chat/?websiteid=130143&clerkid=2059806"
        window.open("http://fir.im/avsl");
      }, 500);
    }

  };

  displ(name) {

    if (name == 1) {
      this.type = 'ios';
    } else if (name == 2) {
      this.type = 'a';
    }
    $("#mobile-show-msg").on("click", "a", function () {
      $(this)
        .addClass("on")
        .siblings()
        .removeClass("on");
    });
    if (name == "1") {
      $("#ios_msg").css("display", "block");
      $("#android_msg").css("display", "none");
    } else if (name == "2") {
      $("#ios_msg").css("display", "none");
      $("#android_msg").css("display", "block");
    }
  }
}
