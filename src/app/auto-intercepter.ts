import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import { NzMessageService } from "ng-zorro-antd";
import { Router } from "@angular/router";

import {StorageService} from "./service/storage.service";

/**
 * @description 拦截器，拦截所有http请求
 *  目前实现功能：
 *    1.请求的header中增加token
 *    2.判断响应体返回的状态码
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService, private router: Router, private storage: StorageService) {}

  // 如果需要注入service，使用这种方式，打开注释代码即可
  // private httpService: HttpService;
  // constructor(private injector: Injector) {
  // }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // this.httpService = this.injector.get(HttpService); // get HttpService  within intercept
    // HttpRequest和HttpResponse是不可变的，更改的时候只能clone
    // 请求的header中增加token
    // const authReq = request.clone({headers: request.headers.set('token', sessionStorage.getItem('token'))});
    return next.handle(request).do(event => {
      // console.log(event);
      if (event instanceof HttpResponse) {
        // console.log(event);
        // 判断返回是否符合要求
        if (event.body && event.body.errorCode) {
          const code = event.body.errorCode;
          const msg = event.body.errormsg;
          // 判断响应体返回的状态码
          switch (code) {
            // 成功
            // SUCCESS = "0000";
            case "0000":
              // msg ? this.message.success(msg) : this.message.success('请求成功');
              break;
            // 未登陆 需要跳转到登陆页面
            // NOT_LOGIN = "0001";
            case "0001":
            case "1000":
              // msg ? this.message.warning(msg) : this.message.warning('请先登录');
              this.storage.clear();
              this.router.navigate(["/home"]);
              break;
            // 参数异常
            // PARAM_ERROR = "1000";
            // USER_NOT_EXIST = "1001";
            // LOTTERY_NOT_EXIST = "1002";
            // PLAY_NOT_EXIST = "1003";
            // USERNAME_PASSWORD_ERROR = "1004";
            // VALID_CODE_ERROR = "1005";
            case "1000":
            case "1001":
            case "1002":
            case "1003":
            case "1004":
            case "1005":
              msg
                ? this.message.warning(msg)
                : this.message.warning("参数异常");
              break;
            // case  '1004':
            // break;
            // 业务错误
            // BUSINESS_ERROR = "2000";
            case "2000":
              msg ? this.message.error(msg) : this.message.error("业务错误");
              break;
            // 余额不足
            // USABLE_AMOUNT_NOT_ENOUGH = "2001";
            // BET_RECORD_NOT_EXIST = "2004";
            // CHASE_BET_RECORD_NOT_EXIST = "2005";
            case "2001":
            case "2004":
            case "2005":
              msg
                ? this.message.warning(msg)
                : this.message.warning("余额不足");
              break;
            // 已封单
            // BET_SINGLED = "2006";
            case "2006":
              msg ? this.message.warning(msg) : this.message.warning("已封单");
              break;
            // 没权限操作
            // NO_AUTHORITY = "2007";
            case "2007":
              msg
                ? this.message.warning(msg)
                : this.message.warning("没权限操作");
              break;
            // 返点超出范围
            // REBATE_ERROR = "2008";
            // INVITE_CODE_INVALIDATE = "2009";
            // NO_LOWERS = "2010";
            // USERNAME_INVALIDATE = "2011";
            // PASSWORD_INVALIDATE = "2012";
            // USER_INVALIDATE = "2013";
            // PAY_PASSWORD_INVALIDATE = "2014";
            // BANK_CARD_ERROR = "2015";
            // QQ_ERROR = "2016";
            // EMAIL_ERROR = "2017";
            // MOBILE_ERROR = "2018";
            case "2008":
            case "2009":
            case "2010":
            case "2011":
            case "2012":
            case "2013":
            case "2014":
            case "2015":
            case "2016":
            case "2017":
            case "2018":
              msg
                ? this.message.warning(msg)
                : this.message.warning("返点超出范围");
              break;
            // 系统异常
            // SYSTEM_ERROR = "5000";  // 服务器错误
            case "5000":
              // msg ? this.message.error(msg) : this.message.error("服务器错误");
              console.error(msg || '服务器错误！')
              break;
            case "3005":
              console.log("不提示！");
              break;
            default:
            // this.message.warning("未知的状态码，请检查后端返回状态码类型");
          }
        } else {
          console.error('后端返回参数不合法！')
          // this.message.error('后端返回参数不符合要求，请检查');
        }
      }
    });
  }
}
