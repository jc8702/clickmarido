import { ImageAnalysis, FaceData, CameraMotion } from '@/types';

export class ImageAnalyzer {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  async analyze(imageBase64: string, mimeType: string): Promise<ImageAnalysis> {
    const prompt = `Analyze this image for professional video production. Return ONLY valid JSON without markdown formatting.

{
  "sceneType": "portrait" | "landscape" | "product" | "indoor" | "outdoor" | "action",
  "description": "brief English description of what is visible",
  "objects": ["list", "of", "visible", "objects"],
  "faceDetected": true | false,
  "faceData": {
    "confidence": 0.0-1.0,
    "expression": "neutral" | "happy" | "serious" | "professional" | "unknown",
    "boundingBox": { "x": 0, "y": 0, "width": 0, "height": 0 }
  },
  "depthEstimate": 0.0-1.0,
  "suggestedPrompt": "detailed cinematic video generation prompt in English describing camera movement and desired animation",
  "suggestedCameraMotion": "push_in" | "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "pan_up" | "pan_down" | "parallax" | "none",
  "motionIntensity": 0.0-1.0
}

Rules:
- If a human face is visible, set faceDetected: true with confidence score
- For portraits/professionals, suggest push_in or zoom_in with low intensity
- For landscapes/exteriors, suggest pan or parallax
- The suggestedPrompt must be in English, optimized for Veo/Kling AI video generators
- Include cinematic quality keywords in the prompt`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: imageBase64 } }
            ]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Gemini API error (${response.status}): ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);

    const faceData: FaceData = {
      detected: result.faceDetected || false,
      confidence: result.faceData?.confidence || 0,
      expression: result.faceData?.expression,
      boundingBox: result.faceData?.boundingBox,
    };

    const cameraMotion: CameraMotion = {
      type: result.suggestedCameraMotion || 'push_in',
      intensity: result.motionIntensity || 0.08,
    };

    return {
      sceneType: result.sceneType || 'portrait',
      description: result.description || '',
      objects: result.objects || [],
      faceData,
      depthEstimate: result.depthEstimate || 0.3,
      suggestedMotion: cameraMotion,
      suggestedPrompt: result.suggestedPrompt || '',
    };
  }

  async analyzeFromUrl(imageUrl: string): Promise<ImageAnalysis> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64 = await this.blobToBase64(blob);
    const mimeType = blob.type || 'image/jpeg';
    return this.analyze(base64, mimeType);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
