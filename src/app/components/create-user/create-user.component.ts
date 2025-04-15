import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Validador personalizado para fecha futura y edad mínima
function dateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(control.value);
  
  // Verificar fecha futura
  if (inputDate > today) {
    return { futureDate: true };
  }

  // Verificar edad mínima (18 años)
  let age = today.getFullYear() - inputDate.getFullYear();
  const monthDiff = today.getMonth() - inputDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { minAge: true };
  }

  return null;
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="create-user-container">
      <div class="logo-container">
        <img src="/assets/logo-atom-chat.png" alt="Atom Logo" class="logo">
      </div>
      <mat-card class="create-user-card">
        <mat-card-header>
          <mat-card-title>Crear Usuario</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="create-user-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput formControlName="userId" type="email" readonly>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="userForm.get('name')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastName" required>
              <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
                El apellido es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha de nacimiento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dateBirth" required [max]="maxDate">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-hint>Debes tener al menos 18 años para registrarte</mat-hint>
              <mat-error *ngIf="userForm.get('dateBirth')?.hasError('required')">
                La fecha de nacimiento es requerida
              </mat-error>
              <mat-error *ngIf="userForm.get('dateBirth')?.hasError('futureDate')">
                La fecha de nacimiento no puede ser futura
              </mat-error>
              <mat-error *ngIf="userForm.get('dateBirth')?.hasError('minAge')">
                Debes ser mayor de 18 años para registrarte
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-button color="primary" type="button" (click)="goToLogin()">
                Volver al Login
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
                Crear Usuario
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-user-container {
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

    .create-user-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    .create-user-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
  `]
})
export class CreateUserComponent {
  userForm: FormGroup;
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Calcular la fecha máxima (18 años atrás desde hoy)
    this.maxDate = new Date();
    const minYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(minYear);

    this.userForm = this.fb.group({
      userId: [''],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dateBirth: ['', [Validators.required, dateValidator]]
    });

    const email = this.authService.getStoredEmail();
    if (email) {
      this.userForm.patchValue({ userId: email });
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData = {
        userId: formValue.userId,
        name: formValue.name,
        lastName: formValue.lastName,
        dateBirth: this.formatDate(formValue.dateBirth)
      };

      this.authService.createUser(userData).subscribe({
        next: () => {
          this.authService.navigateToTasks();
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 