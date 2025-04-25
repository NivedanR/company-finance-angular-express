import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// bootstrapApplication(AppComponent, {
//     providers: [
//       provideHttpClient(withInterceptorsFromDi())
//     ]
//   },appConfig);

bootstrapApplication(AppComponent, appConfig);
