import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  LucideAngularModule,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  X,
} from 'lucide-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      toastClass: 'ngx-toastr custom-toast',
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        Plus,
        Edit,
        Trash2,
        MessageSquare,
        X,
      })
    ),
    provideAnimations(),
    provideClientHydration(withEventReplay()),
  ]
};
