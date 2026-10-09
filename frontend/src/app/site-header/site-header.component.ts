import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent {
  private readonly router = inject(Router);

  menuOpen = false;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.close());
  }

  toggle(): void {
    if (this.menuOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.menuOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen) {
      this.close();
    }
  }
}
