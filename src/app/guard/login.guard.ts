import { StorageService } from "../service/storage.service";
import { Injectable, Optional, SkipSelf } from "@angular/core";

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private shorage: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isLogin: boolean = this.shorage.getStorage("user_id") ? true : false;
    if (!isLogin) {
      this.router.navigate(["home"]);
      this.shorage.clear();
    }
    return isLogin;
  }
}
