// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";

// @Injectable({ providedIn: 'root' })
// export class TransactionService {
//   constructor(private http: HttpClient) {}

//   getTransactions() {
//     return this.http.get<any[]>('/api/transactions');
//   }

//   addTransaction(tx: any) {
//     return this.http.post('/api/transactions', tx);
//   }
// }

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private baseUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}
  private getAuthHeaders() {
    const token = localStorage.getItem('token');  // Get token from localStorage or sessionStorage
    if (!token) {
      // Handle missing token case, such as redirecting to login
      console.log('Token not found');
    }
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`  // Send the token in the Authorization header
      })
    };
  }

  getTransactions() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  addTransaction(tx: any) {
    return this.http.post(`${this.baseUrl}`, tx);
  }

  updateTransaction(id: string, tx: any) {
    return this.http.put(`${this.baseUrl}/${id}`, tx);
  }

  deleteTransaction(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  // Add this inside TransactionService
sendReport(reportData: { email: string, frequency: string, transactions: any[] }) {
  return this.http.post('http://localhost:3000/api/send-report', reportData);
}

}
