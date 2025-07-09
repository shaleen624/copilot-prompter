import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonSubmissionDialogComponent } from './json-submission-dialog.component';
import { Prompt } from '../../models/prompt.model';

describe('JsonSubmissionDialogComponent', () => {
  let component: JsonSubmissionDialogComponent;
  let fixture: ComponentFixture<JsonSubmissionDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<JsonSubmissionDialogComponent>>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockPrompt: Prompt = {
    id: '1',
    title: 'Test Prompt',
    description: 'Test Description',
    prompt: 'Test prompt content',
    category: 'Testing',
    language: 'TypeScript',
    author: 'Test Author',
    tags: ['test', 'angular']
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [JsonSubmissionDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { prompt: mockPrompt } },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JsonSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with JSON string', () => {
    expect(component.jsonString).toBe(JSON.stringify(mockPrompt, null, 2));
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should copy JSON to clipboard', async () => {
    const clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    
    await component.copyJson();
    
    expect(clipboardSpy).toHaveBeenCalledWith(component.jsonString);
    expect(mockSnackBar.open).toHaveBeenCalledWith('JSON copied to clipboard!', 'Close', { duration: 2000 });
  });

  it('should open SharePoint link and close dialog on submit', () => {
    const windowSpy = spyOn(window, 'open');
    
    component.onSubmit();
    
    expect(windowSpy).toHaveBeenCalledWith('https://sharepoint.company.com/prompts', '_blank');
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
