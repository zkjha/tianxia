import { Component } from "@angular/core";
import { StoreDataService } from "../service/store-data.service";

@Component({
    selector: "app-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent {
    message: string;

    constructor(private storeDataService: StoreDataService) {
        this.message = this.storeDataService.obj;
    }
}
