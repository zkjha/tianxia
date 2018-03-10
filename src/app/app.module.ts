import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


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
    LoginAfterComponent
  ],
  imports: [
    BrowserModule,
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
            path: 'GameBetPage/Ssc',
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
