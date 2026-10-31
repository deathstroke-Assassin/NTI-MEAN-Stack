
import { Component, OnInit, signal  } from '@angular/core';
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
stats = signal<DashboardStats | null>(null);
loading = signal(true);
error = signal('');

  constructor(
    private dashboardService: DashboardService,
    private auth: Auth,
    private router: Router,

  ) {}

  ngOnInit(): void {

    this.dashboardService.getStats().subscribe({
     next: (response) => {
  this.stats.set(response.data);
  this.loading.set(false);
},
      error: (err) => {
        console.error('Failed to load dashboard stats:', err);
        this.error.set('Failed to load dashboard statistics.');
        this.loading.set(false);
      }
    });
  }
  logout(): void {
  this.auth.logout();
  this.router.navigate(['/login']);
}
}
