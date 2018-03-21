import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/Rx";
import { HttpServiceInterface } from "./http-service-interface";
import { StorageService } from "./storage.service";

/**
 * @description 定义全局接口，封装http服务，封装agnualr原生HttpClient类
 * @date 2017-9-15
 * @author admin
 */
@Injectable()
export class HttpService implements HttpServiceInterface {
  // 注入httpClient
  constructor(
    private httpClient: HttpClient,
    private storage: StorageService
  ) {}

  upload(
    url: string,
    $event,
    data: (data: any) => void,
    error: (error: any) => void,
    fileKey: string,
    ...obj: any[]
  ): void {
    const files = $event.target.files || $event.srcElement.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(fileKey, files[i]);
    }
    if (obj) {
      // console.log(JSON.stringify(obj));
      for (let i = 0; i < obj.length; i++) {
        // console.log(JSON.stringify(obj[i]));
        // 这里拼接对象
        // formData.append("obj", obj[i].value);
      }
    }
    // console.log("files", files)
    // console.log("formData", formData)
    this.httpClient.post(url, formData).subscribe(data, error);
  }

  /**
   * @description post请求,失败后自动重新请求，默认重试3次
   * @param {string} url
   * @param {any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @param {number} retry
   */
  postRetry(
    url: string,
    body: any | any,
    data: (data: any) => void,
    error: (error: any) => void,
    retry: number
  ): void {
    this.httpClient
      .post(url, body)
      .retry(retry)
      .subscribe(data, error);
  }

  /**
   * @description post请求
   * @param {string} url
   * @param {any | any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   */
  post(
    url?: string,
    body?: any | null,
    data?: (data: any) => void,
    error?: (error: any) => void
  ): void {
    this.httpClient.post(url, body).subscribe(data, error);
  }

  /**
   * @description get请求
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @return void
   */
  public get(
    url: string,
    data: (data: any) => void,
    error: (error: any) => void
  ): void {
    this.httpClient.get(url).subscribe(data, error);
  }

  /**
   * @description get请求,失败后自动重新请求，默认重试3次
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @param {number} retry
   */
  getRetry(
    url: string,
    data: (data: any) => void,
    error: (error: any) => void,
    retry: number
  ): void {
    if (!retry) {
      retry = 3; // 默认值为3
    }
    this.httpClient
      .get(url)
      .retry(retry)
      .subscribe(data, error);
  }

  /**
   * @description post 请求 返回rxjs流
   * @param {string} url
   * @param {string} body
   * @param {boolean} isUserId 是否需要userid
   */
  postRx(
    url?: string,
    body: any = {},
    isUserId: Boolean = true
  ): Observable<any> {

    if (isUserId) {
      this.storage.setStorage("05099AF3B8D4A694E967D630889143F3", "user_id");
      body["user_id"] = this.storage.getStorage("user_id");
    }
    return this.httpClient.post(url, body).pluck("result");
  }

  /**
   * @description post 请求 返回rxjs流
   * @param {string} url
   * @param {string} body
   * @param {boolean} isUserId 是否需要userid
   */
  postRxNormal(
    url?: string,
    body: any = {},
    isUserId: Boolean = true
  ): Observable<any> {
    if (isUserId) {
      body["user_id"] = this.storage.getStorage("user_id");
    }
    return this.httpClient.post(url, body);
  }
  getRxNormal(
    url: string,
  ) {
    return this.httpClient.get(url);
  }
}
