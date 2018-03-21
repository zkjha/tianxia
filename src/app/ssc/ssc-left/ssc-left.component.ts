import { HttpService } from "../../service/http-service.service";
import { Component, EventEmitter, OnInit, Output, OnDestroy } from "@angular/core";
import { StorageService } from "../../service/storage.service";
import Tool from "lodash";

@Component({
  selector: "app-play-left",
  templateUrl: "./ssc-left.component.html",
  styleUrls: ["./ssc-left.component.css"]
})
export class SscLeftComponent implements OnInit, OnDestroy {
  gameList: any[] = [];

  leftShow = false;
  isHot = [];
  timeType = null;
  date = null;
  date1 = null;
  date2 = null;
  date3 = null;
  date4 = null;
  date5 = null;

  hot = null;
  hot1 = null;
  hot2 = null;
  hot3 = null;
  hot4 = null;
  hot5 = null;

  constructor(private http: HttpService, private storage: StorageService) {}

  @Output() meun = new EventEmitter();

  ngOnInit() {
    this.getList();
  }

  // 请求数据
  getList() {
    this.http.postRx("api/Games/getNameList").subscribe(data => {
      this.gameList = this.sortData(data);
      this.diaoyong();
    });
  }

  diaoyong() {
    try {
      if (this.isHot[0]) {
        this.getHotTime(this.isHot[0].id);
      }
    } catch (error) {}
    try {
      if (this.isHot[1]) {
        this.getHotTime1(this.isHot[1].id);
      }
    } catch (error) {}
    try {
      if (this.isHot[2]) {
        this.getHotTime2(this.isHot[2].id);
      }
    } catch (error) {}
    try {
      if (this.isHot[3]) {
        this.getHotTime3(this.isHot[3].id);
      }
    } catch (error) {}
    try {
      if (this.isHot[4]) {
        this.getHotTime4(this.isHot[4].id);
      }
    } catch (error) {}
    try {
      if (this.isHot[5]) {
        this.getHotTime5(this.isHot[5].id);
      }
    } catch (error) {}
  }
  getHotTime(id) {
    this.http
      .postRxNormal("api/Games/getHotGameTime", { game_id: id })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.time(this.sortTime(data));
        }
      });
  }
  getHotTime1(id) {
    this.http
      .postRxNormal("api/Games/getHotGameTime", { game_id: id })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.time1(this.sortTime(data));
        }
      });
  }
  getHotTime2(id) {
    this.http
      .postRxNormal("api/Games/getHotGameTime", { game_id: id })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.time2(this.sortTime(data));
        }
      });
  }
  getHotTime3(id) {
    this.http
      .postRxNormal("api/Games/getHotGameTime", { game_id: id })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.time3(this.sortTime(data));
        }
      });
  }
  getHotTime4(id) {
    this.http
      .postRxNormal("api/Games/getHotGameTime", { game_id: id })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.time4(this.sortTime(data));
        }
      });
  }
  getHotTime5(id) {
    this.http
      .postRxNormal("api/Games/getHotGameTime", { game_id: id })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.time5(this.sortTime(data));
        }
      });
  }
  sortTime(data) {
    let endTime = new Date(data["result"].endTime).getTime() / 1000;
    let jieshuTime = endTime - data.time;
    return jieshuTime;
  }

  time(s) {
    this.formatDuring(
      s,
      data => {
        this.hot = data;
      },
      () => {
        this.getHotTime(this.isHot[0].id);
        this.timeType = 0;
      }
    );
  }
  time1(s) {
    this.formatDuring1(
      s,
      data => {
        this.hot1 = data;
      },
      () => {
        this.getHotTime1(this.isHot[1].id);
        this.timeType = 1;
      }
    );
  }
  time2(s) {
    this.formatDuring2(
      s,
      data => {
        this.hot2 = data;
      },
      () => {
        this.getHotTime2(this.isHot[2].id);
        this.timeType = 2;
      }
    );
  }
  time3(s) {
    this.formatDuring3(
      s,
      data => {
        this.hot3 = data;
      },
      () => {
        this.getHotTime3(this.isHot[3].id);
        this.timeType = 3;
      }
    );
  }
  time4(s) {
    this.formatDuring4(
      s,
      data => {
        this.hot4 = data;
      },
      () => {
        this.getHotTime4(this.isHot[4].id);
        this.timeType = 4;
      }
    );
  }
  time5(s) {
    this.formatDuring5(
      s,
      data => {
        this.hot5 = data;
      },
      () => {
        this.getHotTime5(this.isHot[5].id);
        this.timeType = 3;
      }
    );
  }

  formatDuring(s: any, fn, fn2) {
    // console.log(s)
    let time;
    //   let t:any = s;
    clearInterval(this.date);
    // if (s < 5) {
    //   return;
    // }
    this.date = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour + ":";
          } else {
            time = "" + hour + ":";
          }
          if (min < 10) {
            time += "0" + min + ":";
          } else {
            time += "" + min + ":";
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        fn(time);
      } else {
        clearInterval(this.date);
        fn2();
      }
    }, 1000);
  }
  formatDuring1(s: any, fn, fn2) {
    //   console.log(s)
    let time;
    //   let t:any = s;
    clearInterval(this.date1);
    // if (s < 5) {
    //   return;
    // }
    this.date1 = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour + ":";
          } else {
            time = "" + hour + ":";
          }
          if (min < 10) {
            time += "0" + min + ":";
          } else {
            time += "" + min + ":";
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        fn(time);
      } else {
        clearInterval(this.date1);
        fn2();
      }
    }, 1000);
  }
  formatDuring2(s: any, fn, fn2) {
    //   console.log(s)
    let time;
    //   let t:any = s;
    clearInterval(this.date2);
    // if (s < 5) {
    //   return;
    // }
    this.date2 = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour + ":";
          } else {
            time = "" + hour + ":";
          }
          if (min < 10) {
            time += "0" + min + ":";
          } else {
            time += "" + min + ":";
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        fn(time);
      } else {
        clearInterval(this.date2);
        fn2();
      }
    }, 1000);
  }
  formatDuring3(s: any, fn, fn2) {
    //   console.log(s)
    let time;
    //   let t:any = s;
    clearInterval(this.date3);
    // if(s < 5){
    //   return;
    // }
    this.date3 = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour + ":";
          } else {
            time = "" + hour + ":";
          }
          if (min < 10) {
            time += "0" + min + ":";
          } else {
            time += "" + min + ":";
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        fn(time);
      } else {
        clearInterval(this.date3);
        fn2();
      }
    }, 1000);
  }
  formatDuring4(s: any, fn, fn2) {
    //   console.log(s)
    let time;
    //   let t:any = s;
    clearInterval(this.date4);
    // if(s < 5){
    //   return;
    // }
    this.date4 = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour + ":";
          } else {
            time = "" + hour + ":";
          }
          if (min < 10) {
            time += "0" + min + ":";
          } else {
            time += "" + min + ":";
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        fn(time);
      } else {
        clearInterval(this.date4);
        fn2();
      }
    }, 1000);
  }
  formatDuring5(s: any, fn, fn2) {
    //   console.log(s)
    let time;
    //   let t:any = s;
    clearInterval(this.date5);
    // if(s < 5){
    //   return;
    // }
    this.date5 = setInterval(() => {
      if (parseInt(s) >= 0) {
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          // console.log(hour,min,sec)
          if (hour < 10) {
            time = "0" + hour + ":";
          } else {
            time = "" + hour + ":";
          }
          if (min < 10) {
            time += "0" + min + ":";
          } else {
            time += "" + min + ":";
          }
          if (sec < 10) {
            time += "0" + sec;
          } else {
            time += "" + sec;
          }
        }
        s--;
        fn(time);
      } else {
        clearInterval(this.date5);
        fn2();
      }
    }, 1000);
  }

  // 数据处理
  sortData(data) {
    this.isHot = [];
    let gameData = [];
    // 第一层
    Tool.forEach(data.data, (item, index) => {
      if (item.ishot == 1) {
        this.isHot.push(item);
      }
      if (item.pid == 0 && item.enabled == 1) {
        item.child = [];
        item.styleHeigth = 31;
        item.icon = "&#xe620;";
        gameData.push(item);
      }
    });
    Tool.forEach(gameData, (item, index) => {
      Tool.forEach(data.data, (item2, index2) => {
        if (item2.pid == item.id && item.enabled == 1) {
          item.child.push(item2);
        }
      });
    });

    // 解析第二层
    return gameData;
  }

  onOpen(list, i?) {
    let kai = null;
    if (list.styleHeigth > 31) {
      kai = true;
    } else {
      kai = false;
    }
    try {
      Tool.forEach(this.gameList, item => {
        item.styleHeigth = 31;
        item.icon = "&#xe620;";
      });
      let length = list.child.length;

      if (!kai) {
        list.styleHeigth = length * 38 + 31;
        list.icon = "&#xe628;";
      }
    } catch (e) {}
  }

  leftShoe() {
    this.leftShow = true;
  }

  clickBottom() {
    this.leftShow = false;
    setTimeout(() => {
      this.meun.emit();
    }, 1000);
  }
  ngOnDestroy() {
    console.log("我销毁了");
    clearInterval(this.date);
    clearInterval(this.date1);
    clearInterval(this.date2);
    clearTimeout(this.date3);
    clearTimeout(this.date4);
    clearTimeout(this.date5);
  }
}
