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
    username = '';
    password = '';
    rePassword = '';
    vcode = '';
  ngOnInit() {
  }
  getCodeZC() {
    console.log($('input[name=username]').val());
    // if ($('input[name=username]').val() === '') {
    //   $("input[name=username]").focus();
    // } else {
      let params = {
        username: this.username,
      };
      this.http.postRx(`/api/captcha/getCaptchaCode`, params).subscribe(data => {
        $(".codeeR").html(data.vcode);
      });
    }
  // }

}
