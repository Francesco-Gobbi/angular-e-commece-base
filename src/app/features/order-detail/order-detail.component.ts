import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../shared/types';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-detail.component.html',
  standalone: true,
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
