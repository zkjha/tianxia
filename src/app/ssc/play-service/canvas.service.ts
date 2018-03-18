import { StorageService } from "../../service/storage.service";
import { Injectable } from "@angular/core";

@Injectable()
export class Draw {
  obj: any;
  cObj: any;
  pathr: any;
  bili: any;
  x: any;
  y: any;
  r: any;
  score: any;
  colorline: any;
  isDown: any;
  constructor(private storage: StorageService) {}
  init(x, max, c = document.getElementById("canvas"), color?) {
    if(c){
    this.obj = c; //获取canvas对象
    this.cObj = this.obj.getContext("2d");
    this.pathr = 90; //滑动路径半径
    this.event(); //初始化事件
    this.bili = 1;
    // this.draw.prototype = this; //draw继承Draw方法
    let target = this.calculationScope(x, max); //这里传值
    let tar: any = this.respotchange(target);
    if(x==0){
      tar.x=110;
      tar.y=200;
    }
    this.draw(tar.x, tar.y, 12, null, target); //创建实例p
    }
  }
  draw(x, y, r, o?, j?) {
    //绘图
    this.cObj.clearRect(0, 0, 400, 400);
    this.x = x;
    this.y = y;
    this.r = r;

    this.cObj.beginPath();
    this.cObj.arc(200, 200, this.pathr, Math.PI, Math.PI * 2, false); // 绘制外侧圆弧
    this.cObj.strokeStyle = "#c0c0c0";
    this.cObj.lineCap = "round";
    this.cObj.lineWidth = 10;
    this.cObj.stroke();

    this.colorline = this.cObj.createRadialGradient(
      200,
      200,
      160,
      100,
      200,
      100
    );
    //添加颜色端点
    this.colorline.addColorStop(0, "rgb(10,60,100)");
    this.colorline.addColorStop(0.5, "rgb(13,87,150)");
    this.colorline.addColorStop(1, "rgb(23,132,255)");
    let offset = o == null ? j.jiaodu : o - Math.PI;

    if (offset < 0) {
      offset = 0;
    }

    this.cObj.beginPath();
    this.cObj.arc(200, 200, this.pathr, Math.PI, Math.PI + offset, false); // 可变圆弧
    this.cObj.strokeStyle = this.colorline;
    this.cObj.lineCap = "round";
    this.cObj.lineWidth = 10;
    this.cObj.stroke();

    // // 0%
    // this.cObj.fillStyle = "#222";
    // this.cObj.font = "14px PT Sans";
    // this.cObj.fillText(
    //   "0%",
    //   this.obj.width / 3 - 30,
    //   this.obj.height - 168,
    //   50
    // );

    // 100%数字
    this.cObj.fillStyle = "#222";
    this.cObj.font = "12px PT Sans";

    this.score = offset / this.bili;
    //let textWidth = this.cObj.measureText(this.score+'%').width;
    this.cObj.fillText(this.score.toFixed(1) + "%", // this.obj.width / 2 + 75,
      this.obj.width / 3 - 30, this.obj.height - 168, 50);
    this.drawCircular(x, y, r);

    return this.score; //返回滚动条当前位置值
  }
  drawCircular(x, y, r) {
    this.cObj.beginPath();
    this.cObj.moveTo(200, 200);
    this.cObj.arc(x, y, r, 0, Math.PI * 2, false); // 绘制滑块
    this.cObj.fillStyle = "#1784ff";
    this.cObj.fill();

    this.cObj.beginPath();
    this.cObj.moveTo(200, 200);
    this.cObj.arc(x, y, 8, 0, Math.PI * 2, false); // 绘制滑块内侧
    this.cObj.fillStyle = "#ffffff";
    this.cObj.fill();
  }
  calculationScope(targetValue, AllValue) {
    let target: any = {};
    target.bili = Math.PI / AllValue;
    let jiaodu = targetValue * target.bili;
    target.x = Math.cos(jiaodu + Math.PI) * this.pathr;
    target.y = Math.sin(jiaodu) * this.pathr;
    this.bili = target.bili;
    target.jiaodu = jiaodu;
    return target;
  }
  OnMouseMove(evt?) {
    if (this.isDown) {
      let a: any = {};
      a.x = this.getx(evt);
      a.y = this.gety(evt);
      let b: any = this.spotchange(a);
      if (this.check(b.x, b.y)) {
        let co: any = this.getmoveto(b.x, b.y);
        let tar: any = this.respotchange(co);
        let o = co.z;
        let scope = this.draw(tar.x, tar.y, this.r, o);
        this.storage.setStorage(this.round(scope), "scope");
        // return scope;
      }
    }
  }
  OnMouseDown(evt) {
    let X = this.getx(evt);
    let Y = this.gety(evt);
    let minX = this.x - this.r;
    let maxX = this.x + this.r;
    let minY = this.y - this.r;
    let maxY = this.y + this.r;
    if (minX < X && X < maxX && minY < Y && Y < maxY) {
      //判断鼠标是否在滑块上
      this.isDown = true;
      this.storage.setStorage(true, "isDown");
    } else {
      this.isDown = false;
      this.storage.setStorage(false, "isDown");
    }
  }
  OnMouseUp() {
    //鼠标释放
    this.storage.setStorage(false, "isDown");
    this.isDown = false;
  }
  event() {
    //事件绑定
    this.obj.addEventListener("mousedown", this.OnMouseDown.bind(this), false);
    this.obj.addEventListener("mousemove", this.OnMouseMove.bind(this), false);
    this.obj.addEventListener("mouseup", this.OnMouseUp.bind(this), false);
  }
  getmoveto(lx, ly) {
    if (!this.isDown) {
      return false;
    }
    let tem: any = {};
    tem.o = Math.atan(ly / lx); //鼠标移动点圆形角
    tem.x = this.pathr * Math.cos(tem.o);
    tem.y = this.pathr * Math.sin(tem.o);
    if (lx < 0) {
      //坐标点处理
      tem.x = -tem.x;
      tem.y = -tem.y;
    }
    if (lx > 0) {
      //弧度值处理
      tem.z = -Math.atan(tem.y / tem.x) + Math.PI * 2;
    } else {
      tem.z = -Math.atan(tem.y / tem.x) + Math.PI;
    }
    if (tem.z > 6.28) {
      //最大值
      tem.z = 6.28;
      tem.x = this.pathr * Math.cos(Math.PI * 2);
      tem.y = -this.pathr * Math.sin(Math.PI * 2);
    }
    if (tem.z < 3.14) {
      //最小值
      tem.z = 3.14;
      tem.x = this.pathr * Math.cos(Math.PI);
      tem.y = -this.pathr * Math.sin(Math.PI);
    }
    return tem;
  }
  spotchange(a) {
    //canvas内坐标转化为圆形坐标
    let target: any = {};
    if (a.x < 200 && a.y < 200) {
      target.x = -(200 - a.x);
      target.y = 200 - a.y;
    } else if (a.x > 200 && a.y < 200) {
      target.x = a.x - 200;
      target.y = 200 - a.y;
    } else if (a.x > 200 && a.y > 0) {
      target.x = a.x - 200;
      target.y = -(a.y - 200);
    } else if (a.x < 200 && a.y > 200) {
      target.x = -(200 - a.x);
      target.y = -(a.y - 200);
    }
    return target;
  }
  respotchange(a) {
    //圆心坐标转换为canvas内坐标
    let target: any = {};
    if (a.x > 0 && a.y > 0) {
      target.x = 200 + a.x;
      target.y = 200 - a.y;
    } else if (a.x < 0 && a.y > 0) {
      target.x = 200 + a.x;
      target.y = 200 - a.y;
    } else if (a.x < 0 && a.y < 0) {
      target.x = 200 + a.x;
      target.y = -(a.y - 200);
    } else if (a.x > 0 && a.y < 0) {
      target.x = 200 + a.x;
      target.y = -(a.y - 200);
    }
    return target;
  }
  check(x, y) {
    //限制可拖动范围
    let xx = x * x;
    let yy = y * y;
    let rr = (this.pathr - 6) * (this.pathr - 6); //最小
    let rrr = 126 * 126; //最大
    if (xx + yy > rr && xx + yy < rrr) {
      return true;
    }
    return false;
  }
  getx(ev) {
    //获取鼠标在canvas内坐标x
    return ev.clientX - this.obj.getBoundingClientRect().left;
  }
  gety(ev) {
    //获取鼠标在canvas内坐标y
    return ev.clientY - this.obj.getBoundingClientRect().top;
  }

  round(v, e = 1) {
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
  }
}
