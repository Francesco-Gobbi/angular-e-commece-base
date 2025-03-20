import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidenavOpen: boolean = true; // Sidebar aperta di default

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
