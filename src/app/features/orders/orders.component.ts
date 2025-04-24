import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from '../../core/services/orders/orders.service';
import { OrderDetailsComponent } from '../order-detail/order-detail.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Orders } from '../../shared/types';

@Component({
  selector: 'OrderTable',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatTableModule,
  ],
})
export class OrdersTableComponent implements OnInit, AfterViewInit {
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = [
    'id',
    'orderNumber',
    'totalAmount',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Orders>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrdersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (orders: Orders[]) => {
        console.log(orders);
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento degli ordini';
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openOrderDetails(order: Orders): void {
    this.orderService.getOrderById(order._id).subscribe((orderDetails) => {
      this.dialog.open(OrderDetailsComponent, {
        width: '400px',
        data: orderDetails,
      });
    });
  }
}
