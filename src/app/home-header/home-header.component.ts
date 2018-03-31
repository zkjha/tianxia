import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {
  gamesLobby: Boolean = true;
  navList = [
    {
      title: "首页",
      isSelected: 'true',
      href: "home"
    },
    {
      title: "彩票专区",
      isSelected: 'false',
      href: "Caipiao"
    },
    {
      title: "真人娱乐",
      isSelected: 'false',
      href: "ZhenRen"
    },
    {
      title: "电子游艺",
      isSelected: 'false',
      href: "DianZi"
    },
    {
      title: "体育博弈",
      isSelected: 'false',
      href: "TiYu"
    },
    {
      title: "优惠活动",
      isSelected: 'false',
      href: "youhui"
    },
    {
      title: "在线客服",
      isSelected: 'false',
      href: "Help"
    }
    ];
  @Input()
  public selected: any = {}

  constructor() {
  }

  ngOnInit() {
    const self = this;
      self.changeStatus();

  }

  changeStatus() {
    const self = this;
    this.navList.forEach(function (item) {
      if (item.title == self.selected.name) {
        item.isSelected = 'true';
      } else {
        item.isSelected = 'false';
      }
    });
  }

}
