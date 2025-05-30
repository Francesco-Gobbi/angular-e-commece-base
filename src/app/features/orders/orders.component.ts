import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
import { MatSelectModule } from '@angular/material/select';
import { Order, OrderItems, User } from '../../shared/types';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from '../../shared/components/snack-bar/service/snack-bar.service';
import { AclService } from '../../core/services/acl/acl.service'
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
    MatProgressSpinnerModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
})
export class OrdersTableComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error: string | null = null;
  private refreshSubscription: Subscription | null = null;
  selectedOrder: Order | null = null;
  editOrderForm: FormGroup;
  orderItems: OrderItems[] = [];
  
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
  @ViewChild('editOrderDialog') editOrderDialog!: TemplateRef<any>;
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  
  get isAdmin(): boolean {
    return this.aclService.isAdmin()
  }

  constructor(
    private orderService: OrdersService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: SnackBarService,
    private  aclService: AclService
  ) {
    this.editOrderForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

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
    this.loading = true;
    this.error = null;
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
        data.orderNumber.toString().toLowerCase().includes(filter);
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
        const matchOrder = data.orderNumber.toString().toLowerCase().includes(filter);
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
    this.loading = true;
    this.orderService.getOrderById(order._id).subscribe({
      next: (orderDetails) => {
        this.loading = false;
        this.dialog.open(OrderDetailsComponent, {
          width: '550px',
          data: orderDetails,
          panelClass: 'order-details-dialog'
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Errore nel caricamento dei dettagli dell\'ordine', err);
        this.error = 'Errore nel caricamento dei dettagli dell\'ordine';
      }
    });
  }

  openEditOrder(order: Order): void {
    this.selectedOrder = order;
    this.editOrderForm.patchValue({
      status: order.status
    });

    this.dialog.open(this.editOrderDialog, {
      width: '400px',
      disableClose: true
    });
  }

  deleteOrder(order: Order): void {
    this.selectedOrder = order;
    this.dialog.open(this.confirmDeleteDialog, {
      width: '400px'
    });
  }

  confirmDelete(): void {
    if (!this.selectedOrder) return;

    this.loading = true;
    this.orderService.deleteOrders(this.selectedOrder._id).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.snackBar.openSnackBar('Ordine eliminato con successo');
        this.refreshOrders();
      },
      error: (err) => {
        this.loading = false;
        console.error('Errore durante l\'eliminazione dell\'ordine', err);
        this.snackBar.openSnackBar('Errore durante l\'eliminazione dell\'ordine');
      }
    });
  }

  increaseQuantity(index: number): void {
    this.orderItems[index].quantity += 1;
  }

  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity -= 1;
    }
  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  calculateTotalAmount(): number {
    return this.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  saveOrderChanges(): void {
    if (!this.selectedOrder || !this.editOrderForm.valid) return;

    const updatedOrder: Partial<Order> = {
      status: this.editOrderForm.get('status')?.value
    };

    this.loading = true;
    this.orderService.updateOrders(this.selectedOrder._id, updatedOrder).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.snackBar.openSnackBar('Stato ordine aggiornato con successo');
        this.refreshOrders();
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.openSnackBar('Errore durante l\'aggiornamento dell\'ordine');
      }
    });
  }
}