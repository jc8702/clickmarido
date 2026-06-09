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

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  briefing: Briefing;
  script?: Script;
  storyboard?: StoryboardItem[];
  prompts?: VideoPromptItem[];
  caption?: Caption;
  status: 'draft' | 'generating' | 'completed' | 'failed';
}

export interface VideoTemplate {
  id: string;
  name: string;
  briefing: Briefing;
  description: string;
}
