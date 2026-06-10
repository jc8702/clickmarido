export interface Briefing {
  companyName: string;
  segment: string;
  services: string[];
  targetAudience: string;
  differentials: string[];
  videoObjective: string;
  duration: 15 | 30 | 60;
}

export interface Script {
  hook: string;
  scene1: string;
  scene2: string;
  scene3: string;
  cta: string;
}

export interface StoryboardItem {
  scene: string;
  camera: string;
  environment: string;
  action: string;
  duration: string;
}

export interface VideoPromptItem {
  scene: string;
  prompt: string;
  negativePrompt: string;
}

export interface Caption {
  instagramCaption: string;
  whatsappCta: string;
  hashtags: string[];
}

export interface ProjectImage {
  id: string;
  dataUrl: string;
  name: string;
  scene?: string;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export type ProjectStatus = 'draft' | 'generating' | 'analyzing' | 'scripting' | 'generating_motion' | 'generating_audio' | 'lipsync' | 'rendering' | 'completed' | 'failed';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  briefing: Briefing;
  script?: Script;
  storyboard?: StoryboardItem[];
  prompts?: VideoPromptItem[];
  caption?: Caption;
  images?: ProjectImage[];
  video?: GeneratedVideo;
  status: ProjectStatus;
  timeline?: TimelineState;
  renderConfig?: RenderConfig;
  narration?: { audioUrl: string; durationMs: number; voiceId: string };
  captions?: CaptionCue[];
  captionsSrt?: string;
  captionsVtt?: string;
  totalCostCents?: number;
  userId?: string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  briefing: Briefing;
  description: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface CameraMotion {
  type: 'zoom_in' | 'zoom_out' | 'pan_left' | 'pan_right' |
        'pan_up' | 'pan_down' | 'parallax' | 'push_in' | 'none';
  intensity: number;
}

export interface FaceData {
  detected: boolean;
  boundingBox?: { x: number; y: number; width: number; height: number };
  landmarks?: { leftEye: Point; rightEye: Point; nose: Point; mouth: Point };
  expression?: string;
  confidence: number;
}

export interface ImageAnalysis {
  sceneType: 'portrait' | 'landscape' | 'product' | 'indoor' | 'outdoor' | 'action';
  description: string;
  objects: string[];
  faceData: FaceData;
  depthEstimate: number;
  suggestedMotion: CameraMotion;
  suggestedPrompt: string;
}

export interface MotionConfig {
  camera: CameraMotion;
  backgroundParallax: boolean;
  elementMovement: boolean;
  lightVariation: boolean;
}

export interface VideoGenerationRequest {
  imageUrl: string;
  imageAnalysis: ImageAnalysis;
  motionConfig: MotionConfig;
  audioUrl?: string;
  lipsyncEnabled: boolean;
  duration: number;
}

export interface VideoGenerationResult {
  url: string;
  duration: number;
  cost: number;
  provider: string;
  metadata: Record<string, unknown>;
}

export type JobStatusResponse =
  | { status: 'queued' }
  | { status: 'processing'; progress: number }
  | { status: 'completed'; result: VideoGenerationResult }
  | { status: 'failed'; error: string };

export interface VoiceConfig {
  gender: 'male' | 'female';
  style: 'young' | 'adult' | 'corporate' | 'institutional';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  provider: string;
  providerVoiceId: string;
  speed?: number;
  pitch?: number;
}

export interface VoicePreset {
  id: string;
  name: string;
  gender: 'male' | 'female';
  style: 'young' | 'adult' | 'corporate' | 'institutional';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  provider: string;
  providerVoiceId: string;
  previewUrl?: string;
}

export type TrackType = 'video' | 'audio' | 'narration' | 'music' | 'captions';

export interface TimelineTrack {
  id: string;
  type: TrackType;
  name: string;
  items: TimelineItem[];
  visible: boolean;
  locked: boolean;
}

export interface TimelineItem {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  sourceUrl: string;
  type: 'video_clip' | 'audio_clip' | 'narration_clip' | 'music_clip' | 'caption_overlay';
  thumbnailUrl?: string;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface TimelineState {
  tracks: TimelineTrack[];
  duration: number;
  fps: number;
  currentTime: number;
  isPlaying: boolean;
  zoom: number;
}

export interface CaptionCue {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
  words: { word: string; startMs: number; endMs: number }[];
}

export interface CaptionStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  highlightColor: string;
  backgroundColor: string;
  position: 'top' | 'bottom' | 'auto';
  highlightCurrentWord: boolean;
}

export interface RenderConfig {
  resolution: '1080p' | '1440p' | '4K';
  format: 'mp4' | 'mov' | 'webm';
  codec: 'h264' | 'h265';
  fps: 24 | 30 | 60;
  quality: 'standard' | 'high' | 'lossless';
}

export interface Phoneme {
  startMs: number;
  endMs: number;
  phoneme: string;
}

export interface LipSyncRequest {
  videoUrl: string;
  audioUrl: string;
  phonemes?: Phoneme[];
  faceBoundingBox?: { x: number; y: number; width: number; height: number };
}

export interface LipSyncResult {
  videoUrl: string;
  duration: number;
  cost: number;
  provider: string;
  metadata?: Record<string, unknown>;
}
