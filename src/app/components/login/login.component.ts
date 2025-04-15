import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="logo-container">
        <img src="assets/logo-atom-chat.png" alt="Atom Logo" class="logo">
      </div>
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                El correo electrónico es requerido
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Por favor ingrese un correo electrónico válido
              </mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" 
                    class="full-width" 
                    [disabled]="loginForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Continuar</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }

    .logo-container {
      margin-bottom: 2rem;
      text-align: center;
    }

    .logo {
      max-width: 150px;
      height: auto;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const email = this.loginForm.get('email')?.value;
      
      this.authService.checkUser(email).subscribe({
        next: (exists) => {
          this.loading = false;
          if (exists) {
            this.authService.navigateToTasks();
          } else {
            this.showCreateUserDialog();
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error checking user:', error);
        }
      });
    }
  }

  private showCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      data: { email: this.loginForm.get('email')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.navigateToCreateUser();
      }
    });
  }
}
