import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from '@angular/router';  // Import Router to navigate after logout

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private token = new BehaviorSubject<string | null>(null);
  private isLoggedInStatus = false;  // Add isLoggedInStatus to track login status

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(res => {
        this.token.next(res.token);
        this.isLoggedInStatus = true; // Set logged-in status to true
      })
    );
  }

  // Logout method
  logout() {
    this.isLoggedInStatus = false;
    this.token.next(null);  // Clear the token
    localStorage.removeItem('authToken'); // Optionally clear token from localStorage
    this.router.navigate(['/login']);  // Redirect to login page after logout
  }

  // Register method
  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  // Get current token
  getToken() {
    return this.token.value;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }
}
