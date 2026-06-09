import { ProjectImage, Script, StoryboardItem } from '@/types';

interface VideoOptions {
  width: number;
  height: number;
  fps: number;
}

export class VideoGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: VideoOptions;

  constructor(options: Partial<VideoOptions> = {}) {
    this.options = {
      width: options.width || 1080,
      height: options.height || 1920,
      fps: options.fps || 30,
    };
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
  }

  async generate(
    images: ProjectImage[],
    script: Script,
    _storyboard: StoryboardItem[]
  ): Promise<Blob | null> {
    const stream = this.canvas.captureStream(this.options.fps);
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const done = new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
    });

    recorder.start();

    const scenes = [
      { text: script.hook, imageIdx: 0, duration: 5 },
      { text: script.scene1, imageIdx: 1 % Math.max(images.length, 1), duration: 5 },
      { text: script.scene2, imageIdx: 2 % Math.max(images.length, 1), duration: 5 },
      { text: script.scene3, imageIdx: 3 % Math.max(images.length, 1), duration: 5 },
      { text: script.cta, imageIdx: 4 % Math.max(images.length, 1), duration: 5 },
    ];

    const totalFrames = scenes.reduce((sum, s) => sum + s.duration * this.options.fps, 0);
    let frameIndex = 0;

    for (const scene of scenes) {
      const sceneFrames = scene.duration * this.options.fps;
      const img = images[scene.imageIdx];
      const imgEl = await this.loadImage(img?.dataUrl);

      for (let f = 0; f < sceneFrames; f++) {
        const progress = f / sceneFrames;
        this.drawFrame(imgEl, progress, scene.text);
        frameIndex++;
        const pct = Math.round((frameIndex / totalFrames) * 100);
        this.dispatchProgress(pct);
        await this.waitFrame();
      }
    }

    recorder.stop();
    return done;
  }

  private drawFrame(
    img: HTMLImageElement | null,
    progress: number,
    text: string
  ): void {
    const { width, height } = this.options;
    const ctx = this.ctx;

    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    if (img) {
      const scale = 1 + progress * 0.15;
      const offsetX = (width - img.width * scale) / 2 + Math.sin(progress * Math.PI * 2) * 20;
      const offsetY = (height - img.height * scale) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.clip();

      const aspect = img.width / img.height;
      const canvasAspect = width / height;
      let dx, dy, dw, dh;

      if (aspect > canvasAspect) {
        dh = height;
        dw = height * aspect;
        dx = (width - dw) / 2 + offsetX * 0.1;
        dy = 0;
      } else {
        dw = width;
        dh = width / aspect;
        dx = 0;
        dy = (height - dh) / 2 + offsetY * 0.1;
      }

      ctx.drawImage(img, dx, dy, dw, dh);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
    gradient.addColorStop(0, 'rgba(9,9,11,0)');
    gradient.addColorStop(1, 'rgba(9,9,11,0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxWidth = width * 0.85;
    const lines = this.wrapText(text, maxWidth);

    const lineHeight = 64;
    const startY = height * 0.7 - (lines.length - 1) * lineHeight / 2;

    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 12;

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Click Marido Marketing Studio', width / 2, height - 40);
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const ctx = this.ctx;
    ctx.font = 'bold 48px sans-serif';
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    if (lines.length === 0) lines.push(text);
    return lines;
  }

  private loadImage(dataUrl: string | undefined): Promise<HTMLImageElement | null> {
    if (!dataUrl) return Promise.resolve(null);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }

  private waitFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  private dispatchProgress(pct: number): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('video-gen-progress', { detail: pct })
      );
    }
  }
}
