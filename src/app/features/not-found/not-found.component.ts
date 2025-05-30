import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('404 - Page Not Found');

  }
  goTo() {
    window.location.href = '/';
  }
}
