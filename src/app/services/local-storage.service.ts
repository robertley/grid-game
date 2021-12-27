import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class LocalStorageService {
    
    private localStorage: Map<string, any> = new Map();

    constructor() {
        let browserStorage = window.localStorage.getItem("grid-gauntlet");
        if (browserStorage) {
          this.localStorage = JSON.parse(browserStorage, reviver);
        }
    }

    getLocalStorageItem(key: string) {
        return this.localStorage.get(key);
    }

    setLocalStorageItem(key: string, item: any) {
        this.localStorage.set(key, item);
        this.setBrowserStorage();
    }

    removeLocalStorageItem(key: string) {
        this.localStorage.delete(key);
        this.setBrowserStorage();
    }

    clearStorage() {
        this.localStorage.clear();
        this.setBrowserStorage();
    }

    setBrowserStorage() {
        let browserStorage = JSON.stringify(this.localStorage, replacer);
        window.localStorage.setItem("grid-gauntlet", browserStorage);
    }
}

// From https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
}