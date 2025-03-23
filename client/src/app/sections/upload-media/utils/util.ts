export async function generateCoverVideo(
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
