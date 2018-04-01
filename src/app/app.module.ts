import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgZorroAntdModule} from 'ng-zorro-antd';
import {QRCodeModule} from 'angularx-qrcode';
import {ClipboardModule} from 'ngx-clipboard';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpService} from './service/http-service.service';
import {LoadingService} from './service/loading.service';
import {CookieService} from './service/cookie.service';
import {FormsModule} from '@angular/forms';
import {StorageService} from './service/storage.service';
import {PlayService} from './ssc/play-service/play.service';
import {PublicMethodService} from './ssc/play-service/public-method.service';
import {StoreDataService} from './service/store-data.service';
import {AuthInterceptor} from './auto-intercepter';

import {AppComponent} from './app.component';
import {CaipiaoComponent} from './caipiao/caipiao.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './register/register.component';
import {ZhenrenComponent} from './zhenren/zhenren.component';
import {DianziComponent} from './dianzi/dianzi.component';
import {DojiComponent} from './doji/doji.component';
import {TiyuComponent} from './tiyu/tiyu.component';
import {YouhuiComponent} from './youhui/youhui.component';
import {SscComponent} from './ssc/ssc.component';
import {LoginAfterComponent} from './login-after/login-after.component';
import {SscHeaderComponent} from './ssc/ssc-header/ssc-header.component';
import {SscLeftComponent} from './ssc/ssc-left/ssc-left.component';
import {PlayTimeComponent} from './ssc/play-time/play-time.component';
import {SscDetailComponent} from './ssc/ssc-detail/ssc-detail.component';
import {SscSelectComponent} from './ssc/ssc-select/ssc-select.component';
import {BettingDjangoComponent} from './ssc/django/betting-django/betting-django.component';
import {LotteryHistoryDjangoComponent} from './ssc/django/lottery-history-django/lottery-history-django.component';
import {ChaseDjangoComponent} from './ssc/django/chase-django/chase-django.component';
import {HistoryDjangoComponent} from './ssc/django/history-django/history-django.component';
import {ChaseHistoryDjangoComponent} from './ssc/django/chase-history-django/chase-history-django.component';
import {PlayInfoComponent} from './ssc/play-info/play-info.component';
import {PlayHistoryComponent} from './ssc/play-history/play-history.component';


import {TransactionRecordComponent} from "./center/transaction-record/transaction-record.component";
import {FinanceComponent} from "./center/finance/finance.component";
import {ReportComponent} from "./center/report/report.component";
import {AccountComponent} from "./center/account/account.component";
import {ProxyComponent} from "./center/proxy/proxy.component";
import {MyInfoComponent} from "./center/account/my-info/my-info.component";
import {SecurityCenterComponent} from "./center/account/security-center/security-center.component";
import {UpdatePasswordComponent} from "./center/account/update-password/update-password.component";
import {DepositComponent} from "./center/finance/deposit/deposit.component";
import {AliPayComponent} from "./center/finance/deposit/ali-pay/ali-pay.component";
import {WithdrawalsComponent} from "./center/finance/withdrawals/withdrawals.component";
import {QcCodeComponent} from "./center/finance/deposit/qc-code/qc-code.component";
import {AccountCenterComponent} from "./center/proxy/account-center/account-center.component";
import {MemberListComponent} from "./center/proxy/member-list/member-list.component";
import {TeamStatisticsComponent} from "./center/proxy/team-statistics/team-statistics.component";
import {StatisticsTableComponent} from "./center/proxy/statistics-table/statistics-table.component";
import {LowerWaterComponent} from "./center/proxy/lower-water/lower-water.component";
import {PointsRecordComponent} from "./center/proxy/points-record/points-record.component";
import {RechargeRecordComponent} from "./center/proxy/recharge-record/recharge-record.component";
import {WithdrawRecordComponent} from "./center/proxy/withdraw-record/withdraw-record.component";
import {BettingComponent} from "./center/transaction-record/betting/betting.component";
import {ChaseNumberComponent} from "./center/transaction-record/chase-number/chase-number.component";
import {TurnoverComponent} from "./center/transaction-record/turnover/turnover.component";
import {RechargeComponent} from "./center/transaction-record/recharge/recharge.component";
import {IntegralComponent} from "./center/transaction-record/integral/integral.component";
import {WithdrawalsRepComponent} from "./center/transaction-record/withdrawals-rep/withdrawals-rep.component";
import {TrackZuihaoDjangoComponent} from "./center/transaction-record/chase-number/track-zuihao-django/track-zuihao-django.component";
import {LogInComponent} from "./center/proxy/log-in/log-in.component";
import {SystemInfoComponent} from "./center/account/my-news/system-info/system-info.component";
import {SystemPlacardComponent} from "./center/account/my-news/system-placard/system-placard.component";
import {UserTabComponent} from "./center/report/user-tab/user-tab.component";
import {BonusDetailsComponent} from "./center/account/bonus-details/bonus-details.component";
import {MonChangeComponent} from "./center/finance/mon-change/mon-change.component";
import {LightChargeComponent} from "./center/finance/light-charge/light-charge.component";
import {WeiChatComponent} from "./center/finance/wei-chat/wei-chat.component";
import {PeakChargeComponent} from "./center/finance/peak-charge/peak-charge.component";
import {QqPlayComponent} from "./center/finance/qq-play/qq-play.component";
import {ZfbPlayComponent} from "./center/finance/zfb-play/zfb-play.component";
import {MyNewsComponent} from "./center/account/my-news/my-news.component";
import {MyLoginInfoComponent} from "./center/account/my-login-info/my-login-info.component";
import {XiajiguanliComponent} from "./center/proxy/xiajiguanli/xiajiguanli.component";
import {UserChargeComponent} from "./center/finance/user-charge/user-charge.component";
import {ChartComponent} from "./center/chart/chart.component";
import {XiajitouzhuComponent} from './center/proxy/xiajitouzhu/xiajitouzhu.component';
import {FirstWithdrawComponent} from "./center/proxy/first-withdraw/first-withdraw.component";
import {LoadingComponent} from "./loading/loading.component";


import {TimeComponent} from "./shared/time/time.component";

import {LoginGuard} from "./guard/login.guard";
import {HeaderComponent} from './header/header.component';
import {MobHelpComponent} from "./mob-help/mob-help.component";
import {HomeHeaderComponent} from './home-header/home-header.component';
import {LineSelectionComponent} from "./line-selection/line-selection.component";
import {MobileAppComponent} from "./mobile-app/mobile-app.component";


@NgModule({
  declarations: [
    LotteryHistoryDjangoComponent,
    MobHelpComponent,
    AppComponent,
    LoginComponent,
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
    PlayTimeComponent,
    SscLeftComponent,
    SscDetailComponent,
    SscSelectComponent,
    PlayInfoComponent,
    PlayHistoryComponent,
    BettingDjangoComponent,
    ChaseDjangoComponent,
    HistoryDjangoComponent,
    ChaseHistoryDjangoComponent,
    TransactionRecordComponent,
    FinanceComponent,
    ReportComponent,
    AccountComponent,
    ProxyComponent,
    MyInfoComponent,
    SecurityCenterComponent,
    UpdatePasswordComponent,
    DepositComponent,
    AliPayComponent,
    WithdrawalsComponent,
    QcCodeComponent,
    AccountCenterComponent,
    MemberListComponent,
    TeamStatisticsComponent,
    StatisticsTableComponent,
    LowerWaterComponent,
    PointsRecordComponent,
    RechargeRecordComponent,
    WithdrawRecordComponent,
    BettingComponent,
    ChaseNumberComponent,
    TurnoverComponent,
    RechargeComponent,
    IntegralComponent,
    WithdrawalsRepComponent,
    TrackZuihaoDjangoComponent,
    LogInComponent,
    SystemInfoComponent,
    SystemPlacardComponent,
    UserTabComponent,
    BonusDetailsComponent,
    MonChangeComponent,
    LightChargeComponent,
    WeiChatComponent,
    PeakChargeComponent,
    QqPlayComponent,
    ZfbPlayComponent,
    MyNewsComponent,
    MyLoginInfoComponent,
    XiajiguanliComponent,
    UserChargeComponent,
    ChartComponent,
    XiajitouzhuComponent,
    FirstWithdrawComponent,
    TimeComponent,
    LoadingComponent,
    HeaderComponent,
    HomeHeaderComponent,
    LineSelectionComponent,
    MobileAppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    ClipboardModule,
    NgZorroAntdModule.forRoot(),
    QRCodeModule,
    RouterModule.forRoot([
        {
          path: 'home',
          component: HomeComponent,
          children: [
            {
              path: '',
              component: HomeComponent
            }
          ]
        },
        {
          path: 'login',
          component: LoginComponent
        },
        {
          path: 'help',
          component: MobHelpComponent
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
          ],
          canActivate: [LoginGuard]
        }, {
          path: 'Youhui',
          component: YouhuiComponent
        },
        {
          path: 'lineSelection',
          component: LineSelectionComponent
        },
        {
          path: 'mobile-app',
          component: MobileAppComponent
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
          redirectTo: '/login',
          pathMatch: 'full'
        }
      ]
      // , { useHash: false }
    )
  ],
  providers: [
    HttpService,
    LoadingService,
    CookieService,
    StorageService,
    PlayService,
    PublicMethodService,
    LoginGuard,
    StoreDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  entryComponents: [
    LoadingComponent,
    HistoryDjangoComponent,
    BettingDjangoComponent,
    ChaseDjangoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
