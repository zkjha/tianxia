import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpService} from './service/http-service.service';
import {LoadingService} from './service/loading.service';
import { CookieService } from './service/cookie.service';
import { FormsModule } from '@angular/forms';
import {StorageService} from './service/storage.service';
import {PlayService} from './ssc/play-service/play.service';
import {PublicMethodService} from './ssc/play-service/public-method.service';


import { AppComponent } from './app.component';
import { CaipiaoComponent } from './caipiao/caipiao.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ZhenrenComponent } from './zhenren/zhenren.component';
import { DianziComponent } from './dianzi/dianzi.component';
import { DojiComponent } from './doji/doji.component';
import { TiyuComponent } from './tiyu/tiyu.component';
import { YouhuiComponent } from './youhui/youhui.component';
import { SscComponent } from './ssc/ssc.component';
import { LoginAfterComponent } from './login-after/login-after.component';
import { SscHeaderComponent } from './ssc/ssc-header/ssc-header.component';
import { SscLeftComponent } from './ssc/ssc-left/ssc-left.component';
import { SscDetailComponent } from './ssc/ssc-detail/ssc-detail.component';
import { SscSelectComponent } from './ssc/ssc-select/ssc-select.component';
import { BettingDjangoComponent } from './ssc/django/betting-django/betting-django.component';
import { ChaseDjangoComponent } from './ssc/django/chase-django/chase-django.component';


@NgModule({
  declarations: [
    AppComponent,
    CaipiaoComponent,
    HomeComponent,
    RegisterComponent,
    ZhenrenComponent,
    DianziComponent,
    DojiComponent,
    TiyuComponent,
    YouhuiComponent,
    SscComponent,
    LoginAfterComponent,
    SscHeaderComponent,
    SscLeftComponent,
    SscDetailComponent,
    SscSelectComponent,
    BettingDjangoComponent,
    ChaseDjangoComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    NgZorroAntdModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'home' ,
        component: HomeComponent,
        children: [
          {
            path: '',
            component: HomeComponent
          }
        ]
      },
      {
        path: 'Caipiao',
        component: CaipiaoComponent
      }, {
        path: 'ZhenRen',
        component: ZhenrenComponent
      }, {
        path: 'DianZi',
        component: DianziComponent
      }, {
        path: 'Doji',
        component: DojiComponent
      }, {
        path: 'TiYu',
        component: TiyuComponent
      }, {
        path: 'GameBet',
        children: [
          {
            path: '',
            redirectTo: 'GameBetPage/Ssc/1',
            pathMatch: 'full'
          },
          {
            path: 'GameBetPage/Ssc/:id',
            component: SscComponent
          }
        ]
      }, {
        path: 'Youhui',
        component: YouhuiComponent
      },
      {
        path: 'Login',
        children: [
          {
            path: 'UserRegister',
            component: RegisterComponent
          }
        ]
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ])
  ],
  providers: [
    HttpService,
    LoadingService,
    CookieService,
    StorageService,
    PlayService,
    PublicMethodService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
