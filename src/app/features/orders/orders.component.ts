import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService, Order } from '../../core/services/orders.service';

@Component({
  selector: 'orders',
  styleUrl: 'orders.component.scss',
  templateUrl: 'orders.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class OrdersComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'order', 'price', 'user'];
  dataSource = new MatTableDataSource<Order>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.orders$.subscribe(orders => {
      this.dataSource.data = orders;
    });
    this.apiService.fetchOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}