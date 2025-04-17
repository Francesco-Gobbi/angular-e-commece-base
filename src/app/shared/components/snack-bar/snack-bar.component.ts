import {Component, HostBinding, inject} from '@angular/core';
import {
  MatSnackBarLabel,
  MatSnackBarActions,
  MatSnackBarAction,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';

export type SnackBarStatus = 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-status-snack-bar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    NgIf,
    NgClass
  ],
  templateUrl: './snack-bar.component.html',
  styles: [`
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 4px;
    }

    :host(.snackbar-success) {
      background-color: #4caf50;
      color: white;
    }

    :host(.snackbar-warning) {
      background-color: #ff9800;
      color: white;
    }

    :host(.snackbar-danger) {
      background-color: #f44336;
      color: white;
    }

    span[matSnackBarLabel] {
      flex: 1;
    }
  `]
})
export class SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA) as { message: string; status: SnackBarStatus };

  @HostBinding('class.snackbar-success') get isSuccess() {
    return this.data.status === 'success';
  }

  @HostBinding('class.snackbar-warning') get isWarning() {
    return this.data.status === 'warning';
  }

  @HostBinding('class.snackbar-danger') get isDanger() {
    return this.data.status === 'danger';
  }
}
