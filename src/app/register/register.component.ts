import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';

declare let $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private http: HttpService,
    private routerInfo: ActivatedRoute,
    private router: Router) { }

    code = "";
    username = "";
    password = "";
    rePassword = "";
    vcode = "";
    qq = "";


  ngOnInit() {
    this.routerInfo.params.subscribe(info => {
      this.code = info["id"];
    });
    this.username = "";
  }

  getCodeZC() {
      let params = {
        username: this.username,
      };
      this.http.postRx(`/api/captcha/getCaptchaCode`, params).subscribe(data => {
        $(".codeeR").html(data.vcode);
      });
  }

  register() {
    let params = {
      code: this.code,
      username: this.username,
      password: this.password,
      rePassword: this.rePassword,
      vcode: this.vcode,
      qq: this.qq
    };
    this.http.postRxNormal(`/api/Users/register`, params).subscribe(data => {
      if (data["errormsg"] == null) {
        this.router.navigateByUrl("/login");
      }
    });
  }

}
