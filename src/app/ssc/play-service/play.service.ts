import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Tool from "lodash";
import "rxjs/Rx";
import { PublicMethodService } from "./public-method.service";
import { StorageService } from "../../service/storage.service";

@Injectable()
export class PlayService {
  // 游戏类型
  private globalGameType;
  // 开奖模式
  private globalBingoType;
  // 号码模式
  private globalCodeSelectType;

  private globalBetLength;

  private globalMultiBet;

  private globalBingoCode;

  private globalSelectRule;

  private globalScriptRule;

  private globalBetCode;

  constructor(
    private pb: PublicMethodService,
    private storage: StorageService
  ) {
    /*######################数据解析部分#############*/
  }

  // 玩法数据解析
  public sortPlayData(playData) {
    // console.log(`当前玩法类型---${playData.codeSelect}`)
    // console.log(playData)
    if (
      playData.codeSelect != "single" &&
      playData.codeSelect != "optionalSingle"
    ) {
      return this.sortCode(playData);
    } else {
      // 输入框
      if (playData.codeSelect == "single") {
        // 一个输入框
        playData.isShowType = 4;
        return playData;
      } else if (playData.codeSelect == "optionalSingle") {
        return this.sortCode(playData);
      }
    }
  }
  // 玩法整理
  private sortCode(play) {
    const code = play["selectRule"]["codeZone"]["code"];
    const title = play["selectRule"]["codeZone"]["title"];
    const playData = [];
    for (let i = 0; i < code.length; i++) {
      const codeStruct = code[i];
      playData.push({
        row: this.codeToArray(codeStruct, play["game_id"]),
        titel: title[i]
      });
    }
    play.playData = playData;
    if (play.codeSelect == "optionalSingle") {
      // 输入框带多选
      play.isShowType = 3;
    } else if (play.codeSelect == "optionalGroup") {
      // 多选带按钮
      play.isShowType = 2;
    } else if (play.codeSelect == "dantuo") {
      // 胆拖样式和1一样
      play.isShowType = 5;
    } else {
      // 默认
      play.isShowType = 1;
    }
    // console.log(play)
    // 默认激活
    if (
      play.codeSelect == "optionalGroup" ||
      play.codeSelect == "optionalSingle"
    ) {
      play.playData[0].row.forEach((item, index) => {
        if (index < play.codeBetLength) {
          item.status = true;
        }
      });
    }
    return play;
  }
  // 选着
  /**
   *
   * @param playData
   * @param index 第几行
   * @param type  处理的类型
   * @param isDantuo 是否胆拖
   */
  playChoose(playData, index, type, isDantuo?) {
    // console.log(playData)
    let length = playData.playData[index].row.length;
    // 清除
    if (type == "remove") {
      playData.playData.forEach( item => {
        item.row.forEach(item2 => {
          item2.status = false;
        });
      });
      return playData;
    } else {
      playData.playData[index].row.forEach((item, index) => {
        item.status = false;
        if (type == "全") {
          item.status = true;
        } else if (type == "清") {
          item.status = false;
        } else if (type == "双") {
          item.data % 2 == 0 ? (item.status = true) : (item.status = false);
        } else if (type == "单") {
          item.data % 2 == 0 ? (item.status = false) : (item.status = true);
        } else if (type == "大" && index > length / 2 - 1) {
          item.status = true;
        } else if (type == "小" && index < length / 2) {
          item.status = true;
        }
      });
      // 判断是否胆拖
      if (isDantuo == "dantuo") {
        return (playData = this.dantuo(playData, 1));
      } else {
        return playData;
      }
    }
  }

  /**
   *
   * @param playData 处理的数据
   * @param lastIndex 选的第几排 0 1
   * @param index  选的第几个
   */
  dantuo(playData, lastIndex, index?) {
    let arr = [];
    // 只能选几个
    playData.playData[0].row.forEach((item, i) => {
      if (item.status == true) {
        arr.push(i);
      }
    });

    if (arr.length > playData.codeBetLength - 1) {
      for (let i = 0; i < playData.playData[0].row.length; i++) {
        // 删后面
        if (index <= arr[0]) {
          if (arr[arr.length - 1] == i) {
            playData.playData[0].row[i].status = false;
            break;
          }
        } else {
          // 删前面
          if (arr[0] == i) {
            playData.playData[0].row[i].status = false;
            break;
          }
        }
      }
    }

    //上下互斥

    if (lastIndex == 0) {
      playData.playData[0].row.forEach( (item, index) => {
        if (item.status == true) {
          // console.log(item)
          playData.playData[1].row[index].status = false;
        }
      });
    } else {
      playData.playData[lastIndex].row.forEach((item, index) => {
        if (item.status == true) {
          // console.log(item)
          playData.playData[0].row[index].status = false;
        }
      });
    }

    return playData;
  }

  // 返回游戏类型
  private getGameType(gameId): String {
    let ssc = [1, 2, 3, 4, 10, 11, 12, 14, 24, 33, 34, 35, 36, 37, 38];
    let k3 = [9, 27, 28];
    let k10 = [30, 31];
    let s5 = [5, 6, 7, 8, 25];
    let pk10 = [13];
    if (this.elementInArray(gameId, ssc)) {
      return "ssc";
    } else if (this.elementInArray(gameId, k3)) {
      return "k3";
    } else if (this.elementInArray(gameId, k10)) {
      return "k10";
    } else if (this.elementInArray(gameId, s5)) {
      return "s5";
    } else if (this.elementInArray(gameId, pk10)) {
      return "pk10";
    } else {
    }
  }
  // 遍历
  private elementInArray(gameId, array): Boolean {
    for (let i = 0; i < array.length; i++) {
      if (gameId == array[i]) {
        return true;
      }
    }
    return false;
  }

  // 解析玩法 返回数组
  private codeToArray(code, gameId): Array<any> {
    let globalGameType = this.getGameType(gameId);
    // console.log(`游戏类型-------${globalGameType}`)
    // 切割 | 类型
    if (code.indexOf("|") >= 0) {
      code = code.split("|");
      let arr = [];
      code.forEach(item => {
        arr.push({
          data: item,
          status: false
        });
      });

      return arr;
    }
    let codeSplit = code.split("-");
    if (codeSplit.length == 2) {
      // alert(codeSplit[0]+","+codeSplit[1]);
      let start = parseInt(codeSplit[0]);
      let end = parseInt(codeSplit[1]);
      let ret = [];
      for (let i = start; i <= end; i++) {
        if (
          globalGameType == "pk10" ||
          globalGameType == "k10" ||
          globalGameType == "s5"
        ) {
          if (i < 10) {
            ret.push({
              data: `0${i}`,
              status: false
            });
          } else {
            ret.push({
              data: i,
              status: false
            });
          }
        } else {
          ret.push({
            data: i,
            status: false
          });
        }
      }
      // alert(ret);
      return ret;
    } else {
      let ret = [];
      ret.push({
        data: code,
        status: false
      });
      return ret;
    }
  }

  /*######################数据计算部分#############*/

  // 计算堵住码
  recalcBetCode(playData, textareaValue?) {
    // console.log(playData.playData)
    // 选中的数据
    let selectNum;
    // 游戏类型
    this.globalGameType = this.getGameType(playData["game_id"]);
    // 开奖模式
    this.globalBingoType = playData["bingoType"];
    // 号码模式
    this.globalCodeSelectType = playData["codeSelect"];
    // 未知
    let locationNum = null;

    this.globalBetLength = playData["codeBetLength"];

    this.globalMultiBet = playData["codeBetMultiple"];

    this.globalBingoCode = playData["bingoCode"];

    let codeZone = playData.selectRule["codeZone"];

    this.globalSelectRule = codeZone;
    // console.log(playData.selectRule)

    this.globalScriptRule = playData.selectRule["scriptRule"];

    /**
     * 输入框带多选
     */
    if (this.globalCodeSelectType == "optionalSingle") {
      if (!textareaValue) {
        return;
      }
      let singleInput;
      textareaValue = this.pb.replaceNone(this.pb.trim(textareaValue));
      console.log(textareaValue);
      locationNum = this.pb.getLocationArraySelect(playData.playData);
      singleInput = this.filterSingleInput(textareaValue);

      if (singleInput.length == 0) {
        selectNum = [];
      } else {
        selectNum = singleInput.split(",");
      }
      /**
       * 特殊多选
       */
    } else if (this.globalCodeSelectType == "optionalGroup") {
      locationNum = this.pb.getLocationArraySelect(playData.playData, "group");

      let ret = [];

      playData.playData.forEach( (item, index) => {
        let value = "";
        // console.log(item)
        if (index > 0) {
          item.row.forEach(item2 => {
            if (item2.status == true) {
              value += item2.data;
            }
          });
          ret.push(value);
        }
      });
      selectNum = ret;

      /**
       * 输入框
       */
    } else if (this.globalCodeSelectType == "single") {
      textareaValue = this.pb.replaceNone(this.pb.trim(textareaValue));
      // console.log(textareaValue)

      let singleInput = this.filterSingleInput(textareaValue);
      if (singleInput.length == 0) {
        selectNum = [];
      } else {
        selectNum = singleInput.split(",");
      }
      /**
       * 其他
       */
    } else {
      // directly 类型
      let length = playData.playData.length;
      let ret = [];
      let flag = "";
      playData.playData.forEach((item, index) => {
        let value = [];
        // console.log(item)
        item.row.forEach(item2 => {
          if (item2.status == true) {
            value.push(item2.data);
            if (item2.data.toString().length > 1) {
              flag = "|";
            }
          }
        });
        ret.push(value.join(flag));
      });
      // console.log(ret)
      selectNum = ret;
    }
    // console.log(`当前解析值${selectNum}`)
    // todo 调用计算
    // return;
    // console.log(locationNum,selectNum)
    this.globalBetCode = this.generateBetCode(
      this.globalGameType,
      this.globalCodeSelectType,
      this.globalBingoType,
      selectNum,
      locationNum
    );

    // 渲染几注
    if (selectNum.length == 0) {
      return 0;
    } else {
      let betCounts = this.calculateBet(
        this.globalGameType,
        this.globalCodeSelectType,
        this.globalBingoType,
        this.globalBetLength,
        this.globalMultiBet,
        this.globalBingoCode,
        this.globalSelectRule,
        this.globalBetCode
      );
      // console.log(betCounts)
      return betCounts;
    }
  }

  // 解析计算数据
  generateBetCode(gameType, codeSelect, bingoType, selectNum, locationNum) {
     console.log(gameType, codeSelect,bingoType, selectNum, locationNum)
    let globalBetCode = "";
    if (gameType == "ssc") {
      if (codeSelect == "directly") {
        // 复式通用
        if (bingoType == "normal") {
          // 普通 5,46,356,24,35
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          // 12345
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "group") {
        // 组选通用
        if (bingoType == "normal") {
          // 普通模式 02468,56789 "betNum":["2","1"],"overlap":["2","1"]  codeBetLength:5
          // 0123456789 "betNum":["5"] codeBetLength:5
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          // 1234567  selectRule:{"betNum":["2"],"overlap":["1"]}
          globalBetCode = selectNum.join(",");
          // todo  改算法 2017.11.7
        } else if (bingoType == "function") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "location") {
        // 定位胆
        if (bingoType == "regToCode") {
          // 正则模式 ,,,,01234 ,,13579,,
          // 0123456789,0123456789,0123456789,0123456789,0123456789
          globalBetCode = selectNum.join(",");
        }else if(bingoType=="compareToCode"){
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "optionalCompound") {
        // 任选复式
        if (bingoType == "regToCode") {
          // 正则模式 01234589,12345678,,01234567,5678
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "optionalSingle") {
        // 任选单式
        if (bingoType == "regToCode") {
          // 正则模式 1,1,1,,|113,335
          let locationStr = locationNum.join(",");
          let tmpCode = selectNum.join(",");
          globalBetCode = locationStr + "|" + tmpCode;
        }
      } else if (codeSelect == "optionalGroup") {
        // 任选组选
        // toto 改算法 2017.11.7
        if (bingoType == "function") {
          // 正则模式 1,1,1,,|123,45 1,1,1,,|123456
          let locationStr = locationNum.join(",");
          let tmpCode = selectNum.join(",");
          globalBetCode = locationStr + "|" + tmpCode;
        }
      } else if (codeSelect == "single") {
        // 单式通用
        if (bingoType == "normal") {
          // 普通模式 12391,30191,12384
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "span") {
        // 跨度直选
        if (bingoType == "span") {
          // 跨度模式 0123456789
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "sum") {
        // 和值直选
        if (bingoType == "sum") {
          // 和值模式 10|11|12|13|14|15|16|17|18
          globalBetCode = selectNum.join("|");
        }
      } else if (codeSelect == "sumGroup") {
        // 和值组选
        if (bingoType == "sum") {
          // 和值模式 10|11|12|13|14|15|16|17|18
          globalBetCode = selectNum.join("|");
        }
      } else if (codeSelect == "dantuo") {
        // 时时彩无胆拖模式
      }
    } else if (gameType == "k3") {
      if (codeSelect == "dantuo") {
        if (bingoType == "normal") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "location") {
        if (bingoType == "other") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "group") {
        if (bingoType == "normal") {
          // 普通模式 02468,56789 "betNum":["1","1"],"overlap":["2","1"]
          // 0123456789 "betNum":["5"]
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          // 包含投注号码 0123456789
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "directly") {
        if (bingoType == "normal") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "sum") {
          globalBetCode = selectNum.join("|");
        } else if (bingoType == "other") {
          globalBetCode = selectNum.join(",");
        }
      }
    } else if (gameType == "k10") {
      if (codeSelect == "dantuo") {
        if (bingoType == "normal") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "directly") {
        if (bingoType == "normal") {
          // 普通模式 betCode: 05,04|06,03|05|06,02|04,03|05 winCode: 5,4,3,2,5
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "group") {
        if (bingoType == "normal") {
          // 普通模式 02|04|06|08,05|06|07|08|09
          // "betNum":["1","1"],"overlap":["2","1"]
          // 0123456789 "betNum":["5"]
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          // 包含投注号码 betCode: 01|02|03|04|05|06 n个1重号
          globalBetCode = selectNum.join(",");
        }
      }
    } else if (gameType == "pk10") {
      if (codeSelect == "directly") {
        if (bingoType == "normal") {
          // 普通模式 betCode: 05,04|06,03|05|06,02|04,03|05 winCode: 5,4,3,2,5
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "regToCode") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "location") {
        if (bingoType == "regToCode") {
          // 正则模式 ,,,,01|02|03|04 ,,01|03|05|07|09,,
          globalBetCode = selectNum.join(",");
        }
      }
    } else if (gameType == "s5") {
      if (codeSelect == "directly") {
        if (bingoType == "normal") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "dantuo") {
        // 胆拖
        if (bingoType == "normal") {
          // 01|02|03,05|06|07
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "containBingo") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "group") {
        if (bingoType == "normal") {
          // 普通模式 02|04|06|08,05|06|07|08|09
          // "betNum":["1","1"],"overlap":["2","1"]
          // 01|02|03|04|05|06|07|08|09 "betNum":["5"]
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          // 包含投注号码 01|02|03|04|05|06|07|08|09
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "containBingo") {
          globalBetCode = selectNum.join(",");
        }
      } else if (codeSelect == "single") {
        if (bingoType == "normal") {
          // 01|02|03|04|05,05|06|07|08|09
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "contain") {
          globalBetCode = selectNum.join(",");
        } else if (bingoType == "containBingo") {
          // 01|02|03|04|05|06|07,01|02|03|04|05|06|08
          globalBetCode = selectNum.join(",");
        }
      }
    }
    this.storage.setStorage(globalBetCode, "globalBetCode");
    return globalBetCode;
  }

  // 开始计算
  calculateBet(
    gameType,
    codeSelect,
    bingoType,
    codeBetLength,
    codeBetMultiple,
    bingoCode,
    selectRule,
    selectCode
  ) {
    // console.log(gameType, codeSelect, bingoType, codeBetLength, codeBetMultiple, bingoCode, selectRule, selectCode)
    if (gameType == "ssc") {
      return this.sscSelect(
        codeSelect,
        bingoType,
        codeBetLength,
        codeBetMultiple,
        bingoCode,
        selectRule,
        selectCode
      );
    } else if (gameType == "k3") {
      return this.k3Select(
        codeSelect,
        bingoType,
        codeBetLength,
        codeBetMultiple,
        bingoCode,
        selectRule,
        selectCode
      );
    } else if (gameType == "k10") {
      return this.k10Select(
        codeSelect,
        bingoType,
        codeBetLength,
        codeBetMultiple,
        bingoCode,
        selectRule,
        selectCode
      );
    } else if (gameType == "pk10") {
      return this.pk10Select(
        codeSelect,
        bingoType,
        codeBetLength,
        codeBetMultiple,
        bingoCode,
        selectRule,
        selectCode
      );
    } else if (gameType == "s5") {
      return this.s5Select(
        codeSelect,
        bingoType,
        codeBetLength,
        codeBetMultiple,
        bingoCode,
        selectRule,
        selectCode
      );
    }
    return 0;
  }

  // 时时彩，官方时时彩，低频彩
  sscSelect(
    codeSelect,
    bingoType,
    codeBetLength,
    codeBetMultiple,
    bingoCode,
    selectRule,
    selectCode
  ) {
    let ret = 0;
    if (codeSelect == "directly") {
      // 复式通用
      if (bingoType == "normal") {
        //普通 5,46,356,24,35
        let betValues = selectCode.split(",");
        let multi = 1;
        for (let i = 0; i < betValues.length; i++) {
          multi *= betValues[i].length;
        }
        ret = multi;
      } else if (bingoType == "contain") {
        //12345
        ret = selectCode.length;
      }
    } else if (codeSelect == "group") {
      //组选通用
      if (bingoType == "normal") {
        // 普通模式 02468,56789 "betNum":["2","1"],"overlap":["2","1"]  codeBetLength:5
        // 0123456789 "betNum":["5"] codeBetLength:5
        let betCodeValues = selectCode.split(",");
        let betNumArray = selectRule["betNum"];
        let group = {};
        if (betNumArray[0] == codeBetLength) {
          group["first"] = codeBetLength;
          group["firstRepeat"] = 1;
          group["second"] = 0;
          group["secondRepeat"] = 1;
        } else {
          let overlap = selectRule["overlap"];
          group["first"] = betNumArray[0];
          group["firstRepeat"] = overlap[0];
          group["second"] = betNumArray[1];
          group["secondRepeat"] = overlap[1];
          group["secondSelectStr"] = this.pb.splitStrNumber(
            betCodeValues[1],
            ","
          );
        }
        group["selectNum"] = codeBetLength;
        group["firstSelectStr"] = this.pb.splitStrNumber(betCodeValues[0], ",");
        ret = this.pb.groupSelect(group);
      } else if (bingoType == "contain") {
        //1234567  selectRule:{"betNum":["2"],"overlap":["1"]}
        ret = this.pb.nCSelectM(selectCode.length, codeBetLength);
        // todo   2017-11-7  航哥更改算法
      } else if ((bingoType = "function")) {
        var group = {};
        group["first"] = 1;
        group["firstRepeat"] = 2;
        group["second"] = 1;
        group["secondRepeat"] = 1;
        group["secondSelectStr"] = this.pb.splitStrNumber(selectCode, ",");
        group["selectNum"] = 3;
        group["firstSelectStr"] = this.pb.splitStrNumber(selectCode, ",");
        ret = this.pb.groupSelect(group);

        // 李航 11 20 新增
        return ret;
      }
    } else if (codeSelect == "location") {
      //定位胆
      if (bingoType == "regToCode" || bingoType == "compareToCode") {
        // 正则模式 ,,,,01234 ,,13579,,
        // 0123456789,0123456789,0123456789,0123456789,0123456789
        let str = selectCode.split(",");
        for (let i = 0; i < str.length; i++) {
          if (str[i] !== "") {
            ret += str[i].length;
          }
        }
      }
    } else if (codeSelect == "optionalCompound") {
      //任选复式
      if (bingoType == "regToCode") {
        // 正则模式 01234589,12345678,,01234567,5678
        let betValues = selectCode.split(",");
        let selectValues = new Array();
        for (let i = 0; i < betValues.length; i++) {
          selectValues.push(i);
        }
        let selectResult = this.pb.selectN(selectValues, codeBetLength);
        for (let j = 0; j < selectResult.length; j++) {
          let selectResultOne = selectResult[j];
          let locationtmp = selectResultOne.split(",");
          let count = 1;
          for (let k = 0; k < locationtmp.length; k++) {
            let index = parseInt(locationtmp[k]);
            if (betValues[index] !== "") {
              count *= betValues[index].length;
            } else {
              count = 0;
              break;
            }
          }
          ret += count;
        }
      }
    } else if (codeSelect == "optionalSingle") {
      //任选单式
      if (bingoType == "regToCode") {
        // 正则模式 1,1,1,,|113,335
        let betValues = selectCode.split("|");
        let locations = this.pb.getLocationArray(betValues[0]);
        let betLocations = this.pb.selectN(locations, codeBetLength);
        let betValuesSplit = betValues[1].split(",");
        ret = betLocations.length * betValuesSplit.length;
      }
    } else if (codeSelect == "optionalGroup") {
      //任选组选
      if (bingoType == "function") {
        //正则模式 1,1,1,,|123,45 1,1,1,,|123456
        var betValues = selectCode.split("|");
        var locations = this.pb.getLocationArray(betValues[0]);
        var betLocations = this.pb.selectN(locations, codeBetLength);
        var betCodeValues = betValues[1].split(",");
        var betNumArray = selectRule["betNum"];
        var group = {};
        if (betNumArray["1"] == codeBetLength) {
          group["first"] = codeBetLength;
          group["firstRepeat"] = 1;
          group["second"] = 0;
          group["secondRepeat"] = 1;
        } else {
          if (betCodeValues.length == 1) {
            group["secondSelectStr"] = this.pb.splitStrNumber(
              betCodeValues[0],
              ","
            );
          } else {
            group["secondSelectStr"] = this.pb.splitStrNumber(
              betCodeValues[1],
              ","
            );
          }
          var overlap = selectRule["overlap"];
          group["first"] = betNumArray["1"];
          group["firstRepeat"] = overlap["1"];
          group["second"] = betNumArray["2"];
          group["secondRepeat"] = overlap["2"];
        }
        group["selectNum"] = codeBetLength;
        group["firstSelectStr"] = this.pb.splitStrNumber(betCodeValues[0], ",");
        ret = this.pb.groupSelect(group) * betLocations.length;
      }
    } else if (codeSelect == "single") {
      //单式通用
      if (bingoType == "normal") {
        // 普通模式 12391,30191,12384
        if (selectCode !== "") {
          ret = selectCode.split(",").length;
        } else {
          ret = 0;
        }
      }
    } else if (codeSelect == "span") {
      //跨度直选
      if (bingoType == "span") {
        // 跨度模式 0123456789
        let count = bingoCode.split("|").length;
        let spankey = "span" + count;
        let spanArray = this.pb.sumSpanMap[spankey];
        let values = this.pb.splitStrArray(selectCode);
        for (let i = 0; i < values.length; i++) {
          let tmp = spanArray[parseInt(values[i])];
          ret += parseInt(tmp);
        }
      }
    } else if (codeSelect == "sum") {
      //和值直选
      if (bingoType == "sum") {
        // 和值模式 10|11|12|13|14|15|16|17|18
        let count = bingoCode.split("|").length;
        let sumkey = "sum" + count;
        let sumArray = this.pb.sumSpanMap[sumkey];
        let values = this.pb.splitStrArray(selectCode);
        for (let i = 0; i < values.length; i++) {
          let tmp = sumArray[parseInt(values[i])];
          ret += parseInt(tmp);
        }
      }
    } else if (codeSelect == "sumGroup") {
      //和值组选
      if (bingoType == "sum") {
        // 和值模式 10|11|12|13|14|15|16|17|18
        let count = bingoCode.split("|").length;
        let sumkey = "sumGroup" + count;
        let sumArray = this.pb.sumSpanMap[sumkey];
        let values = this.pb.splitStrArray(selectCode);
        for (let i = 0; i < values.length; i++) {
          let tmp = sumArray[parseInt(values[i])];
          ret += parseInt(tmp);
        }
      }
    } else if (codeSelect == "dantuo") {
      //时时彩无胆拖模式
      ret = 0;
    }
    return ret * codeBetMultiple;
  }

  //k3 快3
  k3Select(
    codeSelect,
    bingoType,
    codeBetLength,
    codeBetMultiple,
    bingoCode,
    selectRule,
    selectCode
  ) {
    let ret = 0;
    if (codeSelect == "dantuo") {
      if (bingoType == "normal") {
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray(betValues[0]),
          this.pb.splitStrArray(betValues[1]),
          codeBetLength
        );
      } else if (bingoType == "contain") {
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray(betValues[0]),
          this.pb.splitStrArray(betValues[1]),
          codeBetLength
        );
      }
    } else if (codeSelect == "location") {
      if (bingoType == "other") {
        ret = 1;
      }
    } else if (codeSelect == "group") {
      if (bingoType == "normal") {
        // 普通模式 02468,56789 "betNum":["1","1"],"overlap":["2","1"]
        // 0123456789 "betNum":["5"]
        let betCodeValues = selectCode.split(",");
        let betNumArray = selectRule["betNum"];
        let group = {};
        if (betNumArray[0] == codeBetLength) {
          group["first"] = codeBetLength;
          group["firstRepeat"] = 1;
          group["second"] = 0;
          group["secondRepeat"] = 1;
        } else {
          let overlap = selectRule["overlap"];
          group["first"] = betNumArray[0];
          group["firstRepeat"] = overlap[0];
          group["second"] = betNumArray[1];
          group["secondRepeat"] = overlap[1];
          group["secondSelectStr"] = this.pb.splitStrNumber(
            betCodeValues[1],
            ","
          );
        }
        group["selectNum"] = codeBetLength;
        group["firstSelectStr"] = this.pb.splitStrNumber(betCodeValues[0], ",");
        ret = this.pb.groupSelect(group);
      } else if (bingoType == "contain") {
        //包含投注号码 0123456789
        ret = this.pb.nCSelectM(selectCode.length, codeBetLength);
      }
    } else if (codeSelect == "directly") {
      if (bingoType == "normal") {
        let betValues = selectCode.split(",");
        let multi = 1;
        for (let i = 0; i < betValues.length; i++) {
          multi *= betValues[i].length;
        }
        ret = multi;
      } else if (bingoType == "contain") {
        ret = selectCode.length;
      } else if (bingoType == "sum") {
        let betValues = selectCode.split("|");
        ret = betValues.length;
      } else if (bingoType == "other") {
        ret = 1;
      }
    }
    return ret * codeBetMultiple;
  }

  //k10 快乐十分
  k10Select(
    codeSelect,
    bingoType,
    codeBetLength,
    codeBetMultiple,
    bingoCode,
    selectRule,
    selectCode
  ) {
    let ret = 0;
    if (codeSelect == "dantuo") {
      if (bingoType == "normal") {
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray2(betValues[0]),
          this.pb.splitStrArray2(betValues[1]),
          codeBetLength
        );
      } else if (bingoType == "contain") {
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray2(betValues[0]),
          this.pb.splitStrArray2(betValues[1]),
          codeBetLength
        );
      }
    } else if (codeSelect == "directly") {
      if (bingoType == "normal") {
        // 普通模式 betCode: 05,04|06,03|05|06,02|04,03|05 winCode: 5,4,3,2,5
        let betValues = selectCode.split(",");
        let multi = 1;
        for (let i = 0; i < betValues.length; i++) {
          if (betValues[i] !== "") {
            multi *= this.pb.splitStrArray2(betValues[i]).length;
          } else {
            multi = 0;
            break;
          }
        }
        ret = multi;
      } else if (bingoType == "contain") {
        let betValues = selectCode.split(",");
        let multi = 1;
        for (let i = 0; i < betValues.length; i++) {
          if (betValues[i] !== "") {
            multi *= this.pb.splitStrArray2(betValues[i]).length;
          } else {
            multi = 0;
            break;
          }
        }
        ret = multi;
      }
    } else if (codeSelect == "group") {
      if (bingoType == "normal") {
        // 普通模式 02|04|06|08,05|06|07|08|09
        // "betNum":["1","1"],"overlap":["2","1"]
        // 0123456789 "betNum":["5"]
        let betCodeValues = selectCode.split(",");
        let betNumArray = selectRule["betNum"];
        let group = {};
        if (betNumArray[0] == codeBetLength) {
          group["first"] = codeBetLength;
          group["firstRepeat"] = 1;
          group["second"] = 0;
          group["secondRepeat"] = 1;
        } else {
          let overlap = selectRule["overlap"];
          group["first"] = betNumArray[0];
          group["firstRepeat"] = overlap[0];
          group["second"] = betNumArray[1];
          group["secondRepeat"] = overlap[1];
          group["secondSelectStr"] = this.pb.splitStrNumber2(
            betCodeValues[1],
            ","
          );
        }
        group["selectNum"] = codeBetLength;
        group["firstSelectStr"] = this.pb.splitStrNumber2(
          betCodeValues[0],
          ","
        );
        ret = this.pb.groupSelect(group);
      } else if (bingoType == "contain") {
        //包含投注号码 betCode: 01|02|03|04|05|06 n个1重号
        ret = this.pb.nCSelectM(
          this.pb.splitStrArray2(selectCode).length,
          codeBetLength
        );
      }
    }
    return ret * codeBetMultiple;
  }

  //pk10
  pk10Select(
    codeSelect,
    bingoType,
    codeBetLength,
    codeBetMultiple,
    bingoCode,
    selectRule,
    selectCode
  ) {
    let ret = 0;
    if (codeSelect == "directly") {
      if (bingoType == "normal") {
        // 普通模式 betCode: 05,04|06,03|05|06,02|04,03|05 winCode: 5,4,3,2,5
        var betValues = selectCode.split(",");
        var code = [];
        for (var i = 0; i < betValues.length; i++) {
          if (betValues[i] != "") {
            //multi *= splitStrArray2(betValues[i]).length;
            code.push(this.pb.splitStrArray2(betValues[i]));
          } else {
            return 0;
          }
        }
        ret = this.pk10NoRepeat(code, [], 0);
      } else if (bingoType == "regToCode") {
        var betValues = selectCode.split(",");
        var code = [];
        for (var i = 0; i < betValues.length; i++) {
          if (betValues[i] != "") {
            //multi *= splitStrArray2(betValues[i]).length;
            code.push(this.pb.splitStrArray2(betValues[i]));
          } else {
            return 0;
          }
        }
        ret = this.pk10NoRepeat(code, [], 0);
      }
    } else if (codeSelect == "location") {
      if (bingoType == "regToCode") {
        //正则模式 ,,,,01|02|03|04 ,,01|03|05|07|09,,
        let betValues = selectCode.split(",");
        for (let i = 0; i < betValues.length; i++) {
          if (betValues[i] !== "") {
            ret += this.pb.splitStrArray2(betValues[i]).length;
          }
        }
      }
    }
    return ret * codeBetMultiple;
  }

  // 新的pk10
  pk10NoRepeat(code, removed, start) {
    if (code.length == start + 1) {
      var element = code[start];
      var ret = 0;
      for (var i = 0; i < element.length; i++) {
        var flag = true;
        for (var j = 0; j < removed.length; j++) {
          if (element[i] == removed[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          ret++;
        }
      }
      return ret;
    } else {
      var element = code[start];
      var ret = 0;
      for (var i = 0; i < element.length; i++) {
        var flag = true;
        for (var j = 0; j < removed.length; j++) {
          if (element[i] == removed[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          var removedTmp = [];
          removedTmp.push(element[i]);
          for (var k = 0; k < removed.length; k++) {
            removedTmp.push(removed[k]);
          }
          ret += this.pk10NoRepeat(code, removedTmp, start + 1);
        }
      }
      return ret;
    }
  }

  //11选5
  s5Select(
    codeSelect,
    bingoType,
    codeBetLength,
    codeBetMultiple,
    bingoCode,
    selectRule,
    selectCode
  ) {
    let ret = 0;
    if (codeSelect == "directly") {
      if (bingoType == "normal") {
        let betValues = selectCode.split(",");
        let multi = 1;
        for (let i = 0; i < betValues.length; i++) {
          if (betValues[i] !== "") {
            multi *= this.pb.splitStrArray2(betValues[i]).length;
          } else {
            multi = 0;
            break;
          }
        }
        ret = multi;
      } else if (bingoType == "contain") {
        if (selectCode !== "") {
          ret = this.pb.splitStrArray2(selectCode).length;
        } else {
          ret = 0;
        }
      }
    } else if (codeSelect == "dantuo") {
      //胆拖
      if (bingoType == "normal") {
        //01|02|03,05|06|07
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray2(betValues[0]),
          this.pb.splitStrArray2(betValues[1]),
          codeBetLength
        );
      } else if (bingoType == "contain") {
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray2(betValues[0]),
          this.pb.splitStrArray2(betValues[1]),
          codeBetLength
        );
      } else if (bingoType == "containBingo") {
        let betValues = selectCode.split(",");
        ret = this.pb.dantuoSelectBets(
          this.pb.splitStrArray2(betValues[0]),
          this.pb.splitStrArray2(betValues[1]),
          codeBetLength
        );
      }
    } else if (codeSelect == "group") {
      if (bingoType == "normal") {
        // 普通模式 02|04|06|08,05|06|07|08|09
        // "betNum":["1","1"],"overlap":["2","1"]
        // 01|02|03|04|05|06|07|08|09 "betNum":["5"]
        let betCodeValues = selectCode.split(",");
        let betNumArray = selectRule["betNum"];
        let group = {};
        if (betNumArray[0] == codeBetLength) {
          group["first"] = codeBetLength;
          group["firstRepeat"] = 1;
          group["second"] = 0;
          group["secondRepeat"] = 1;
        } else {
          let overlap = selectRule["overlap"];
          group["first"] = betNumArray[0];
          group["firstRepeat"] = overlap[0];
          group["second"] = betNumArray[1];
          group["secondRepeat"] = overlap[1];
          group["secondSelectStr"] = this.pb.splitStrNumber2(
            betCodeValues[1],
            ","
          );
        }
        group["selectNum"] = codeBetLength;
        group["firstSelectStr"] = this.pb.splitStrNumber2(
          betCodeValues[0],
          ","
        );
        ret = this.pb.groupSelect(group);
      } else if (bingoType == "contain") {
        //包含投注号码 01|02|03|04|05|06|07|08|09
        if (selectCode !== "") {
          let len = selectCode.split("|").length;
          ret = this.pb.nCSelectM(len, codeBetLength);
        } else {
          ret = 0;
        }
      } else if (bingoType == "containBingo") {
        if (selectCode !== "") {
          let len = selectCode.split("|").length;
          ret = this.pb.nCSelectM(len, codeBetLength);
        } else {
          ret = 0;
        }
      }
    } else if (codeSelect == "single") {
      if (bingoType == "normal") {
        //01|02|03,05|06|07
        if (selectCode !== "") {
          ret = selectCode.split(",").length;
        } else {
          ret = 0;
        }
      } else if (bingoType == "contain") {
        if (selectCode !== "") {
          ret = selectCode.split(",").length;
        } else {
          ret = 0;
        }
      } else if (bingoType == "containBingo") {
        if (selectCode !== "") {
          ret = selectCode.split(",").length;
        } else {
          ret = 0;
        }
      }
    }
    return ret * codeBetMultiple;
  }

  filterSingleInput(input) {
    // console.log(`输入---${input}`)
    var inputArray = input.split(",");
    var ret = [];
    // console.log(inputArray)
    for (var i = 0; i < inputArray.length; i++) {
      // console.log(this.globalScriptRule)
      if (
        this.globalScriptRule == null ||
        this.pb.trim(this.globalScriptRule) == ""
      ) {
        // console.log('我执行了上面！')
        if (this.singleInputOneLength(inputArray[i]) == this.globalBetLength) {
          // console.log(inputArray[i])
          ret.push(inputArray[i]);
        }
      } else {
        // console.log('我执行了下面！')
        // console.log(inputArray[i],this.globalScriptRule)
        if (
          this.singleInputOneLength(inputArray[i]) == this.globalBetLength &&
          this.checkSingleInputRule(inputArray[i], this.globalScriptRule)
        ) {
          ret.push(inputArray[i]);
        }
      }
    }
    // console.log(`输出---${ret.join(",")}`)
    return ret.join(",");
  }

  singleInputOneLength(input) {
    if (this.globalGameType == "ssc") {
      return input.length;
    } else {
      if (input == "") {
        return 0;
      }
      var tmp = input.split("|");
      return tmp.length;
    }
  }

  checkSingleInputRule(input, scriptRule) {
    // var index = -1;
    // var len = 0;
    // if ((index = scriptRule.indexOf(">")) != -1) {
    //     len = 1;
    // } else if ((index = scriptRule.indexOf(">=")) != -1) {
    //     len = 2;
    // } else if ((index = scriptRule.indexOf("<=")) != -1) {
    //     len = 2;
    // } else if ((index = scriptRule.indexOf("<")) != -1) {
    //     len = 1;
    // } else if ((index = scriptRule.indexOf("==")) != -1) {
    //     len = 2;
    // } else if ((index = scriptRule.indexOf("!=")) != -1) {
    //     len = 2;
    // }
    // if (index != -1) {
    //     var scriptOp = scriptRule.substring(index, index + len);
    //     var value = scriptRule.substring(index + len);
    //     value = this.pb.trim(value);
    //     var inputArray = [];
    //     if (this.globalGameType == "ssc") {
    //         inputArray = this.pb.splitStrArray(input);
    //     } else {
    //         inputArray = this.pb.splitStrArray2(input);
    //     }
    //     var unrepeat = this.pb.reduceRepeatElement(inputArray);
    //     if (unrepeat.length != value) {
    //         return false;
    //     }
    //     if (scriptOp == ">" && unrepeat.length > value) {
    //         return true;
    //     }
    //     if (scriptOp == ">=" && unrepeat.length >= value) {
    //         return true;
    //     }
    //     if (scriptOp == "<=" && unrepeat.length <= value) {
    //         return true;
    //     }
    //     if (scriptOp == "<" && unrepeat.length < value) {
    //         return true;
    //     }
    //     if (scriptOp == "==" && unrepeat.length == value) {
    //         return true;
    //     }
    //     if (scriptOp == "!=" && unrepeat.length != value) {
    //         return true;
    //     }
    // }
    // return false;
    var index = -1;
    var len = 0;
    var op = "";
    if ((index = scriptRule.indexOf(">")) != -1) {
      len = 1;
      op = ">";
    } else if ((index = scriptRule.indexOf(">=")) != -1) {
      len = 2;
      op = ">=";
    } else if ((index = scriptRule.indexOf("<=")) != -1) {
      len = 2;
      op = "<=";
    } else if ((index = scriptRule.indexOf("<")) != -1) {
      len = 1;
      op = "<";
    } else if ((index = scriptRule.indexOf("==")) != -1) {
      len = 2;
      op = "==";
    } else if ((index = scriptRule.indexOf("!=")) != -1) {
      len = 2;
      op = "!=";
    }
    if (index != -1) {
      var scriptOp = scriptRule.substring(index, index + len);
      var value = scriptRule.substring(index + len);
      value = this.pb.trim(value);
      var inputArray = [];
      if (this.globalGameType == "ssc") {
        inputArray = this.pb.splitStrArray(input);
      } else {
        inputArray = this.pb.splitStrArray2(input);
      }
      var unrepeat = this.pb.reduceRepeatElement(inputArray);
      if (op == ">" && unrepeat.length > value) {
        return true;
      } else if (op == ">=" && unrepeat.length >= value) {
        return true;
      } else if (op == "<" && unrepeat.length < value) {
        return true;
      } else if (op == "<=" && unrepeat.length <= value) {
        return true;
      } else if (op == "==" && unrepeat.length == value) {
        return true;
      } else if (op == "!=" && unrepeat.length != value) {
        return true;
      }
    }
    return false;
  }
}
