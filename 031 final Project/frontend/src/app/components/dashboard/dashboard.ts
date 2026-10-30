
import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard stats:', err);
        this.error = 'Failed to load dashboard statistics.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  logout(): void {
  this.auth.logout();
  this.router.navigate(['/login']);
}
}
