import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { SettingsVideoComponent } from "./sections/settings-video/settings-video.component";
import { UploadMediaComponent } from "./sections/upload-media/upload-media.component";
import { VideoTrimmerComponent } from "./sections/video-trimmer/video-trimmer.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		RouterOutlet,
		UploadMediaComponent,
		VideoTrimmerComponent,
		SettingsVideoComponent,
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {
	title = "client";

	constructor() {}
}
