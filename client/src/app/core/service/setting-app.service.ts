import { Injectable } from '@angular/core';

import { SettingApp } from '@app/shared/models/model';
import { INITIAL_SETTINGS } from '../../shared/const/initial-settings';

@Injectable({
  providedIn: 'root',
})
export class SettingAppService {
  constructor() {}

  getSetting(): SettingApp {
    const value = localStorage.getItem('data');
    if (value == null) {
      return INITIAL_SETTINGS;
    }
    return JSON.parse(value);
  }

  private _setSetting(item: SettingApp) {
    localStorage.setItem('data', JSON.stringify(item));
  }

  changeTheme(newTheme: SettingApp) {
    const config = this.settingToUpdate(newTheme);
    this._setSetting(config);
  }

  private settingToUpdate(newConfig: SettingApp) {
    return {
      ...this.getSetting(),
      ...newConfig,
    };
  }
}
