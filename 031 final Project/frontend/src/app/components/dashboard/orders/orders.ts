
import { Component, OnInit, signal  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface Order {
  _id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: 'opened' | 'closed';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  selectedOrder: Order | null = null;
  selectedStatus: 'opened' | 'closed' | 'all' = 'all';

  loading = signal(false);
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true)
    this.errorMessage = '';

    this.http.get<Order[]>('/api/v1.0/orders').subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
        this.loading.set(false)
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Could not load orders. Please try again.';
        this.loading.set(false)
      }
    });
  }

  applyFilter(): void {
    this.filteredOrders =
      this.selectedStatus === 'all'
        ? this.orders
        : this.orders.filter(
            order => order.status === this.selectedStatus
          );
  }

  setFilter(status: 'opened' | 'closed' | 'all'): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  openOrder(order: Order): void {
    this.selectedOrder = { ...order };
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeDetails(): void {
    this.selectedOrder = null;
  }

  saveOrder(): void {
    if (!this.selectedOrder || this.saving) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const id = this.selectedOrder._id;
    const payload = {
      status: this.selectedOrder.status,
      notes: this.selectedOrder.notes
    };

    this.http.put(`/api/v1.0/orders/${id}`, payload).subscribe({
      next: () => {
        const index = this.orders.findIndex(order => order._id === id);

        if (index !== -1) {
          this.orders[index] = {
            ...this.orders[index],
            status: payload.status,
            notes: payload.notes
          };
        }

        this.applyFilter();
        this.selectedOrder = {
          ...this.selectedOrder!,
          status: payload.status,
          notes: payload.notes
        };

        this.successMessage = 'Order updated successfully.';
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Could not update the order.';
        this.saving = false;
      }
    });
  }

  get openedCount(): number {
    return this.orders.filter(order => order.status === 'opened').length;
  }

  get closedCount(): number {
    return this.orders.filter(order => order.status === 'closed').length;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
  countItems(total: number, item: OrderItem): number {
  return total + item.quantity;
}
}
