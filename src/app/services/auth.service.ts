import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of, switchMap } from 'rxjs';
import { TaskService } from './task.service';

interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface User {
  id: string;
  userId: string;
  name: string;
  lastName: string;
  dateBirth: Timestamp | string;
  createdAt: Timestamp | string;
}

interface LoginResponse {
  token: string;
  user: User;
  expiresIn: string;
}

interface CreateUserResponse {
  user: User;
  token: string;
  expiresIn: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://invigorating-forgiveness-production.up.railway.app/api/users';
  private currentUser = new BehaviorSubject<User | null>(null);
  private tempEmail: string | null = null;
  private token = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private taskService: TaskService
  ) {
    // Intentar recuperar el token del localStorage al iniciar
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token.next(savedToken);
    }
  }

  checkUser(email: string): Observable<LoginResponse | null> {
    this.tempEmail = email;
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { userId: email }).pipe(
      map(response => {
        // Limpiar cualquier estado anterior
        this.taskService.clearTasks();
        
        // Guardar el token y usuario
        this.setToken(response.token);
        this.currentUser.next(response.user);

        // Cargar las tareas del usuario
        this.taskService.getUserTasks(response.user.userId).subscribe();
        
        return response;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<CreateUserResponse>(this.apiUrl, userData).pipe(
      map(response => {
        // Guardar el token y usuario
        this.setToken(response.token);
        this.currentUser.next(response.user);
        return response.user;
      })
    );
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
    this.token.next(token);
  }

  getToken(): string | null {
    return this.token.getValue();
  }

  getStoredEmail(): string | null {
    return this.tempEmail;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  navigateToCreateUser(): void {
    this.router.navigate(['/create-user']);
  }

  logout(): void {
    // Limpiar el estado del usuario
    this.currentUser.next(null);
    this.tempEmail = null;
    
    // Limpiar el token
    this.token.next(null);
    localStorage.clear();
    
    // Limpiar el estado de las tareas
    this.taskService.clearTasks();
    
    // Navegar al login y forzar un refresh completo
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
} 