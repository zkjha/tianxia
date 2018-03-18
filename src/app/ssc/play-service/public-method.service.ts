import { Injectable } from "@angular/core";
import Tool from "lodash";

@Injectable()
export class PublicMethodService {
  get sumSpanMap() {
    let sumSpanMap = {};
    let sum3 = [
      "1",
      "3",
      "6",
      "10",
      "15",
      "21",
      "28",
      "36",
      "45",
      "55",
      "63",
      "69",
      "73",
      "75",
      "75",
      "73",
      "69",
      "63",
      "55",
      "45",
      "36",
      "28",
      "21",
      "15",
      "10",
      "6",
      "3",
      "1"
    ];
    let sum2 = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "1"
    ];
    let sumGroup3 = [
      "0",
      "1",
      "2",
      "2",
      "4",
      "5",
      "6",
      "8",
      "10",
      "11",
      "13",
      "14",
      "14",
      "15",
      "15",
      "14",
      "14",
      "13",
      "11",
      "10",
      "8",
      "6",
      "5",
      "4",
      "2",
      "2",
      "1",
      "0"
    ];
    let sumGroup2 = [
      "0",
      "1",
      "1",
      "2",
      "2",
      "3",
      "3",
      "4",
      "4",
      "5",
      "4",
      "4",
      "3",
      "3",
      "2",
      "2",
      "1",
      "1",
      "0"
    ];
    let span3 = [
      "10",
      "54",
      "96",
      "126",
      "144",
      "150",
      "144",
      "126",
      "96",
      "54"
    ];
    let span2 = ["10", "18", "16", "14", "12", "10", "8", "6", "4", "2"];
    sumSpanMap["sum3"] = sum3;
    sumSpanMap["sum2"] = sum2;
    sumSpanMap["sumGroup3"] = sumGroup3;
    sumSpanMap["sumGroup2"] = sumGroup2;
    sumSpanMap["span3"] = span3;
    sumSpanMap["span2"] = span2;

    return sumSpanMap;
  }
  public splitStrNumber(num, delimter) {
    if (num.indexOf("|") >= 0) {
      return num.replace(new RegExp("\\|", "g"), delimter);
    }
    let ret = "";
    let flag = false;
    for (let i = 0; i < num.length; i++) {
      if (flag) {
        ret += delimter + num.substring(i, i + 1);
      } else {
        ret += num.substring(i, i + 1);
        flag = true;
      }
    }
    // console.log(ret)
    return ret;
  }
  public groupSelect(group) {
    let firstSelectStr = group["firstSelectStr"];
    let firstCount = group["first"];
    let firstRepeat = group["firstRepeat"];
    let secondSelectStr = group["secondSelectStr"];
    let secondCount = group["second"];
    let secondRepeat = group["secondRepeat"];
    let selectNum = group["selectNum"];
    if (firstCount * firstRepeat + secondCount * secondRepeat != selectNum) {
      alert("group model error");
      return 0;
    }

    if (firstSelectStr == "" || (secondCount != 0 && secondSelectStr == "")) {
      return 0;
    }

    let firstSelectNumArray = firstSelectStr.split(",");
    if (secondSelectStr == null) {
      return this.nCSelectM(firstSelectNumArray.length, firstCount);
    }
    let secondSelectNumArray = secondSelectStr.split(",");
    let commonNumArray = this.findCommonArray(
      firstSelectNumArray,
      secondSelectNumArray
    );
    let firstRestNumArray = this.restArray(firstSelectNumArray, commonNumArray);
    let sum = 0;

    sum +=
      this.nCSelectM(firstRestNumArray.length, firstCount) *
      this.nCSelectM(secondSelectNumArray.length, secondCount);


    sum +=
      this.nCSelectM(commonNumArray.length, firstCount) *
      this.nCSelectM(secondSelectNumArray.length - firstCount, secondCount);
    for (let i = 1; i < firstCount; i++) {
      sum +=
        this.nCSelectM(commonNumArray.length, i) *
        this.nCSelectM(firstRestNumArray.length, firstCount - i) *
        this.nCSelectM(secondSelectNumArray.length - i, secondCount);
    }
    return sum;
  }

  public nCSelectM(n, m) {
    if (n == 0) {
      return 0;
    }
    if (n == m || m == 0) {
      return 1;
    }
    if (n < m) {
      return 0;
    }
    if (n - m + 1 < m) {
      return this.nCSelectM(n, n - m);
    }
    let nA = this.nASelectM(n, m);
    let mC = this.factorial(m);
    return nA / mC;
  }

  public nASelectM(n, m) {
    let multi = n;
    for (let i = n - m + 1; i < n; i++) {
      multi *= i;
    }
    return multi;
  }
  public factorial(n) {
    let multi = n;
    for (let i = 1; i < n; i++) {
      multi *= i;
    }
    return multi;
  }

  public splitStrNumber2(num, delimter) {
    return num.replace(new RegExp("\\|", "g"), delimter);
  }
  public splitStrArray2(num) {
    if (num != "") {
      return num.split("|");
    }
    return new Array();
  }
  public splitStrArray(num) {
    if (num.indexOf("|") >= 0) {
      return num.split("|");
    }
    let ret = new Array();
    for (let i = 0; i < num.length; i++) {
      ret.push(num.substring(i, i + 1));
    }
    return ret;
  }
  // src 1,1,1,,
  public getLocationArray(src) {
    let srcSplit = src.split(",");
    let ret = new Array();
    let index = 0;
    for (let i = 0; i < srcSplit.length; i++) {
      if (srcSplit[i] != "" && srcSplit[i] == "1") {
        ret[index++] = i;
      }
    }
    return ret;
  }
  /**
   * @Title: selectN
   * @Description: ["1","2","3"],2 = ["1,2","1,3","2,3"]
   */
  public selectN(src, n) {
    let retArray = new Array();
    if (src.length < n) {
      return retArray;
    }
    this.selectN2(src, 0, n, null, retArray);
    return retArray;
  }

  public selectN2(src, srcStart, n, prefix, ret) {
    if (n == 1) {
      let prefix2 = prefix == null ? "" : prefix + ",";
      for (let i = srcStart; i < src.length; i++) {
        //alert("1."+prefix2+src[i]);
        ret.push(prefix2 + src[i]);
      }
      return;
    }
    if (src.length - srcStart == n) {
      let prefix2 = prefix == null ? "" : prefix + ",";
      //alert("2."+prefix2+ strArrayJoin(src, ",", srcStart));
      ret.push(prefix2 + this.strArrayJoin(src, ",", srcStart));
      return;
    }
    let prefix2 = prefix == null ? src[srcStart] : prefix + "," + src[srcStart];
    this.selectN2(src, srcStart + 1, n - 1, prefix2, ret);
    if (src.length - srcStart - 1 >= n) {
      this.selectN2(src, srcStart + 1, n, prefix, ret);
    }
  }

  public strArrayJoin(src, delimter, srcStart) {
    let ret = "";
    let flag = false;
    for (let i = srcStart; i < src.length; i++) {
      if (flag) {
        ret += delimter + src[i];
      } else {
        ret += src[i];
        flag = true;
      }
    }
    return ret;
  }

  public findCommonArray(firstSelectNumArray, secondSelectNumArray) {
    let retArray = new Array();
    let index = 0;
    for (let i = 0; i < firstSelectNumArray.length; i++) {
      for (let j = 0; j < secondSelectNumArray.length; j++) {
        if (firstSelectNumArray[i] == secondSelectNumArray[j]) {
          retArray[index++] = firstSelectNumArray[i];
          break;
        }
      }
    }
    return retArray;
  }

  public restArray(firstSelectNumArray, common) {
    let retArray = new Array();
    let index = 0;
    for (let i = 0; i < firstSelectNumArray.length; i++) {
      let flag = true;
      for (let j = 0; j < common.length; j++) {
        if (firstSelectNumArray[i] == common[j]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        retArray[index++] = firstSelectNumArray[i];
      }
    }
    return retArray;
  }
  //danValues和tuoValues不能有公共值
  public dantuoSelectBets(danValues, tuoValues, betLength) {
    // console.log(danValues, tuoValues, betLength)
    if (danValues.length >= 1) {
      let tuoSelectLen = betLength - danValues.length;
      let selectNums = this.nCSelectM(tuoValues.length, tuoSelectLen);
      return selectNums;
    } else {
      return 0;
    }
  }

  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }

  reduceRepeatElement(s) {
    var ret = [];
    for (var i = 0; i < s.length; i++) {
      var flag = true;
      for (var j = 0; j < ret.length; j++) {
        if (ret[j] == s[i]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        ret.push(s[i]);
      }
    }
    return ret;
  }
  public getLocationArraySelect(data, type?): Array<string> {
    let ret = [];

    if (type == "group") {
      Tool.forEach(data, (item, index) => {
        if (index == 0) {
          Tool.forEach(item.row, item2 => {
            if (item2.status) {
              ret.push("1");
            } else {
              ret.push("");
            }
          });
        }
      });
    } else {
      Tool.forEach(data, item => {
        Tool.forEach(item.row, item2 => {
          if (item2.status) {
            ret.push("1");
          } else {
            ret.push("");
          }
        });
      });
    }

    return ret;
  }
  /**
   * 空格 ， 替换为,
   * @param {*} str
   */
  public replaceNone(str) {
    var reg = /[\s+，]/g;
    return str.replace(reg, ",");
  }
}
