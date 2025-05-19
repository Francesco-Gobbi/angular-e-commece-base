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
import { Order } from '../../shared/types';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
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
  dataSource = new MatTableDataSource<Order>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrdersService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
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
    const input = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (input.startsWith('#numero ordine')) {
      const filter = input.substring(15).trim();
      this.dataSource.filterPredicate = (data: Order, filter: string) =>
        data.orderNumber.toLowerCase().includes(filter);
      this.dataSource.filter = filter;
    } else if (input.startsWith('#importo')) {
      const filter = input.substring(9).trim();
      this.dataSource.filterPredicate = (data: Order, filter: string) =>
        data.totalAmount.toString().includes(filter);
      this.dataSource.filter = filter;
    } else if (input.startsWith('#stato')) {
      const filter = input.substring(7).trim();
      this.dataSource.filterPredicate = (data: Order, filter: string) =>
        data.status.toLowerCase().includes(filter);
      this.dataSource.filter = filter;
    } else {

      this.dataSource.filterPredicate = (data: Order, filter: string) => {
        const matchOrder = data.orderNumber.toLowerCase().includes(filter);
        const matchAmount = data.totalAmount.toString().includes(filter);
        const matchStatus = data.status.toLowerCase().includes(filter);
        return matchOrder || matchAmount || matchStatus;
      };
      this.dataSource.filter = input;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openOrderDetails(order: Order): void {
    this.orderService.getOrderById(order._id).subscribe((orderDetails) => {
      this.dialog.open(OrderDetailsComponent, {
        width: '400px',
        data: orderDetails,
      });
    });
  }
}
