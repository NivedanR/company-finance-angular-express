// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common'; // if you use *ngIf, *ngFor
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username = '';
//   password = '';

//   constructor(private auth: AuthService, private router: Router) {}

//   login() {
//     this.auth.login(this.username, this.password).subscribe(() => this.router.navigate(['/transactions']));
//   }
// }





// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   newUsername: string = '';
//   newPassword: string = '';
//   confirmPassword: string = '';
//   showRegisterForm: boolean = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   login() {
//     this.authService.login(this.username, this.password).subscribe({
//       next: (response) => {
//         console.log('Logged in successfully');
//         this.router.navigate(['/transactions']);
//       },
//       error: (error) => {
//         console.error('Login failed:', error);
//       }
//     });
//   }

//   toggleRegisterForm() {
//     this.showRegisterForm = !this.showRegisterForm;
//   }

//   register() {
//     if (this.newPassword !== this.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     const newUser = {
//       username: this.newUsername,
//       password: this.newPassword
//     };

//     this.authService.register(newUser).subscribe({
//       next: (response) => {
//         console.log('User registered successfully');
//         alert('Registration successful. You can now log in.');
//         this.showRegisterForm = false;
//       },
//       error: (error) => {
//         console.error('Registration failed:', error);
//       }
//     });
//   }
// }




import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  newUsername: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showRegisterForm: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Logged in successfully');
        this.router.navigate(['/transactions']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  // Method to toggle register form visibility (if you need it)
  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  // Method to register a new user
  register() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const newUser = {
      username: this.newUsername,
      password: this.newPassword
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        console.log('User registered successfully');
        alert('Registration successful. You can now log in.');
        this.showRegisterForm = false;
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }

  // Navigate to the register page programmatically
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
