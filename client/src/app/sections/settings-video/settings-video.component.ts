import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VideoStorageService } from '@app/core/service/video-upload-storage.service';
import { VideoItems } from '@app/shared/models/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-video',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-video.component.html',
  styleUrl: './settings-video.component.css',
})
export class SettingsVideoComponent {
  subscription!: Subscription;
  videoInfo: VideoItems[] = [];
  settingsVideoForm!: FormGroup;
  urlImage!: string;
  constructor(private videoService: VideoStorageService) {}

  ngOnInit() {
    this.subscription = this.videoService.video.subscribe((video) => {
      if (video) {
        this.videoInfo.push(video);
        this.addVideoControls(video);
        this.previewImage(video.videoCover);
      }
    });
  }

  addVideoControls(video: VideoItems) {
    this.settingsVideoForm = new FormGroup({
      videoName: new FormControl(video.videoFile.name.slice(0, 20), [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      videoDuration: new FormControl(
        { value: video.videoDuration, disabled: true },
        Validators.required
      ),
    });
  }

  changeImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.previewImage(file);
  }

  previewImage(videoCover: File) {
    this.urlImage = URL.createObjectURL(videoCover);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(this.urlImage);
    };
    img.src = this.urlImage;
  }

  downloadVideo() {
    if (!this.settingsVideoForm.invalid) {
      return;
    }

    console.log(this.settingsVideoForm.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
