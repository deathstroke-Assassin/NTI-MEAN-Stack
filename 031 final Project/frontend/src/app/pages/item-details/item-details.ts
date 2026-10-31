
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Category {
  _id: string;
  name: string;
}

interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  photo?: string;
  categoryId: string;
  category?: Category;
  isActive?: boolean;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css'
})
export class ItemDetails implements OnInit {
  item = signal<Item | null>(null);
  loading = signal(true);
  error = signal('');

  customerName = signal('');
  customerPhone = signal('');
  customerAddress = signal('');
  quantity = signal(1);

  submitting = signal(false);
  orderError = signal('');
  orderSuccess = signal('');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Invalid item ID.');
      this.loading.set(false);
      return;
    }

    this.loadItem(id);
  }

  loadItem(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Item>(`/api/v1.0/items/${id}`).subscribe({
      next: (item) => {
        if (!item || item.isActive === false) {
          this.error.set('This item is unavailable.');
        } else {
          this.item.set(item);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load item:', err);
        this.error.set(
          err.status === 404
            ? 'Item not found.'
            : 'We couldn’t load this item. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }

  get photoUrl(): string {
    const photo = this.item()?.photo;

    return photo ? `/img/uploades/${photo}` : '';
  }

  get orderTotal(): number {
    return (this.item()?.price ?? 0) * this.quantity();
  }

  submitOrder(): void {
    console.log('submitOrder() was called');
    const item = this.item();

    if (!item || this.submitting()) {
      console.log('Stopped:', {
      item,
      submitting: this.submitting()
    });
      return;
    }

    this.orderError.set('');
    this.orderSuccess.set('');

    const name = this.customerName().trim();
    const phone = this.customerPhone().trim();
    const address = this.customerAddress().trim();
    const quantity = this.quantity();

    if (!name || !phone || !address) {
      this.orderError.set('Please complete all customer details.');
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      this.orderError.set('Quantity must be at least 1.');
      return;
    }

    this.submitting.set(true);

    const order = {
      customer: {
        name,
        phone,
        address
      },
      items: [
        {
          itemId: item._id,
          quantity
        }
      ]
    };

  
this.http.post('/api/v1.0/orders', order).subscribe({
  next: (response) => {
    console.log('Order created successfully:', response);

    this.orderSuccess.set(
      'Your order was submitted successfully! We will contact you by phone.'
    );

    this.customerName.set('');
    this.customerPhone.set('');
    this.customerAddress.set('');
    this.quantity.set(1);
    this.submitting.set(false);
  },
  error: (err) => {
    console.error('Order submission failed:', {
      status: err.status,
      message: err.message,
      response: err.error,
      url: err.url
    });

    this.orderError.set(
      err.error?.message ||
      err.message ||
      'We couldn’t submit your order. Please try again.'
    );

    this.submitting.set(false);
  }
});

  }
}
