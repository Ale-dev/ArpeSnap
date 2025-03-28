import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsVideoComponent } from './settings-video.component';

describe('SettingsVideoComponent', () => {
  let component: SettingsVideoComponent;
  let fixture: ComponentFixture<SettingsVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
