import { LotteryHistoryDjangoComponent } from "../django/lottery-history-django/lottery-history-django.component";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { StorageService } from "../../service/storage.service";
import { StoreDataService } from "../../service/store-data.service";
import {
  NzMessageService,
  NzModalService,
  NzNotificationService
} from "ng-zorro-antd";
import { HttpService } from "../../service/http-service.service";
import Tool from "lodash";
@Component({
  selector: "app-play-time",
  templateUrl: "./play-time.component.html",
  styleUrls: ["./play-time.component.css"]
})
export class PlayTimeComponent implements OnInit  {
  _formatT = percent => `0`;
  _formatM = percent => `0`;
  _formatS = percent => `0`;

  title = "";

  gameData: any = {};

  // 上一期开奖信息
  lastIssueData: any = {};
  codeData = [];
  gameName;

  shengying = true;

  timeData = ["0", "0", "0", "0", "0", "0"];

  // 定时器
  date = null; // 左边定时器

  date2 = null; // 上一期开奖

  date3 = null; // 没有抓取到开奖

  date4 = null; // 封单定时器

  game_id = 100;

  // 当前
  curTime: any = {};

  codeLength = 6;

  isCur = true;
  isCurText = "";

  T = 0;
  M = 0;
  S = 0;
  // 游戏类型
  gameType = "all";

  // 底部开关
  isFooter = false;
  // 底部文字当前期
  curIssueFooterText = "";
  // 底部文字下一期
  nextIssueFooterTest = '';
  // 底部时间
  footerDate = null;

  // 改变下注状态
  @Output() openinfoDjango: EventEmitter<any> = new EventEmitter();

  constructor(
    private storage: StorageService,
    private storeDataService: StoreDataService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private nf: NzNotificationService,
    private http: HttpService
  ) {}
  // clock;

  ngOnInit() {
    // this.init();
  }

  // 抓上次,当前,下次期号时间信息
  getCurIssue() {
    this.timeData = ["0", "0", "0", "0", "0", "0"];
    clearInterval(this.date);

    let params = {
      game_id: this.gameData["id"]
    };

    this.http.postRxNormal(`/api/Games/getCurIssue`, params).subscribe(data => {
      if (data["result"] != null) {
        this.storage.setStorage(data["result"], "timeData");
        this.sortCurIssue(data);
      } else {
        // this.message.error("上一期开奖信息为空");
      }
    });
  }

  opengengduo() {
    this.storeDataService.change.emit({
      model1: "transaction-record",
      model2: "betting"
    });
  }
  openzuihao() {
    this.storeDataService.change.emit({
      model1: "transaction-record",
      model2: "chase-number"
    });
  }




  sortCurIssue(data) {
    let s;
    // 当前期
    if (data["result"]["cur"]["singleTime"] > data["time"]) {
      this.curTime = data["result"]["cur"];
      s = data["result"]["cur"]["singleTime"] - data["time"];
      this.isCur = true;
    } else {
      if (this.shengying) {
        this.play("assets/mp3/fengdan.mp3");
      }

      // 下一期
      this.curTime = data["result"]["next"];
      s = data["result"]["next"]["singleTime"] - data["time"];
      this.isCur = false;
      // 结束封单
      // console.log(s)
      this.date4 = setTimeout(() => {
        this.isCur = true;
      }, 20000);
    }

    this.isCurText = data["result"]["cur"]["issue"];

    this.formatDuring(
      s,
      data => {
        console.log(data)
        this.timeData = data;
        this._formatT = percent => `${data[0]}${data[1]}`;
        this._formatM = percent => `${data[2]}${data[3]}`;
        this._formatS = percent => `${data[4]}${data[5]}`;

        this.T = parseInt(`${data[0]}${data[1]}`) * 1.666;
        this.M = parseInt(`${data[2]}${data[3]}`) * 1.666;
        this.S = parseInt(`${data[4]}${data[5]}`) * 1.666;
      },
      () => {
        this.getLastIssue();
        this.getCurIssue();

        // 打开提示
        this.openDjango();
        clearInterval(this.date);
      }
    );
  }
  kjshengyingOn() {
    if(this.storage.getStorage("shengying")==null ||this.storage.getStorage("shengying")=="1"){
      this.shengying=false;
      this.storage.setStorage("0","shengying");
    }else{
      this.shengying=true;
      this.storage.setStorage("1","shengying");
    }
  }

  // 底部提示框
  openDjango() {
    clearTimeout(this.footerDate);
    this.isFooter = true;
    let infoData = this.storage.getStorage("timeData");
    this.curIssueFooterText = infoData["cur"]["issue"];
    this.nextIssueFooterTest = infoData["next"]["issue"];
    this.footerDate = setTimeout(()=> {
      this.isFooter = false;
    },8000)
    // this.nf.create(
    //   "warning",
    //   `第 ${curIssue} 期已截止`,
    //   `当前为 ${nextIssue} 期投注时请注意期号`
    // );
  }

  // 时间处理
  /**
   *
   * @param s 相差的时间
   * @param fn 返回时间
   * @param fn2 倒计时结束
   */
  formatDuring(s: any, fn, fn2) {
    //   console.log(s)
    let time;
    //   let t:any = s;
    let data = [];
    clearInterval(this.date);
    this.date = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour;
          } else {
            time = "" + hour;
          }
          if (min < 10) {
            time += "0" + min;
          } else {
            time += "" + min;
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        // console.log(time)
        data = time.toString().split("");
        // console.log(data)
        fn(data);
      } else {
        clearInterval(this.date);
        fn2();
        clearInterval(this.date);
        //   clearInterval(this.date3);
      }
    }, 1000);
  }

  // 上一期开奖数据  右边
  getLastIssue() {
    let gameData = this.storage.getStorage("gameData");
    let params = {
      game_id: gameData["id"]
    };
    // console.log(params)
    this.http
      .postRxNormal(`/api/Games/getLastIssue`, params)
      .subscribe(data => {
        // console.log(data)
        if (data["result"] != null) {
          clearInterval(this.date3);
          this.lastIssueData = data["result"];
          // console.log(data['result']['code'])
          if (data["result"]["code"] != null) {
            this.codeData = data["result"]["code"].split(",");
            this.playK(data["result"]["code"]);
          } else {
            // 开启循环定时器 后台没有返回开奖数据
            this.date3 = setInterval(() => {
              this.codeData = [];
              for (let i = 0; i < this.codeLength; i++) {
                this.codeData.push(`0${Math.floor(Math.random() * 8) + 1}`);
              }
            }, 100);
          }
        }
      });
  }
  // 开奖声音
  playK(codeData) {
    let code = this.storage.getStorage("code");
    if (code) {
      if (code == codeData) {
        // console.log("=====");
      } else {
        // console.log("----------");
        // 开奖
        this.storage.setStorage(codeData, "code");
        if (this.shengying) {
          this.play("assets/mp3/kaijiang.mp3");
        }
        let arr = codeData.split(",");
        setTimeout(() => {
          arr.forEach((item, index) => {
            // console.log(index)
            // 开奖号码声音
            // this.playKJ(item, index);
          });
        }, 3000);
      }
    } else {
      this.storage.setStorage(codeData, "code");
    }
  }

  playKJ(item, index) {
    setTimeout(() => {
      this.play(`assets/mp3/kaijiang.wav`);
    }, 2000);
    setTimeout(() => {
      //   console.log(index);
      console.log(item);
      this.play(`assets/mp3/m_${item}.wav`);
    }, parseInt(`${index + 3}000`));
  }

  // 请求开奖号码
  getCodeHistory() {
    let params = {
      game_id: this.gameData["id"],
      length: 1
    };
    this.http
      .postRxNormal(`/api/Games/getCodeHistory`, params)
      .subscribe(data => {
        let codeLength;
        if (data["result"]) {
          let code = data["result"][0]["code"];
          try {
            let codeArray = code.split(",");
            this.codeLength = codeArray.length;
          } catch (e) {
            this.codeLength = 6;
          }
        }
        // console.log(this.codeLength)
      });
  }

  // 打开开奖历史
  openHistory() {
    const modal = this.modalService.open({
      content: LotteryHistoryDjangoComponent,
      closable: true,
      maskClosable: true,
      footer: false
    });
  }

  openinfo() {
    this.openinfoDjango.emit();
    // this.message.success("弹框内部已经实现这里正在实现");
  }

  play(url) {
    // alert(url);
    let audio = document.createElement("audio");
    let source: any = document.createElement("source");
    source.type = "audio/mpeg";
    source.type = "audio/mpeg";
    source.src = url;
    source.autoplay = "autoplay";
    source.controls = "controls";
    audio.appendChild(source);
    audio.play();
  }

  // 上一级初始化

  init() {
    console.log(111);
    this.storage.remove("code");
    this.gameData = this.storage.getStorage("gameData");

    this.gameName = this.gameData["title"];
    this.gameType = this.gameData["tag"];
    // console.log(this.gameType);

    // 清除
    this.getCodeHistory();

    clearInterval(this.date2);
    clearInterval(this.date3);
    clearTimeout(this.date4);
    this.getLastIssue();
    this.getCurIssue();

    // 上线打开

    this.date2 = setInterval(() => {
      this.getLastIssue();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.date);
    clearInterval(this.date2);
    clearInterval(this.date3);
    clearTimeout(this.date4);
    // 底部
    clearTimeout(this.footerDate);
  }
}
