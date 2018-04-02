import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../service/http-service.service';

declare let $: any;
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {
  gamesLobby: Boolean = false;
  gameList: any = [];
  navList = [
    {
      title: "首页",
      isSelected: 'true',
      href: "/home"
    },
    {
      title: "彩票专区",
      isSelected: 'false',
      href: "/GameBet/GameBetPage/Ssc/1"
    },
    {
      title: "真人娱乐",
      isSelected: 'false',
      href: "/ZhenRen"
    },
    {
      title: "电子游艺",
      isSelected: 'false',
      href: "/DianZi"
    },
    {
      title: "",
      isSelected: 'false',
      href: "#"
    },
    {
      title: "捕鱼游戏",
      isSelected: 'false',
      href: "/Doji"
    },
    // {
    //   title: "体育博弈",
    //   isSelected: 'false',
    //   href: "TiYu"
    // },
    {
      title: "优惠活动",
      isSelected: 'false',
      href: "/Youhui"
    },
    {
      title: "在线客服",
      isSelected: 'false',
      href: "http://chat56.live800.com/live800/chatClient/chatbox.jsp?companyID=967492&configID=160768&jid=5850814693"
    },
    {
      title: "下载中心",
      isSelected: 'false',
      href: "/mobile-app"
    }
  ];
  @Input()
  public selected: any = {}

  constructor(private http: HttpService) {
  }

  ngOnInit() {
    const self = this;
    self.changeStatus();
    self.getNameList();
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

  // 游戏大厅菜单
  getNameList() {
    this.http.postRx("/api/Games/getNameList").subscribe(data => {
      this.gameList = this.sortData(data);
      // console.log(this.gameList)
    });
  }

  // 数据处理
  sortData(data) {
    let gameData = [];
    // 第一层
    data.data.forEach(item => {
      if (item.pid == 0 && item.enabled == 1) {
        item.child = [];
        item.styleHeigth = 31;
        gameData.push(item);
      }
    });
    gameData.forEach((item, index) => {
      data.data.forEach((item2, index2) => {
        if (item2.pid == item.id && item.enabled == 1) {
          item.child.push(item2);
        }
      });
    });
    // 解析第二层
    return gameData;
  }

}
