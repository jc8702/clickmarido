import { ImageAnalysis } from '@/types';

export class PromptGenerator {
  private motionSuffixes: Record<string, string> = {
    push_in: 'gentle cinematic camera push-in, shallow depth of field, realistic',
    zoom_in: 'slow cinematic zoom in, detailed textures, natural lighting, photorealistic',
    zoom_out: 'smooth camera zoom out, establishing shot, wide angle, cinematic',
    pan_left: 'smooth horizontal camera pan left, parallax effect, cinematic movement',
    pan_right: 'smooth horizontal camera pan right, parallax effect, cinematic movement',
    pan_up: 'gentle camera tilt up, revealing context, cinematic',
    pan_down: 'gentle camera tilt down, establishing perspective, cinematic',
    parallax: 'parallax depth effect with foreground and background separation, cinematic 3D depth',
    none: 'static shot, professional composition, cinematic framing',
  };

  generateAnimationPrompt(analysis: ImageAnalysis): string {
    const basePrompt = analysis.suggestedPrompt;
    const motion = this.motionSuffixes[analysis.suggestedMotion.type] || this.motionSuffixes.push_in;

    let faceComponent = '';
    if (analysis.faceData.detected && analysis.faceData.confidence > 0.5) {
      faceComponent = 'natural facial micro-movements, subtle head turn, realistic eye blinking, natural expression';
    }

    let sceneComponent = '';
    switch (analysis.sceneType) {
      case 'portrait':
        sceneComponent = 'professional headshot quality, studio lighting, clean background';
        break;
      case 'landscape':
        sceneComponent = 'breathtaking scenery, atmospheric depth, natural color grading';
        break;
      case 'product':
        sceneComponent = 'product photography quality, sharp details, commercial lighting';
        break;
      case 'indoor':
        sceneComponent = 'warm interior lighting, cozy atmosphere, realistic shadows';
        break;
      case 'outdoor':
        sceneComponent = 'natural sunlight, vibrant colors, environmental depth';
        break;
    }

    const elements = [
      basePrompt,
      motion,
      faceComponent,
      sceneComponent,
      '8k resolution, highly detailed, photorealistic, commercial quality',
      'cinematic color grading, no text, no watermark',
    ];

    return elements.filter(Boolean).join(', ');
  }

  generateNegativePrompt(analysis: ImageAnalysis): string {
    const negatives = [
      'blurry',
      'low quality',
      'CGI',
      '3D render',
      'cartoon',
      'deformed hands',
      'distorted face',
      'text',
      'watermark',
      'logo',
      'overexposed',
      'underexposed',
      'jittery',
      'artifacts',
    ];

    if (analysis.faceData.detected) {
      negatives.push(
        'robotic movement',
        'unnatural expression',
        'dead eyes',
        'stiff movement',
      );
    }

    return negatives.join(', ');
  }
}
