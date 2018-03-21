import { Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-time",
  templateUrl: "./time.component.html",
  styleUrls: ["./time.component.scss"]
})
export class TimeComponent implements OnInit {
  radioValue = "";

  @Output() Time: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  change() {
    switch (this.radioValue) {
      case "今天":
        this.Time.emit(this.ToDayStr());
        break;
      case "昨天":
        this.Time.emit(this.YesterDayStr());
        break;
      case "本周":
        this.Time.emit(this.ThisWeekStr());
        break;
      case "上周":
        this.Time.emit(this.LastWeekStr());
        break;
      case "本月":
        this.Time.emit(this.ThisMonthStr());
        break;
      //case "上月":
      //  this.Time.emit(this.onMonthStr());
      //  break;
    }
  }
  /*
*获取今日的起始和结束时间
*返回值："起始时间,结束时间"
*/
  ToDayStr() {
    let returnStr = "";
    let date = new Date(); //当前时间
    let year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    let start = year + "/" + month + "/" + day + " 00:00:00"; //起始时间
    let end = year + "/" + month + "/" + day + " 00:00:00"; //结束时间
    return { start: new Date(start), end: new Date(end) };
  }
  /*
*获取昨日的起始和结束时间
*返回值："起始时间,结束时间"
*/
  YesterDayStr() {
    var date = this.GetDate(1, 1); //当前时间前一天
    var returnStr = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    let start = year + "/" + month + "/" + day + " 00:00:00"; //起始时间
    let end = year + "/" + month + "/" + day + " 00:00:00"; //结束时间
    return { start: new Date(start), end: new Date(end) };
  }

  /*
*获取本周的起始和结束时间
*返回值："起始时间,结束时间"
*/
  ThisWeekStr() {
    var returnStr = "";
    var date = new Date(); //当前时间
    var week = date.getDay(); //获取今天星期几
    var monday = this.GetDate2(week - 1, 1, date); //获取星期一
    var sunday = this.GetDate2(7 - week, 2, date); //获取星期天
    //起始时间的年月日
    var year1 = monday.getFullYear();
    var month1 = monday.getMonth() + 1;
    var day1 = monday.getDate();
    //结束时间的年月日
    var year2 = sunday.getFullYear();
    var month2 = sunday.getMonth() + 1;
    var day2 = sunday.getDate();
    //处理起始时间小于10的追加"0"在前面
    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;
    //处理结束时间小于10的追加"0"在前面
    month2 = month2 < 10 ? "0" + month2 : month2;
    day2 = day2 < 10 ? "0" + day2 : day2;

    let start = year1 + "/" + month1 + "/" + day1 + " 00:00:00"; //起始时间
    let end = year2 + "/" + month2 + "/" + day2 + " 00:00:00"; //结束时间
    return { start: new Date(start), end: new Date(end) };
  }
  /*
*获取上周的起始和结束时间
*返回值："起始时间,结束时间"
*/
  LastWeekStr() {
    var returnStr = "";
    var date = new Date(); //当前时间
    var week = date.getDay(); //获取今天星期几
    var monday = this.GetDate2(week + 6, 1, date); //获取上周星期一
    var sunday = this.GetDate2(week, 1, date); //获取上周星期天
    //起始时间的年月日
    var year1 = monday.getFullYear();
    var month1 = monday.getMonth() + 1;
    var day1 = monday.getDate();
    //结束时间的年月日
    var year2 = sunday.getFullYear();
    var month2 = sunday.getMonth() + 1;
    var day2 = sunday.getDate();
    //处理起始时间小于10的追加"0"在前面
    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;
    //处理结束时间小于10的追加"0"在前面
    month2 = month2 < 10 ? "0" + month2 : month2;
    day2 = day2 < 10 ? "0" + day2 : day2;

    let start = year1 + "/" + month1 + "/" + day1 + " 00:00:00"; //起始时间
    let end = year2 + "/" + month2 + "/" + day2 + " 00:00:00"; //结束时间
    return { start: new Date(start), end: new Date(end) };
  }
  /*
*获取本月的起始和结束时间
*返回值："起始时间,结束时间"
*/
  ThisMonthStr() {
    var returnStr = "";
    var date = new Date(); //当前时间
    var year = date.getFullYear();
    var month = date.getMonth();

    var min = new Date(year, month, 1); //本月月初
    var max = new Date(year, month + 1, 0); //本月月底

    //起始时间的年月日
    var year1 = min.getFullYear();
    var month1: any = min.getMonth() + 1;
    var day1: any = min.getDate();
    //结束时间的年月日
    var year2 = max.getFullYear();
    var month2: any = max.getMonth() + 1;
    var day2: any = max.getDate();
    //处理起始时间小于10的追加"0"在前面
    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;
    //处理结束时间小于10的追加"0"在前面
    month2 = month2 < 10 ? "0" + month2 : month2;
    day2 = day2 < 10 ? "0" + day2 : day2;

    let start = year1 + "/" + month1 + "/" + day1 + " 00:00:00"; //起始时间
    let end = year2 + "/" + month2 + "/" + day2 + " 00:00:00"; //结束时间
    return { start: new Date(start), end: new Date(end) };
  }

  /*
*获取本月的起始和结束时间
*返回值："起始时间,结束时间"
*/
  onMonthStr() {
    var returnStr = "";
    var date = new Date(); //当前时间
    var year = date.getFullYear();
    var month = date.getMonth();

    var min = new Date(year, month -1, 1); //本月月初
    var max = new Date(year, month , 0); //本月月底

    //起始时间的年月日
    var year1 = min.getFullYear();
    var month1: any = min.getMonth() + 1;
    var day1: any = min.getDate();
    //结束时间的年月日
    var year2 = max.getFullYear();
    var month2: any = max.getMonth() + 1;
    var day2: any = max.getDate();
    //处理起始时间小于10的追加"0"在前面
    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;
    //处理结束时间小于10的追加"0"在前面
    month2 = month2 < 10 ? "0" + month2 : month2;
    day2 = day2 < 10 ? "0" + day2 : day2;

    let start = year1 + "/" + month1 + "/" + day1 + " 00:00:00"; //起始时间
    let end = year2 + "/" + month2 + "/" + day2 + " 00:00:00"; //结束时间
    return { start: new Date(start), end: new Date(end) };
  }

  /*
*获取当前日期前N天或后N日期(N = day)
*type:1：前；2：后
*/
  GetDate(day, type) {
    var zdate = new Date();
    var edate;
    if (type === 1) {
      edate = new Date(zdate.getTime() - day * 24 * 60 * 60 * 1000);
    } else {
      edate = new Date(zdate.getTime() + day * 24 * 60 * 60 * 1000);
    }
    return edate;
  }
  /*
*获取传入的日期前N天或后N日期(N = day)
*type:1：前；2：后
*date：传入的日期
*/
  GetDate2(day, type, date) {
    var zdate;
    if (date === null || date === undefined) {
      zdate = new Date();
    } else {
      zdate = date;
    }
    var edate;
    if (type === 1) {
      edate = new Date(zdate.getTime() - day * 24 * 60 * 60 * 1000);
    } else {
      edate = new Date(zdate.getTime() + day * 24 * 60 * 60 * 1000);
    }
    return edate;
  }
}
