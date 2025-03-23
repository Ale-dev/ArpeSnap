import { Injectable } from '@angular/core';
import { VideoItems } from '@app/shared/models/model';
import { BehaviorSubject } from 'rxjs';

type SortVideoBy = 'uploadedAt' | 'videoName' | 'videoDuration';

@Injectable({
  providedIn: 'root',
})
export class VideoStorageService {
  private videoSubject = new BehaviorSubject<VideoItems | null>(null);
  readonly video = this.videoSubject.asObservable();
  private videoList: VideoItems[] = [];

  constructor() {}

  getVideos(): VideoItems[] {
    return this.videoList;
  }

  setVideo(videoItem: VideoItems): void {
    this.videoSubject.next(videoItem);
  }

  addVideo(videoItem: VideoItems) {
    this.videoList.push(videoItem);
    this.setVideo(videoItem);
  }

  getVideoByCondition(sortBy: SortVideoBy) {}
}
