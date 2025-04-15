import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://invigorating-forgiveness-production.up.railway.app/api/tasks';
  private tasks = new BehaviorSubject<Task[]>([]);
  private initialized = false;

  constructor(private http: HttpClient) {}

  getUserTasks(userId: string): Observable<Task[]> {
    if (!this.initialized) {
      this.initialized = true;
      return this.http.get<Task[]>(`${this.apiUrl}/user?userId=${userId}`).pipe(
        tap(tasks => {
          this.tasks.next(tasks);
        })
      );
    }
    return this.tasks.asObservable();
  }

  createTask(taskData: any): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData).pipe(
      tap(newTask => {
        const currentTasks = this.tasks.getValue();
        this.tasks.next([...currentTasks, newTask]);
      })
    );
  }

  updateTask(taskId: string, updateData: any): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}?id=${taskId}`, updateData).pipe(
      tap(updatedTask => {
        const currentTasks = this.tasks.getValue();
        const index = currentTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          currentTasks[index] = updatedTask;
          this.tasks.next([...currentTasks]);
        }
      })
    );
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasks.getValue();
        this.tasks.next(currentTasks.filter(t => t.id !== taskId));
      })
    );
  }

  clearTasks(): void {
    this.tasks.next([]);
    this.initialized = false;
  }

  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }
} 