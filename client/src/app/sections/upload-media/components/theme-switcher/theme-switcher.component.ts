import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingAppService } from '@app/core/service/setting-app.service';
import { SettingApp } from '@app/shared/models/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  imports: [ReactiveFormsModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent {
  form!: FormGroup;
  themeSettings!: SettingApp;
  private subscription!: Subscription;

  constructor(
    private settingService: SettingAppService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const currentTheme = this.settingService.getSetting();
    this.changeThemeSetting(currentTheme);

    this.form = new FormGroup({
      theme: new FormControl(currentTheme.theme),
    });
    this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((theme) => {
      this.changeThemeSetting(theme);
    });
  }

  changeThemeSetting(setting: SettingApp) {
    this.renderer.setAttribute(document.body, 'data-theme', setting.theme);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
