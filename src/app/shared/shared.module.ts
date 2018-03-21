import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {SideNavComponent} from './side-nav/side-nav.component';
import {QRCodeModule} from "angularx-qrcode";
import {StrLengthPipe} from "./pip/strLength.pip";
import {PaginationComponent} from "./pagination/pagination.component";
import { TimeComponent } from './time/time.component';

/**
 * 共享的模块和组建写入这里
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    QRCodeModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    SideNavComponent,
    QRCodeModule,
    StrLengthPipe,
    TimeComponent,
    PaginationComponent
  ],
  declarations: [
    SideNavComponent,
    StrLengthPipe,
    TimeComponent,
    PaginationComponent,
  ]
})
export class SharedModule { }
