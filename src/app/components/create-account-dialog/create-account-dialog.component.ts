import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-create-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Crear nuevo usuario</h2>
    <mat-dialog-content>
      <p>¿Desea crear un nuevo usuario con el correo {{ data.email }}?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">Crear</button>
    </mat-dialog-actions>
  `
})
export class CreateAccountDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 