import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../../../services/task.service';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{isNewTask ? 'Nueva Tarea' : 'Editar Tarea'}}</h2>
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" required [maxlength]="data.maxLength?.title || 40">
          <mat-hint align="end">{{taskForm.get('title')?.value?.length || 0}}/{{data.maxLength?.title || 40}}</mat-hint>
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            El título es requerido
          </mat-error>
          <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
            El título no puede exceder {{data.maxLength?.title || 40}} caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3" required [maxlength]="data.maxLength?.description || 40"></textarea>
          <mat-hint align="end">{{taskForm.get('description')?.value?.length || 0}}/{{data.maxLength?.description || 40}}</mat-hint>
          <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
            La descripción es requerida
          </mat-error>
          <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
            La descripción no puede exceder {{data.maxLength?.description || 40}} caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="pending">Pendiente</mat-option>
            <mat-option value="completed">Completada</mat-option>
          </mat-select>
          <mat-error *ngIf="taskForm.get('status')?.hasError('required')">
            El estado es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prioridad</mat-label>
          <mat-select formControlName="priority" required>
            <mat-option value="low">Baja</mat-option>
            <mat-option value="medium">Media</mat-option>
            <mat-option value="high">Alta</mat-option>
          </mat-select>
          <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
            La prioridad es requerida
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onNoClick()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
          Guardar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      padding-top: 20px;
      min-width: 400px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    mat-dialog-actions {
      padding: 1rem;
    }
  `]
})
export class EditTaskDialogComponent {
  taskForm: FormGroup;
  isNewTask: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Task> & { maxLength?: { title: number; description: number } }
  ) {
    this.isNewTask = !data.id;
    this.taskForm = this.fb.group({
      title: [data.title || '', [
        Validators.required,
        Validators.maxLength(data.maxLength?.title || 40)
      ]],
      description: [data.description || '', [
        Validators.required,
        Validators.maxLength(data.maxLength?.description || 40)
      ]],
      status: [data.status || 'pending', Validators.required],
      priority: [data.priority || 'medium', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask = {
        ...this.data,
        ...this.taskForm.value
      };
      this.dialogRef.close(updatedTask);
    }
  }
} 