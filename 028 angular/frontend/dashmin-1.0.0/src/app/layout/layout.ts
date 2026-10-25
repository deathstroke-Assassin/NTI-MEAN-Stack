import { Component, HostListener, afterNextRender, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

/**
 * Layout = the shell of the application.
 *
 * It is rendered once as the parent route of every page, so the sidebar and
 * the top navbar stay mounted (and visible) while the router swaps the
 * child components (home / about) inside its <router-outlet />.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  /** The only two links of the recreated dashmin. */
  protected readonly links: NavLink[] = [
    { label: 'Home', path: '/home', icon: 'fa fa-tachometer-alt' },
    { label: 'About', path: '/about', icon: 'fa fa-info-circle' },
  ];

  /** Mobile sidebar state (adds / removes the "open" class). */
  protected readonly sidebarOpen = signal(false);

  /** Which navbar dropdown is currently open (null = all closed). */
  protected readonly openMenu = signal<string | null>(null);

  /** Used to hide the loading spinner once the first render is done. */
  protected readonly ready = signal(false);

  /** Shows the "back to top" button once the page is scrolled. */
  protected readonly showBackToTop = signal(false);

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  protected toggleSidebar(event: Event): void {
    event.preventDefault();
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected toggleMenu(event: Event, menu: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.openMenu.update((current) => (current === menu ? null : menu));
  }

  protected closeMenu(): void {
    this.openMenu.set(null);
  }

  protected scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('document:click')
  protected onDocumentClick(): void {
    this.closeMenu();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.showBackToTop.set(window.scrollY > 300);
  }
}
