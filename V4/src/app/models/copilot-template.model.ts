export interface CopilotTemplate {
  id: string;
  name: string;
  category: string;
  language: string;
  framework?: string;
  description: string;
  content: string;
  tags: string[];
  popularity: number;
  lastUpdated: Date;
  author: string;
}

export interface CopilotTemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface CopilotTemplateBuilder {
  projectContext: string;
  codingStandards: string[];
  architectureGuidelines: string[];
  frameworkRules: string[];
  fileStructure: string;
  testingPreferences: string[];
  customSections: CopilotTemplateSection[];
}

export const COPILOT_TEMPLATE_CATEGORIES: string[] = [
  'Frontend Framework',
  'Backend Framework',
  'Programming Language',
  'Mobile Framework',
  'Cloud Platform',
  'Database',
  'DevOps',
  'Testing Framework'
];

export const COPILOT_TEMPLATE_LANGUAGES: string[] = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Dart',
  'Swift',
  'Kotlin',
  'Rust',
  'Any'
];

export const COPILOT_TEMPLATE_FRAMEWORKS: string[] = [
  'Angular',
  'React',
  'Vue.js',
  'Svelte',
  'Spring Boot',
  'Express.js',
  'FastAPI',
  'Django',
  'Flutter',
  'React Native',
  'Next.js',
  'Nuxt.js',
  'Gin',
  'Nest.js',
  'ASP.NET Core'
];
