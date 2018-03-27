import { StorageService } from '../service/storage.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../service/http-service.service';
import { Router } from '@angular/router';
import {CookieService} from '../service/cookie.service';
declare let $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  isVisible = false;
  loginAfter =true;
  loginShow =false;
  user={
    username:"",
    password:""
  };
  @Output() logShow = new EventEmitter();
  constructor(
    private http: HttpService,
    private router: Router,
    private storage: StorageService,
    private cookie:CookieService
  ) {}

  ngOnInit() {
    console.log(this.storage.getStorage('user_id'));
    if(this.cookie.getCookie("LURusername")&&this.cookie.getCookie("LURpassword")&&this.storage.getStorage('user_id')){
      this.user.username=this.cookie.getCookie("LURusername");
      this.user.password=this.cookie.getCookie("LURpassword");
      console.log("get user:"+this.cookie.getCookie("LURusername")+" password:"+this.cookie.getCookie("LURpassword"));
      this.loginShow = true;
      this.loginAfter = false;
    }
    this.storage.clear();
  }


  getCode(value) {
    console.log(value,"111");
    if ($("input[name=usernameL]").val() === "") {
      $("input[name=usernameL]").focus();
    } else {
      const params = {
        username: value.usernameL
      };

      this.http.postRx(`/api/captcha/getCaptchaCode`,params).subscribe(data => {
        // $(".codee").html(data.vcode);
        value.vcode = data.vcode;
        console.log(value,"code");
        this.login(value);
      });
    }
  }

  login(value) {
    const params = {
      username: value.usernameL,
      password: value.passwordL,
      vcode: value.vcode || null
    };
    console.log(params,"123");
    this.http.postRx(`/api/Users/login`, params, false).subscribe(data => {
      if (data) {
        this.cookie.setCookie("LURusername",value.usernameL);
        this.cookie.setCookie("LURpassword",value.passwordL);
        console.log("save user"+value.usernameL+" password"+value.passwordL);
        this.storage.setStorage(data["user_id"], "user_id");
        this.logShow.emit(1);
        this.loginAfter =false;
        this.loginShow =true;

        // alert("登录成功");
      }else{
        console.log(data);
        alert("用户名或密码错误");
      }
    });
  }

  showModal = () => {
    this.isVisible = true;
  };

  handleOk = e => {
    this.isVisible = false;
  };

  handleCancel = e => {
    this.isVisible = false;
  };
}
