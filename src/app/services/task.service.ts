import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getUserTasks(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/user?userId=${userId}`);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${taskId}`);
  }

  updateTask(taskId: string, updateData: {
    title: string;
    description: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}?id=${taskId}`, updateData);
  }

  createTask(taskData: {
    title: string;
    description: string;
    userId: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }
} 