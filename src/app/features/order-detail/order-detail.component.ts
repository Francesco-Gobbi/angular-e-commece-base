import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Orders } from '../../shared/types';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Orders
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }
}