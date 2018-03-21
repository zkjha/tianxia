import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {LoginAfterComponent} from '../login-after/login-after.component';
import { ActivatedRoute } from "@angular/router";
import {HttpService} from '../service/http-service.service';
import { StorageService } from "../service/storage.service";
import {SscDetailComponent} from "./ssc-detail/ssc-detail.component";
import {SscSelectComponent} from "./ssc-select/ssc-select.component";
import {SscLeftComponent} from "./ssc-left/ssc-left.component";

@Component({
  selector: 'app-ssc',
  templateUrl: './ssc.component.html',
  styleUrls: ['./ssc.component.css']
})
export class SscComponent implements OnInit {
  playData: Object = {};
  isDetail = true;
  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpService,
    private storage: StorageService,
  ) { }

  // 头部
  @ViewChild(SscDetailComponent) private SscDetail: SscDetailComponent;
  @ViewChild(SscSelectComponent) private SscSelect: SscSelectComponent;
  // 左侧悬浮游戏菜单列表
  @ViewChild(SscLeftComponent) private Sscleft: SscLeftComponent;

  ngOnInit() {
    // 抓取传递过来的id
    this.routerInfo.params.subscribe(info => {
      const id = parseInt(info.id);
      console.log(info);

      const params = {
        game_id: id
      };
      this.http
        .postRx("/api/Games/getData", params)
        .map(data => this.arrangeData(data))
        .subscribe(data => {
          // this._isSpinning = false;
          //
          // this.playSelect.removeData();
          this.SscSelect.onClickBetType("default");
          this.SscDetail.getPlayData();
          // this.playTime.init();
          // this.playInfo.onClickBetlist();
          console.log(data);
        });
    });
  }
  arrangeData(data: any): Array<any> {
    let isRen = false;
    let arr = [];

    data.type.forEach((item, index) => {
      item.child = [];
      if (item.level === 0) {
        arr.push(item);
      }
    });

    arr.sort(function(a: any, b: any) {
      return a.sort - b.sort;
    });

    arr.forEach((item, index) => {
      data.type.forEach( item2 => {
        if(item2.title.indexOf('任') == 0){
          item2.isRen = 'none';
          item2.isChang = "block";
          isRen = true;
        }else{
          item2.isRen = 'block';
          item2.isChang = 'none';
        }
        if (item2.pid === item.id) {
          item.child.push(item2);
        }
      });
    });

    arr.forEach(item => {
      item.child.forEach( item2 => {
        data.play.forEach( item3 => {
          if (item3.pid === item2.id) {
            item2.child.push(item3);
          }
        });
      });
    });
    this.storage.setStorage(isRen, 'isRen')

    this.storage.setStorage(data["game"], "gameData");

    this.storage.setStorage(this.defaultActive(arr), "lotteryData");
    return [];
  }
  defaultActive(arr): Array<any> {
    arr.forEach((item, index) => {
      if (index === 0) {
        item.active = true;
      } else {
        item.active = false;
      }
      item.child.forEach((item2, index2) => {
        item2.child.forEach((item3, index3) => {
          if (index2 === 0 && index3 === 0) {
            item3.active = true;
          } else {
            item3.active = false;
          }
        });
      });
    });
    return arr;
  }
  getGameData(item) {
    let params = {
      id: item.id
    };
    this.http.postRx("/api/Games/getPlayDetail", params).subscribe(data => {
      this.playData = data;
      console.log(this.playData)
    });
  }
  isHideDetail(type) {
    // console.log(type)
    if (type == "default") {
      this.isDetail = true;
    } else if (type == "chase") {
      this.isDetail = false;
    }
  }

}
