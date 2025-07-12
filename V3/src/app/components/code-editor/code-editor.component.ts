import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnInit, OnChanges {
  @Input() content: string = '';
  @Input() fileName: string = '';
  @Input() language: string = 'text';
  @Input() showEditButton: boolean = false;
  @Input() showCopyButton: boolean = true;
  @Input() placeholder: string = 'Enter content...';
  @Input() minRows: number = 5;
  @Input() maxRows: number = 20;
  @Input() isEditMode: boolean = false;
  @Input() editButtonLabel: string = 'Edit inline';

  @Output() contentChange = new EventEmitter<string>();
  @Output() editStart = new EventEmitter<void>();
  @Output() editSave = new EventEmitter<void>();
  @Output() editCancel = new EventEmitter<void>();
  @Output() copyToClipboard = new EventEmitter<void>();

  // Internal state
  private _isEditMode = signal(false);
  private _editableContent = signal('');

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this._isEditMode.set(this.isEditMode);
    this._editableContent.set(this.content);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isEditMode']) {
      this._isEditMode.set(this.isEditMode);
    }
    if (changes['content']) {
      this._editableContent.set(this.content);
    }
  }

  isEditModeActive(): boolean {
    return this._isEditMode();
  }

  editableContent(): string {
    return this._editableContent();
  }

  startEdit(): void {
    this._editableContent.set(this.content);
    this._isEditMode.set(true);
    this.editStart.emit();
  }

  cancelEdit(): void {
    this._isEditMode.set(false);
    this._editableContent.set('');
    this.editCancel.emit();
  }

  saveEdit(): void {
    if (this._editableContent()) {
      this.editSave.emit();
    }
  }

  onContentChange(newContent: string): void {
    this._editableContent.set(newContent);
    this.contentChange.emit(newContent);
  }

  copyContent(): void {
    navigator.clipboard.writeText(this.content).then(() => {
      this.snackBar.open('Content copied to clipboard', 'Close', { duration: 3000 });
    }).catch(() => {
      this.snackBar.open('Failed to copy content', 'Close', { duration: 3000 });
    });
    this.copyToClipboard.emit();
  }
}
