import { Component, OnInit } from "@angular/core";
declare let $: any;
@Component({
  selector: "app-mob-help",
  templateUrl: "./mob-help.component.html",
  styleUrls: ["./mob-help.component.scss"]
})
export class MobHelpComponent implements OnInit {
  public isShow = 1;
  constructor() {}

  ngOnInit() {
    /*内容切换*/
    $('.conLeft').find('dd').click(function () {
      $(this).addClass('blue').siblings().removeClass('blue');
      $('.conRig').find('.help1').eq($(this).index()).addClass('show').siblings().removeClass('show');
    });
  }
}
