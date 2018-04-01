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
      href: "home"
    },
    {
      title: "彩票专区",
      isSelected: 'false',
      href: "GameBet/GameBetPage/Ssc/1"
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
      href: "help"
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
    self.hoverShow(null);

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

  hoverShow(e) {
    console.log(e);
    const self = this;
    let status = false;
    let once = false;
    setTimeout(function () {
      $(".a2").hover(function () {
        self.gamesLobby = true;
        if (!once) {
          once = true;
          console.log("22");
          setTimeout(function () {
            $(".games-lobby").hover(function () {
              console.log("234")
              self.gamesLobby = true;
              status = true;
            }, function () {
              status = false;
              once = false;
              self.gamesLobby = false;
            });
          }, 100);
        }
      }, function () {
        setTimeout(function () {
          if (!status) {
            self.gamesLobby = false;
          }

        }, 500);

      });
    }, 1000);


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
