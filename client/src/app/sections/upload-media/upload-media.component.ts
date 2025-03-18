import { CommonModule, formatDate } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';

import { VideoStorageService } from '@app/core/service/video-upload-storage.service';
import { VideoItems } from '@app/shared/models/model';
import { Subscription } from 'rxjs';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { SHOW_ELEMENT, sidebarItems } from './constants/sidebarConfig';
import { sidebarItem } from './side-bar.model';

@Component({
  selector: 'app-upload-media',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    FormsModule,
    ReactiveFormsModule,
    ThemeSwitcherComponent,
  ],
  templateUrl: './upload-media.component.html',
  styleUrl: './upload-media.component.css',
})
export class UploadMediaComponent {
  sidebarItems = sidebarItems;
  actions = SHOW_ELEMENT;
  currentSidebarView = '';
  shouldShowAsideBar = false;
  selectedItem!: VideoItems;
  videoCoverUrls: string[] = [];
  listVideos: VideoItems[] = [];
  videoServiceSubscription: Subscription | undefined;

  constructor(
    private renderer: Renderer2,
    private videoService: VideoStorageService
  ) {}

  toggleActiveSideBarView(currentItem: sidebarItem, action: string): void {
    this.shouldShowAsideBar = !currentItem.isActive;
    this.sidebarItems.forEach((item) => (item.isActive = false));
    currentItem.isActive = this.shouldShowAsideBar;
    this.currentSidebarView = action;
  }

  async onUploadFile(event: Event) {
    try {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      await this.addVideo(file);
      this.displayImages();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async addVideo(file: File) {
    const video: HTMLVideoElement = this.renderer.createElement('video');
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');

    try {
      const videoDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
      const blob = await this.generateCoverVideo(video, canvas, file);
      let thumbnail = new File([blob], 'image', { type: blob.type });

      const videoItem: VideoItems = {
        file: file,
        videoCover: thumbnail,
        uploadedAt: videoDate,
        videoDuration: video.duration,
      };
      this.videoService.addVideo(videoItem);
      this.listVideos = this.videoService.getVideos();
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  displayImages() {
    const itemsVideo = this.listVideos;
    itemsVideo.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    this.videoCoverUrls = this.loadImageUrls(itemsVideo);
  }

  loadImageUrls(videos: VideoItems[]): string[] {
    return videos.map((video) => {
      const imageUrl = URL.createObjectURL(video.videoCover);
      this.preloadImage(imageUrl);
      return imageUrl;
    });
  }

  preloadImage(url: string): void {
    const img = new Image();
    img.src = url;
    img.onload = () => URL.revokeObjectURL(url);
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
  }

  async generateCoverVideo(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    file: File,
    seekTo = 1
  ): Promise<Blob> {
    video.autoplay = true;
    video.muted = true;

    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    return new Promise((resolve, reject) => {
      video.onerror = (err) => reject(new Error('Error loading video: ' + err));

      video.onloadeddata = () => {
        video.currentTime = seekTo;

        video.onseeked = () => {
          let ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas context is not available');

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          ctx.canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(videoUrl);
              if (blob) {
                resolve(blob);
              } else {
                reject('Blob could not be created');
              }
            },
            'image/png',
            0.7
          );
        };
      };
    });
  }

  setSelectedVideo(index: number): void {
    const videos = this.listVideos;
    const selectedVideo = videos[index];
    this.selectedItem = selectedVideo;
    this.videoService.setVideo(selectedVideo);
  }
}
