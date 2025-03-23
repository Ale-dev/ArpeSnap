import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';

import { FileDragDropDirective } from '@app/core/directives/file-drag-drop.directive';
import { ImagePreloadDirective } from '@app/core/directives/image-preload.directive';
import { VideoStorageService } from '@app/core/service/video-upload-storage.service';
import { VideoItems } from '@app/shared/models/model';
import { Subscription } from 'rxjs';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { asideLinks, SHOW_ELEMENT } from './constants/sidebarConfig';
import { AsideItem, CardVideo } from './side-bar.model';
import { generateCoverVideo } from './utils/util';

@Component({
  selector: 'app-upload-media',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    FormsModule,
    ReactiveFormsModule,
    ThemeSwitcherComponent,
    ImagePreloadDirective,
    FileDragDropDirective,
  ],
  templateUrl: './upload-media.component.html',
  styleUrl: './upload-media.component.css',
})
export class UploadMediaComponent {
  asideItems: AsideItem[] = asideLinks;
  actions = SHOW_ELEMENT;
  currentSidebarView = '';
  shouldShowAsideBar = false;
  selectedItem!: VideoItems;
  listVideos: VideoItems[] = [];
  cardVideos: CardVideo[] = [];
  videoServiceSubscription: Subscription | undefined;

  constructor(
    private renderer: Renderer2,
    private videoService: VideoStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleActiveSideBarView(currentItem: AsideItem, action: string): void {
    this.shouldShowAsideBar = !currentItem.isActive;
    this.asideItems.forEach((item) => (item.isActive = false));
    currentItem.isActive = this.shouldShowAsideBar;
    this.currentSidebarView = action;
  }

  async onUploadFile(event: Event) {
    try {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!file.type.startsWith('video/')) {
        console.error('The file is not a valid video type');
        return;
      }

      await this.addVideo(file);
      this.displayImages();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async onDragAndDropFileDrop(file: File) {
    try {
      if (!file.type.startsWith('video/')) {
        console.error('The file is not a valid video type');
        return;
      }
      await this.addVideo(file);
      this.displayImages();
    } catch (error) {
      console.error('Error during drag-and-drop file upload:', error);
    }
  }

  async addVideo(file: File) {
    const video: HTMLVideoElement = this.renderer.createElement('video');
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');

    try {
      const videoDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
      const blob = await generateCoverVideo(video, canvas, file);
      let thumbnail = new File([blob], file.name, { type: blob.type });

      const videoItem: VideoItems = {
        videoFile: file,
        videoCover: thumbnail,
        uploadedAt: videoDate,
        videoDuration: video.duration,
      };
      this.videoService.addVideo(videoItem);
    } catch (error) {
      console.log('Error during file upload: ', error);
    }
  }

  displayImages() {
    const videos = this.listVideos;
    this.cardVideos = this.loadImageUrls(videos);
  }

  loadImageUrls(videos: VideoItems[]): CardVideo[] {
    return videos.map((video) => {
      const imageUrl = URL.createObjectURL(video.videoCover);
      return {
        coverVideo: imageUrl,
        name: video.videoCover.name,
      };
    });
  }

  setSelectedVideo(index: number): void {
    const videos = this.listVideos;
    const selectedVideo = videos[index];
    this.selectedItem = selectedVideo;
    this.videoService.setVideo(selectedVideo);
  }

  ngOnInit() {
    this.videoServiceSubscription = this.videoService.video.subscribe(() => {
      this.listVideos = this.videoService.getVideos();
    });
  }
  ngOnDestroy() {
    this.videoServiceSubscription?.unsubscribe();
  }
}
