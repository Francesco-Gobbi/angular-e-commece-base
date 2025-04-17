import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, filter } from 'rxjs';
import { ProductService } from '../../core/services/products/product.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Item } from '../../core/models/cart.model';
import { Store } from '@ngrx/store';
import { loadCart } from '../../state/carts/actions';
import { selectCartItems } from '../../state/carts/selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './carts.component.html',
  standalone: true,
  imports: [MatIconModule, CommonModule],
})
export class CartComponent implements OnInit {
  items$!: Observable<Item[]>;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: ProductService
  ) {}

  ngOnInit() {
    this.store.dispatch(loadCart());
    this.items$ = this.store.select(selectCartItems);
    console.log(this, this.items$);
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
