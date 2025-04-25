import { provideRouter, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { TransactionComponent } from "./components/transaction/transaction.component";
import { RegisterComponent } from "./components/register/register.component";

// export const routes: Routes = [
//     { path: 'login', component: LoginComponent },
//     { path: 'transactions', component: TransactionComponent },
//     { path: '', redirectTo: 'login', pathMatch: 'full' }
//   ];

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // <-- Add Register route
  { path: 'transactions', component: TransactionComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // fallback for unknown routes
];
  
  export const appRoutes = provideRouter(routes);