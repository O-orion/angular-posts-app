import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string): void {
    this.toastr.success(message, 'Sucesso!');
  }

  showError(message: string): void {
    this.toastr.error(message, 'Erro!');
  }
}
