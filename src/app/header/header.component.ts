import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Model} from "../model/model";
import {StorageService} from '../service/storage.service';
import {HttpService} from '../service/http-service.service';
import {StoreDataService} from "../service/store-data.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // 游戏大厅
  gamesLobby: Boolean = false;

  // 个人中心
  userinfo: Boolean = false;

  // 财务中心
  finance: Boolean = false;

  // 交易记录
  transaction: Boolean = false;

  // 个人报表
  userReport: Boolean = false;

  // 代理中心
  proxy: Boolean = false;
  youhui: Boolean = false;

  userId: String = "";

  userInfoData: any = {};

  refreshInfo: any = {};

  gameList: any = [];

  amountAG = 0;
  isShow = 0;
  time = null;
  /**
   * 个人中心
   * title 标题
   * open 打开哪个弹窗
   */
  userInofList = [
    [
      {
        title: "我的信息",
        open: "my-info"
      },
      {
        title: "修改密码",
        open: "update-password"
      },

      {
        title: "我的消息",
        open: "my-news"
      },
      {
        title: "登陆记录",
        open: "my-login-info"
      }
    ],
    [
      //   {
      //     title: '安全资料',
      //     open: 'security-center'
      //   }, {
      //     title: '银行资料',
      //     open: 'bank-data'
      //   },
      {
        title: "安全中心",
        open: "security-center"
      },
      {
        title: "奖金详情",
        open: "bouns-details"
      }
    ]
  ];

  /**
   * 财务中心
   * title 标题
   * open 打开哪个弹窗
   */
  financeList = [
    [
      {
        title: "光速充值",
        open: "lightCharge"
      },
      {
        title: "支付宝转账",
        open: "peakCharge"
      },
      {
        title: "微信支付",
        open: "weichat"
      }
    ],
    [
      {
        title: "QQ支付",
        open: "qq"
      },
      {
        title: "账号提现",
        open: "withdrawals"
      },
      {
        title: "额度转换",
        open: "monChange"
      }
    ]
  ];

  /**
   * 交易记录
   * title 标题
   * open 打开哪个弹窗
   */
  transactioneRcordList = [
    [
      {
        title: "投注记录",
        open: "betting"
      },
      {
        title: "追号记录",
        open: "chase-number"
      },
      {
        title: "流水记录",
        open: "turnover"
      }
    ],
    [
      {
        title: "充值记录",
        open: "recharge"
      },
      {
        title: "提现记录",
        open: "withdrawals"
      },
      {
        title: "积分记录",
        open: "integral"
      }
    ]
  ];

  /**
   * 代理中心
   * title 标题
   * open 打开哪个弹窗
   */
  proxyList = [
    [
      {
        title: "团队统计",
        open: "team-statistics"
      },
      {
        title: "开户中心",
        open: "account-center"
      }
    ],
    [
      {
        title: "团队报表",
        open: "statistics-table"
      },
      {
        title: "下级管理",
        open: "xiajiguanli"
      }
    ]
  ];

  otherGameList = [
    [
      {
        title: "PT老虎机",
        url: "/home/main/rngGame"
      },
      {
        title: "幸运28",
        url: "/home/main/info"
      }
    ],
    [
      {
        title: "MG老虎机",
        url: "/home/main/rngGame"
      }
    ],
    [
      {
        title: "NG老虎机",
        url: "/home/main/rngGame"
      }
    ],
    [
      {
        title: "BB老虎机",
        url: "/home/main/rngGame"
      }
    ],
    [
      {
        title: "AG真人",
        url: "/home/main/liveGame"
      }
    ],
    [
      {
        title: "BB真人",
        url: "/home/main/liveGame"
      }
    ],
    [
      {
        title: "AG捕鱼",
        url: "/home/main/fishGame"
      }
    ],
    [
      {
        title: "沙巴体育",
        url: "/home/main/info"
      }
    ]
  ];

  hoverData = [
    {
      // 游戏大厅
      time: null,
      title: ".gamesLobbyTitel",
      content: ".gamesLobby",
      isContent: "gamesLobby"
    },
    {
      // 个人中心
      time: null,
      title: ".userInfoTitle",
      content: ".userinfo",
      isContent: "userinfo"
    },
    {
      // 财务中心
      time: null,
      title: ".financeTitle",
      content: ".finance",
      isContent: "finance"
    },
    {
      // 交易记录
      time: null,
      title: ".transactionTitle",
      content: ".transaction",
      isContent: "transaction"
    },
    {
      // 个人报表
      time: null,
      title: ".userReportTitle",
      content: ".userReport",
      isContent: "userReport"
    },
    {
      // 代理中心
      time: null,
      title: ".proxyTitle",
      content: ".proxy",
      isContent: "proxy"
    },
    {
      // 优惠活动
      time: null,
      title: ".youhuiTitle",
      content: ".youhui",
      isContent: "youhui"
    }
  ];

  // 向父类 传递方法
  @Output() childEvent = new EventEmitter<Model>();

  constructor(private http: HttpService,
              private storage: StorageService,
              private storeDataService: StoreDataService,
              private router: Router) {
    this.storeDataService.change.subscribe(res => {
      this.open(res.model1, res.model2);
    });
  }

  OnDestroy() {
    clearInterval(this.time);
  }

  ngOnInit() {
    this.getUserInfo();
    this.getrefreshInfo();
    this.getNameList();
    this.headerShow();
    // 上线打开
    this.time = setInterval(() => {
      this.getrefreshInfo();
    }, 5000);
  }

// 用户信息
  getUserInfo() {
    this.http.postRx("/api/Users/getUserInfo").subscribe(data => {
      if (data) {
        this.userInfoData = data;
        this.storage.setStorage(data["maxRebate"], "maxRebate");
        this.storage.setStorage(data["minRebate"], "minRebate");
        this.storage.setStorage(data["username"], "user_name");
      }
    });
  }

  // 余额信息
  getrefreshInfo() {
    this.http.postRx("/api/Users/refreshInfo").subscribe(data => {
      if (data) {
        this.refreshInfo = data;
        this.storage.setStorage(data["usableAmount"], "usableAmount");
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
    gameData.forEach( (item, index) => {
      data.data.forEach((item2, index2) => {
        if (item2.pid == item.id && item.enabled == 1) {
          item.child.push(item2);
        }
      });
    });
    // 解析第二层
    return gameData;
  }

  loginOut() {
    this.http.postRx(`api/Users/loginOut`).subscribe(data => {
      this.router.navigateByUrl("/home");
      this.storage.clear();
    });
  }

  showCont(id) {
    scroll(0, 0);
    this.isShow = id;
  }

  open(model1, model2) {
    // 弹窗数据
    const data: Model = {
      model1: model1,
      model2: model2
    };
    this.childEvent.emit(data);
  }

  // 绑定jq移入事件
  headerShow() {
    this.hoverData.forEach(item => {
      $(item.title).hover(
        () => {
          this[item.isContent] = true;
          clearTimeout(item.time);
          setTimeout(() => {
            this.hoverContent(item);
          }, 10);
        },
        () => {
          clearTimeout(item.time);
          item.time = setTimeout(() => {
            this[item.isContent] = false;
          }, 200);
        }
      );
    });
  }

  // 绑定中间内容
  hoverContent(item) {

    $(item.content).hover(
      () => {
        clearTimeout(item.time);
        this[item.isContent] = true;
      },
      () => {
        clearTimeout(item.time);
        item.time = setTimeout(() => {
          this[item.isContent] = false;
        }, 200);
      }
    );
  }

}
