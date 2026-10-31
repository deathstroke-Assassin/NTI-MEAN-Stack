
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Category {
  _id: string;
  name: string;
  description?: string;
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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  categories = signal<Category[]>([]);
  items = signal<Item[]>([]);

  loading = signal(true);
  error = signal('');
  loadingItems = signal(true);
  itemsError = signal('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadItems();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Category[]>('/api/v1.0/categories').subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.error.set(
          'We couldn’t load the categories. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }

  loadItems(): void {
    this.loadingItems.set(true);
    this.itemsError.set('');

    this.http.get<Item[]>('/api/v1.0/items').subscribe({
      next: (items) => {
        console.log('Items API response:', items);

        this.items.set(
          items.filter(item => item.isActive !== false)
        );

        this.loadingItems.set(false);
      },
      error: (err) => {
        console.error('Failed to load items:', err);
        this.itemsError.set(
          'We couldn’t load the products. Please try again.'
        );
        this.loadingItems.set(false);
      }
    });
  }

  getItemsByCategory(categoryId: string): Item[] {
    return this.items().filter(item =>
      item.categoryId === categoryId ||
      item.category?._id === categoryId
    );
  }

  get uncategorizedItems(): Item[] {
    return this.items().filter(item => {
      const itemCategoryId =
        item.categoryId || item.category?._id;

      return !itemCategoryId ||
        !this.categories().some(
          category => category._id === itemCategoryId
        );
    });
  }
}
