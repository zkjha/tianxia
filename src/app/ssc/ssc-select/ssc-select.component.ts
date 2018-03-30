import {Observable} from 'rxjs/Rx';
import {HttpService} from "../../service/http-service.service";

import {PlayService} from "./../play-service/play.service";
// import { Draw } from "./../play-service/canvas.service";
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import {StorageService} from "../../service/storage.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import Tool from "lodash";
import {BettingDjangoComponent} from "../django/betting-django/betting-django.component";
import {ChaseDjangoComponent} from "../django/chase-django/chase-django.component";

@Component({
  selector: "app-play-select",
  templateUrl: "./ssc-select.component.html",
  styleUrls: ["./ssc-select.component.css"]
})
export class SscSelectComponent implements OnInit, OnChanges, OnDestroy {
  // 倍数
  multiple = 1;
  // 初始金额
  oneAmount = 0;
  // 金额
  amount = 0;
  // 返点
  rebate: any = -1;
  // 默认返点
  dfRebate: any = 0;
  oneRebate: any = 0;
  // 设置返点弹出窗
  rebetSetting = false;

  // 是否追号
  isChased: false;

  // 注数
  quantity = 0;
  // 初始奖金
  oneBonus = 0;
  // 奖金
  bonus = 0;

  // 滚动条值
  scrollBar: 0 ;

  // 添加号码数据
  betData = [];
  // 统计数据
  allData = {
    allCount: 0,
    allAmount: 0
  };
  // 输入框的值
  textareaValue;

  // 下拉
  options: any = [
    {value: "元", label: "元"},
    {value: "角", label: "角"},
    {value: "分", label: "分"}
  ];
  selectedOption = this.options[0].value;
// 货币类型
  currency = 1;
  // 下注类型
  BetType = "default";
  // 追号
  switchValue = true;

  periodsValue = 10;
  timesValue = 1;

  sumData: any = {};

  data = [];
  time: any;

  // 期数选着
  periods = [
    {value: "5", label: "5期"},
    {value: "10", label: "10期"},
    {value: "15", label: "15期"},
    {value: "20", label: "20期"}
  ];
  selectedPeriods = this.periods[1].value;

  // 追号
  chaseSpinning = false;

  @Input() playData: any;

  // 改变下注状态
  @Output() onChangeBetType: EventEmitter<any> = new EventEmitter();

  constructor(private playService: PlayService,
              // private draw:Draw,
              private storage: StorageService,
              private message: NzMessageService,
              private modalService: NzModalService,
              private http: HttpService) {
  }

  ngOnInit() {
    this.playData = this.playData || {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.playData.currentValue.id) {
      this.playData = [];
      this.playData = this.playService.sortPlayData(
        changes.playData.currentValue
      );
      console.log(this.playData);
      this.init();
      this.oneAmount = this.playData.oneAmount;
      this.oneBonus = this.playData.bonus;

      this.getRebate();
    }
  }

  init() {
    this.quantity = 0;
    this.multiple = 1;
    // this.currency = 1;

    this.textareaValue = "";

    // 选择
    // this.selectedOption = this.options[0];

    this.amount = 0;
  }

  getRebate() {
    clearInterval(this.time)
    let gameData = this.storage.getStorage("gameData");

    if (gameData["frequency"] == "low") {
      if (this.rebate == -1) {
        //console.log("low getRebate="+this.rebate);
        let rebate = this.storage.getStorage("rebate");
        if (rebate) {
          this.rebate = rebate;
        } else {
          this.rebate = this.storage.getStorage("minRebate");
        }
      }
      // 低
      this.dfRebate = this.storage.getStorage("minRebate");
    } else if (gameData["frequency"] == "high") {
      // 高
      if (this.rebate == -1) {
        //console.log(" high getRebate="+this.rebate);
        let rebate = this.storage.getStorage("rebate");
        if (rebate) {
          this.rebate = rebate;
        } else {
          this.rebate = this.storage.getStorage("maxRebate");
        }
      }
      this.dfRebate = this.storage.getStorage("maxRebate");
    }
    this.oneRebate = this.dfRebate / this.playData["returnStep"] * this.playData["returnAmount"];
    this.rebate = this.storage.setStorage('0.0', "scope");
    this.rebate = this.storage.getStorage("scope");
    this.storage.setStorage(this.rebate, "rebate");
    this.calcuationBonus();
    console.log(this.dfRebate,222);

    // this.draw.init(this.rebate, this.dfRebate);
    // this.time = setInterval(() => {
    //   if (this.storage.getStorage("isDown")) {
    //
    //   }
    // }, 200)


  }

  // 改变返点
  changeRebate() {
    this.calcuationBonus();
  }

  getScrollBar(value){
    console.log(value)
  }

  closeWindow(){
    this.rebetSetting =false;
  }
  // 清除数据
  removeData() {
    this.betData = [];
    this.removeSum();
  }

  showRebetSetting() {
    this.rebetSetting = true;
  }

  // shifou zhuihao
  isChase() {
    // console.log(this.isChased);
    if (this.isChased) {
      this.onClickBetType("chase");
    } else {
      this.onClickBetType("default");
    }
  }


  removeSum() {
    this.allData = {
      allCount: 0,
      allAmount: 0
    };
  }

  /**
   * 改变选择
   */
  changeChoose(type, index) {
    if (this.playData.codeSelect == "dantuo") {
      // 切换选着数据
      this.playData = this.playService.playChoose(
        this.playData,
        index,
        type,
        "dantuo"
      );
    } else {
      this.playData = this.playService.playChoose(this.playData, index, type);
    }
    this.playData.selectLastNum = type;

    setTimeout(() => {
      this.quantity = this.playService.recalcBetCode(this.playData);
      this.calculationAmount();
    }, 10);
  }

  onChangeCheckbox(index?, lastIndex?) {

    if (this.playData.codeSelect == "dantuo") {
      this.playData = this.playService.dantuo(
        this.playData,
        lastIndex,
        index
      );
    }
    if (this.playData.bingoType == "compareToCode") {
      this.playData.playData[0].row.forEach((item, nowIndex) => {
        //console.log(item);
        if (nowIndex == index) {
          this.playData.playData[0].row[nowIndex].status = true;
        } else {
          this.playData.playData[0].row[nowIndex].status = false;
        }
      });
    }else{
      // if (this.playData.bingoType == "normal" || this.playData.bingoType == "regToCode") {
      this.playData.playData[lastIndex].row.forEach((item, nowIndex) => {
        //console.log(item);
        if (nowIndex == index) {
          if (this.playData.playData[lastIndex].row[nowIndex].status) {
            this.playData.playData[lastIndex].row[nowIndex].status = false;
          } else {
            this.playData.playData[lastIndex].row[nowIndex].status = true;
          }
          // this.playData.playData[lastIndex].row[nowIndex].status = true;
        }
      });
      // }

    }



    this.quantity = this.playService.recalcBetCode(
      this.playData,
      this.textareaValue
    );
    console.log(this.playData, 222);
    this.calculationAmount();

  }

  onChangePlay() {
    setTimeout(() => {
      this.quantity = this.playService.recalcBetCode(
        this.playData,
        this.textareaValue
      );
      this.calculationAmount();
    }, 100);
  }

  multipleEdit(type: string) {
    if (type === "cut") {
      if (this.multiple > 1) {
        this.multiple--;
      }
    } else if (type === "add") {
      this.multiple++;
    }
    this.calculationAmount();
  }

  // 加倍
  addbei() {
    this.multiple = this.multiple * 2;
    this.calculationAmount();
  }

  changeMultiple(e) {
    if(e<0){
      this.multiple =1;
    }
    this.calculationAmount();
  }

  OpenChange() {
    console.log("1123");
    switch (this.selectedOption) {
      case "元":
        console.log("1123", "元");
        this.currency = 1;
        break;
      case "角":
        console.log("1123", "jiao");
        this.currency = 0.1;
        break;
      case "分":
        console.log("1123", "fen");
        this.currency = 0.01;
        break;
    }
    this.calculationAmount();
    this.calcuationBonus();
  }

  calculationAmount() {
    this.amount =
      this.quantity * this.multiple * this.currency * this.oneAmount;
    console.log(this.amount);
  }

  calcuationBonus() {
    setTimeout(() => {
      let sum = this.rebate / this.playData["returnStep"] * this.playData["returnAmount"];
      this.bonus = (this.oneBonus + (this.oneRebate - sum)) * this.currency;
    }, 100);
  }

  clearCode() {
    this.textareaValue = "";
    this.onChangePlay();
  }

  clearRepeat() {
    this.textareaValue = this.deleteRepeat(this.textareaValue);
  }

  deleteRepeat(str) {
    return str.replace(/(.).*\1/g, "$1");
  }

  // 清空号码
  removeNumber() {
    this.betData = [];
    this.sumAllData();
    this.message.success(`清空号码成功!`);
  }

  // 删除当前
  onDelete(index) {
    this.betData.splice(index, 1);
    this.sumAllData();
    this.message.success(`删除成功！`);
  }

  // 添加号码
  addNumber(type?) {
    if (this.playData.bingoType == "compareToCode" && this.quantity > 1) {
      this.message.success(`龙虎斗一次只能选一个号码!`);
      return;
    }
    if (this.quantity > 0) {
      let currentPlayData: any = this.storage.getStorage("currentPlayData");
      let playTitle = currentPlayData.title;
      let code = this.storage.getStorage("globalBetCode");
      let gameData = this.storage.getStorage("gameData");
      // console.log(gameData)
      let betData = {
        // 下单号码
        code: code,
        // 倍数
        times: this.multiple,
        // 游戏id
        game_id: this.playData["game_id"],
        // 游戏标题
        game_title: `${gameData["title"]}-${currentPlayData["title"]}-${
          this.playData["title"]
          }`,
        // 玩法id
        play_id: this.playData["id"],
        // 玩法标题
        play_title: this.playData["title"],
        // 注数
        count: this.quantity,
        // 金额
        amount: this.playData["oneAmount"] * this.quantity,
        // 奖金
        bonus: this.bonus,
        // 货币
        currency: this.currency,
        // 返点
        returnPer: this.rebate ,
        // 奖金
        returnBonus: this.quantity,
        // 单注下单金额
        oneAmount: this.playData["oneAmount"],
        // 下单注数
        betCount: this.quantity,
        // 下单金额, **==不算倍数==**
        betAmount: this.playData["oneAmount"] * this.quantity,
        // 前端用
        htmlData: {
          quantityTitle: `共${this.quantity}注`,
          codeSplit: `${code.substring(0, 8)}..`,
          // // 货币名称
          currencyName: this.selectedOption,
          // // 标题
          playTitle: currentPlayData["title"],

          playName: this.playData["title"],
          amount: this.amount
        }
      };
      this.betData.push(betData);
      // this.message.success(`添加号码成功!`);
      this.sumAllData();
      this.init();
    } else {
      if (type) {
        return;
      }
      // this.message.error(`投注号码不正确!`);
      return;
    }
    // 删除
    if (this.playData["codeSelect"] == "single") {
      this.textareaValue = "";
    } else {
      this.playData = this.playService.playChoose(this.playData, 0, "remove");
    }
  }

  sumAllData() {
    let allCount = 0;
    let allAmount = 0;
    this.betData.forEach(item => {
      allCount += item.count;
      allAmount += item.htmlData.amount;
      console.log(allAmount);
    });
    this.allData["allCount"] = allCount;
    this.allData["allAmount"] = allAmount;
  }

  addBetting() {
    this.addNumber();
    setTimeout(() => {
      this.betting();
    }, 100);
  }

  betting() {
    this.init();
    if (this.playData["codeSelect"] == "single") {
      this.textareaValue = "";
    } else {
      this.playData = this.playService.playChoose(this.playData, 0, "remove");
    }
    if (this.betData.length > 0) {
      if (this.BetType == "default") {
        this.submitDefault();
      } else if (this.BetType == "chase") {
        this.submitChase();
      }
    } else {
      this.message.error(`请选择号码！`);
    }
  }

  submitDefault() {
    const modal = this.modalService.open({
      content: BettingDjangoComponent,
      closable: false,
      maskClosable: false,
      footer: false,
      width: 584,
      componentParams: {
        betData: this.betData,
        allData: this.allData
      }
    });

    modal.subscribe(result => {
      if (Object.prototype.toString.call(result) == "[object Array]") {
        let params = {
          betData: result,
          allCount: this.allData["allCount"],
          allAmount: this.allData["allAmount"],
          error: "0"
        };
        this.http.postRxNormal(`/api/Games/bet`, params).subscribe(data => {
          if (data["errormsg"] == null) {
            // this.message.success("投注成功！");
            alert("投注成功！");
            this.betData = [];
            // 下注成功
            this.sumAllData();
          }
        });
      }
    });
  }

  submitChase() {
    let chaseDjangoData = {
      chaseData: this.data,
      switchValue: this.switchValue,
      betData: this.storage.getStorage("chaseData")["betData"]
    };
    //console.log(chaseDjangoData);
    this.storage.setStorage(chaseDjangoData, "chaseDjangoData");
    const modal = this.modalService.open({
      content: ChaseDjangoComponent,
      closable: false,
      maskClosable: false,
      footer: false,
      width: 584
    });

    modal.subscribe(result => {
      if (result == "onDestroy") {
        this.onClickBetType("default");
        this.removeData();
      }
    });
  }

  onClickBetType(type) {
    // 默认
    if (type == "default") {
      this.BetType = "default";
      this.onChangeBetType.emit("default");
    } else if (type == "chase") {
      if (this.betData.length > 0) {
        //追号
        this.BetType = "chase";
        this.onChangeBetType.emit("chase");

        let data = {
          allData: this.allData,
          betData: this.betData
        };

        this.storage.setStorage(data, "chaseData");
        this.getChaseData();
      } else {
        this.message.error(`请选择号码！`);
      }
    }
  }

  initChase() {
    this.switchValue = true;
    this.selectedPeriods = this.periods[1].value;
    this.periodsValue = 10;
    this.timesValue = 1;
    this.data = [];
  }

  onSelect(index) {
    // console.log(index)
    this.getSumData();
  }

  clickRadio(e) {
    this.selectedPeriods = e;
    // console.log(this.selectedPeriods['value'])
    this.getChaseData(parseInt(this.selectedPeriods));
    this.getSumData();
  }

  onPeriods() {
    this.getChaseData(this.periodsValue);
    this.getSumData();
  }

  onTimes() {
    this.data.forEach(item => {
      item.times = this.timesValue;
    });
    this.getSumData();
  }

  oneTimes() {
    this.getSumData();
  }

  getSumData(data?) {
    let period = 0;
    let amount = 0;
    let Data = data || this.data;
    Data.forEach(item => {
      if (item.select == true) {
        period += 1;
        amount += item.amount * item.times;

      }
    });
    this.sumData["period"] = period;
    this.sumData["amount"] = amount;
    this.periodsValue = this.sumData["period"];
  }

  getChaseData(num?) {
    this.chaseSpinning = true;
    let gameData = this.storage.getStorage("gameData");
    let params = {
      id: gameData["id"],
      num: num
    };
    this.http.postRx(`/api/Games/getFutureIssue`, params).subscribe(data => {
      this.sortData(data);
      this.timesValue = 1;
      this.chaseSpinning = false;
    });
  }
  //关闭追号
  closeChase(){
    this.onClickBetType("default");
    this.isChased =false
  }

  sortData(data) {
    let chaseData = {
      allData: this.allData,
      betData: this.betData
    };
    // console.log(chaseData)
    let arr = [];
    data.forEach(item => {

      arr.push({
        issue: item.issue,
        endTime: item.endTime,
        amount: chaseData["allData"]["allAmount"],
        times: 1,
        select: true,
        addTime: item.addTime,
        id: item.id,
        singleTime: item.singleTime,
        sort: item.sort,
        startTime: item.startTime
      });
    });
    this.data = arr;
    setTimeout(() => {
      this.getSumData(arr);
    }, 10);
  }


  ngOnDestroy() {
    this.storage.setStorage(this.rebate, "rebate");
    clearInterval(this.time);
  }
}




