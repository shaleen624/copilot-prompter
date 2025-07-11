import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { CopilotTemplate, CopilotTemplateSection, COPILOT_TEMPLATE_CATEGORIES, COPILOT_TEMPLATE_LANGUAGES, COPILOT_TEMPLATE_FRAMEWORKS } from '../../models/copilot-template.model';
import { CopilotTemplateService } from '../../services/copilot-template.service';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-template-builder',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatDividerModule
  ],
  standalone: true,
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private templateService = inject(CopilotTemplateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  templateForm: FormGroup;
  builderForm: FormGroup;
  isEditMode = false;
  tags: string[] = [];
  generatedContent = '';
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  categories = COPILOT_TEMPLATE_CATEGORIES;
  languages = COPILOT_TEMPLATE_LANGUAGES;
  frameworks = COPILOT_TEMPLATE_FRAMEWORKS;

  // Predefined suggestions
  codingStandardsSuggestions = [
    'Use TypeScript strict mode',
    'Follow ESLint rules',
    'Use meaningful variable names',
    'Implement proper error handling',
    'Write unit tests for all functions',
    'Use async/await over callbacks',
    'Follow SOLID principles',
    'Use proper code formatting'
  ];

  architectureGuidelines = [
    'Follow single responsibility principle',
    'Use dependency injection',
    'Implement proper separation of concerns',
    'Use design patterns appropriately',
    'Keep components small and focused',
    'Use composition over inheritance',
    'Implement proper data flow',
    'Use proper state management'
  ];

  frameworkRulesSuggestions = [
    'Use framework best practices',
    'Follow official style guides',
    'Use framework-specific patterns',
    'Implement proper lifecycle management',
    'Use framework testing utilities',
    'Follow framework conventions',
    'Use official libraries when possible',
    'Implement proper security practices'
  ];

  testingPreferencesSuggestions = [
    'Write unit tests for all components',
    'Use integration tests for critical flows',
    'Mock external dependencies',
    'Aim for 80%+ code coverage',
    'Use descriptive test names',
    'Follow AAA pattern (Arrange, Act, Assert)',
    'Test edge cases and error scenarios',
    'Use test-driven development when appropriate'
  ];

  // Track by functions
  trackByCategory = (index: number, category: string): string => category;
  trackByLanguage = (index: number, language: string): string => language;
  trackByFramework = (index: number, framework: string): string => framework;
  trackByTag = (index: number, tag: string): string => tag;

  constructor() {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      language: ['', Validators.required],
      framework: [''],
      author: ['', Validators.required]
    });

    this.builderForm = this.fb.group({
      projectContext: [''],
      codingStandards: this.fb.array([]),
      architectureGuidelines: this.fb.array([]),
      frameworkRules: this.fb.array([]),
      fileStructure: [''],
      testingPreferences: this.fb.array([]),
      customSections: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadTemplate(id);
    } else {
      // Add example tags for new templates
      this.tags = ['copilot-instructions', 'best-practices'];
    }
  }

  get codingStandards(): FormArray {
    return this.builderForm.get('codingStandards') as FormArray;
  }

  get architectureGuidelinesArray(): FormArray {
    return this.builderForm.get('architectureGuidelines') as FormArray;
  }

  get frameworkRules(): FormArray {
    return this.builderForm.get('frameworkRules') as FormArray;
  }

  get testingPreferences(): FormArray {
    return this.builderForm.get('testingPreferences') as FormArray;
  }

  get customSections(): FormArray {
    return this.builderForm.get('customSections') as FormArray;
  }

  loadTemplate(id: string): void {
    this.templateService.getTemplate(id).subscribe(template => {
      this.templateForm.patchValue({
        name: template.name,
        description: template.description,
        category: template.category,
        language: template.language,
        framework: template.framework,
        author: template.author
      });
      this.tags = [...template.tags];
      this.generatedContent = template.content;
    });
  }

  addToArray(arrayName: string, value: string): void {
    if (value.trim()) {
      const array = this.builderForm.get(arrayName) as FormArray;
      array.push(new FormControl(value.trim()));
    }
  }

  removeFromArray(arrayName: string, index: number): void {
    const array = this.builderForm.get(arrayName) as FormArray;
    array.removeAt(index);
  }

  addCustomSection(): void {
    const section = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      order: [this.customSections.length]
    });
    this.customSections.push(section);
  }

  removeCustomSection(index: number): void {
    this.customSections.removeAt(index);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  generateTemplate(): void {
    const builderData = {
      projectContext: this.builderForm.get('projectContext')?.value || '',
      codingStandards: this.codingStandards.value || [],
      architectureGuidelines: this.architectureGuidelinesArray.value || [],
      frameworkRules: this.frameworkRules.value || [],
      fileStructure: this.builderForm.get('fileStructure')?.value || '',
      testingPreferences: this.testingPreferences.value || [],
      customSections: this.customSections.value || []
    };

    this.generatedContent = this.templateService.buildTemplateFromForm(builderData);
  }

  previewTemplate(): void {
    this.generateTemplate();
    // You could open a dialog here to show the preview
  }

  goBack(): void {
    this.router.navigate(['/templates']);
  }

  onSubmit(): void {
    if (this.templateForm.valid) {
      this.generateTemplate();

      const template: CopilotTemplate = {
        ...this.templateForm.value,
        content: this.generatedContent,
        tags: this.tags,
        popularity: 0,
        lastUpdated: new Date(),
        id: this.isEditMode ? this.route.snapshot.paramMap.get('id')! : crypto.randomUUID()
      };

      if (this.isEditMode) {
        this.templateService.updateTemplate(template).subscribe({
          next: () => {
            this.snackBar.open('Template updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/templates']);
          },
          error: () => {
            this.snackBar.open('Error updating template', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.templateService.addTemplate(template).subscribe({
          next: () => {
            this.snackBar.open('Template created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/templates']);
          },
          error: () => {
            this.snackBar.open('Error creating template', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  copyTemplate(): void {
    if (this.generatedContent) {
      navigator.clipboard.writeText(this.generatedContent).then(() => {
        this.snackBar.open('Template copied to clipboard!', 'Close', { duration: 2000 });
      });
    }
  }

  downloadTemplate(): void {
    if (this.generatedContent && this.templateForm.get('name')?.value) {
      const blob = new Blob([this.generatedContent], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.templateForm.get('name')?.value.replace(/\s+/g, '-').toLowerCase()}-copilot-instructions.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.snackBar.open('Template downloaded!', 'Close', { duration: 2000 });
    }
  }
}
