import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Order } from '../../shared/types';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
})
export class OrdersTableComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error: string | null = null;
  private refreshSubscription: Subscription | null = null;

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
    this.loadOrders();

    this.refreshSubscription = interval(30000)
      .pipe(switchMap(() => this.orderService.getOrders()))
      .subscribe({
        next: (orders: Order[]) => {
          this.dataSource.data = orders;
        },
        error: (err) => {
          console.error('Errore nell\'aggiornamento automatico degli ordini', err);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        console.log(orders);
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento degli ordini', err);
        this.error = 'Errore nel caricamento degli ordini';
        this.loading = false;
      },
    });
  }

  refreshOrders(): void {
    this.loadOrders();
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
    this.orderService.getOrderById(order._id).subscribe({
      next: (orderDetails) => {
        this.dialog.open(OrderDetailsComponent, {
          width: '400px',
          data: orderDetails,
        });
      },
      error: (err) => {
        console.error('Errore nel caricamento dei dettagli dell\'ordine', err);
        this.error = 'Errore nel caricamento dei dettagli dell\'ordine';
      }
    });
  }
}