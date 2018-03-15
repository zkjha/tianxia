import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

  store = window.sessionStorage;


  setStorage(value: any, key: string) {
    try {

      value = JSON.stringify(value);
    } catch (e) {

      // console.error(e);
      value = value;
    }

    this.store.setItem(key, value);

  }


  getStorage(key: string) {
    let value = this.store.getItem(key);
    if (value) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // console.error(e);
        value = value;
      }
    }
    return value;
  }


  remove(key) {
    this.store.removeItem(key);
  }

  clear() {
    this.store.clear();
  }
}
