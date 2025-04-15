import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { DeleteTaskDialogComponent } from './delete-task-dialog/delete-task-dialog.component';
import { EditTaskDialogComponent } from './edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="tasks-container">
      <mat-card class="tasks-card">
        <mat-card-header>
          <div class="welcome-message">
            <h2>Bienvenido, {{userName}}</h2>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="addNewTask()" class="add-task-btn">
              <mat-icon>add</mat-icon>
              Nueva Tarea
            </button>
            <button mat-raised-button color="warn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              Cerrar Sesión
            </button>
          </div>
        </mat-card-header>
        <mat-divider></mat-divider>
        <mat-card-content>
          <ng-container *ngIf="tasks.length > 0; else noTasks">
            <div class="tasks-list">
              <div *ngFor="let task of tasks" class="task-item">
                <div class="task-header">
                  <h3>{{task.title}}</h3>
                  <div class="task-badges">
                    <mat-chip-set>
                      <mat-chip [class]="'status-' + task.status">
                        {{task.status === 'pending' ? 'Pendiente' : 'Completada'}}
                      </mat-chip>
                      <mat-chip [class]="'priority-' + task.priority">
                        {{getPriorityLabel(task.priority)}}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                </div>
                <p class="task-description">{{task.description}}</p>
                <div class="task-footer">
                  <div class="task-date">
                    <mat-icon class="date-icon">calendar_today</mat-icon>
                    <span>Creada el {{formatDate(task.createdAt)}}</span>
                  </div>
                  <div class="task-actions">
                    <button mat-icon-button color="primary" matTooltip="Editar tarea" (click)="editTask(task)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" matTooltip="Eliminar tarea" (click)="deleteTask(task)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <mat-divider></mat-divider>
              </div>
            </div>
          </ng-container>
          <ng-template #noTasks>
            <div class="no-tasks">
              <mat-icon>assignment</mat-icon>
              <h2>No hay tareas disponibles</h2>
              <p>Comienza creando una nueva tarea</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tasks-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #ffebee;
      padding: 2rem;
    }

    .tasks-card {
      width: 100%;
      max-width: 800px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .tasks-list {
      padding: 1rem;
    }

    .task-item {
      padding: 1.5rem 0;
    }

    .task-item:last-child {
      padding-bottom: 0;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .task-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
      color: #333;
    }

    .task-description {
      margin: 0 0 1rem 0;
      color: #666;
      line-height: 1.5;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .task-date {
      display: flex;
      align-items: center;
      color: #666;
      font-size: 0.9rem;
    }

    .date-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
    }

    .task-badges {
      display: flex;
      gap: 0.5rem;
    }

    mat-chip-set {
      display: flex;
      gap: 0.5rem;
    }

    mat-chip {
      font-size: 0.85rem;
    }

    .status-pending {
      background-color: #ffd740 !important;
      color: #000;
    }

    .status-completed {
      background-color: #69f0ae !important;
      color: #000;
    }

    .priority-low {
      background-color: #90caf9 !important;
      color: #000;
    }

    .priority-medium {
      background-color: #ffb74d !important;
      color: #000;
    }

    .priority-high {
      background-color: #ef5350 !important;
      color: #fff;
    }

    .no-tasks {
      text-align: center;
      padding: 3rem 1rem;
      color: #666;
    }

    .no-tasks mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
      color: #999;
    }

    .no-tasks h2 {
      margin: 0;
      font-weight: normal;
      color: #333;
    }

    .no-tasks p {
      margin: 0.5rem 0 0;
      color: #666;
    }

    mat-divider {
      margin: 0;
    }

    .task-item:last-child mat-divider {
      display: none;
    }

    mat-card-header {
      padding: 1rem;
      background-color: #f8f9fa;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-bottom: 1px solid #eee;
    }

    mat-card-title {
      color: #333;
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }

    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .add-task-btn {
      background-color: #4caf50;
      color: white;
    }

    .mat-mdc-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .welcome-message {
      display: flex;
      align-items: center;
    }

    .welcome-message h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
      color: #333;
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  userName: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userName = `${user.name} ${user.lastName}`;
        this.loadTasks(user.userId);
      }
    });
  }

  loadTasks(userId: string) {
    this.taskService.getUserTasks(userId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasks = [];
      }
    });
  }

  formatDate(createdAt: { _seconds: number; _nanoseconds: number }): string {
    const date = new Date(createdAt._seconds * 1000);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Prioridad Alta';
      case 'medium': return 'Prioridad Media';
      case 'low': return 'Prioridad Baja';
    }
    return '';
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: task,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updateData = {
          title: result.title,
          description: result.description,
          status: result.status,
          priority: result.priority
        };

        this.taskService.updateTask(task.id, updateData).subscribe({
          next: (updatedTask) => {
            // Actualizar la tarea en la lista local
            const index = this.tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
              // Forzar la actualización de la vista
              this.tasks = [...this.tasks];
            }
          },
          error: (error) => {
            console.error('Error updating task:', error);
          }
        });
      }
    });
  }

  deleteTask(task: Task) {
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      data: { title: task.title },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            // Eliminar la tarea de la lista local
            this.tasks = this.tasks.filter(t => t.id !== task.id);
          },
          error: (error) => {
            console.error('Error deleting task:', error);
          }
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  addNewTask() {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: {
        title: '',
        description: '',
        status: 'pending',
        priority: 'low'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.getCurrentUser().subscribe(user => {
          if (user) {
            const newTask = {
              title: result.title,
              description: result.description,
              userId: user.userId,
              status: result.status,
              priority: result.priority
            };

            this.taskService.createTask(newTask).subscribe({
              next: (createdTask) => {
                this.tasks = [...this.tasks, createdTask];
              },
              error: (error) => {
                console.error('Error creating task:', error);
              }
            });
          }
        });
      }
    });
  }
}
