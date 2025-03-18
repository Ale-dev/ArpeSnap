import { Component, ElementRef, ViewChild } from "@angular/core";
import { VideoStorageService } from "@app/core/service/video-upload-storage.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-video-trimmer",
	standalone: true,
	imports: [],
	templateUrl: "./video-trimmer.component.html",
	styleUrl: "./video-trimmer.component.css",
})
export class VideoTrimmerComponent {
	@ViewChild("videoContainer", { static: false })
	videoContainer!: ElementRef;
	subscription!: Subscription;

	constructor(private videoService: VideoStorageService) {}

	ngOnInit() {
		this.subscription = this.videoService.video.subscribe((video) => {
			if (video) {
				if (this.videoContainer) {
					this.loadVideo(video.file);
				}
			}
		});
	}

	async loadVideo(file: File) {
		console.log(file);
		const videoUrl = URL.createObjectURL(file);
		const videoElement: HTMLVideoElement = this.videoContainer.nativeElement;
		videoElement.setAttribute("src", videoUrl);
		videoElement.oncanplaythrough = () => {
			URL.revokeObjectURL(videoUrl);
		};
		videoElement.load();
	}

	OnDestroy() {
		this.subscription.unsubscribe();
	}
}
