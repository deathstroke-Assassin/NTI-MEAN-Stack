
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  quantity: number;
  categoryId: string;
  category?: Category;
  isActive: boolean;
  photo?: string;
}

interface ItemForm {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './items.html',
  styleUrl: './items.css'
})
export class Items implements OnInit {
  private readonly api = '/api/v1.0';

  items: Item[] = [];
  categories: Category[] = [];

  loading = signal(true);
  saving = false;
  error = signal('');
  success = '';
  search = '';

  showForm = false;
  editingId: string | null = null;
  selectedPhoto: File | null = null;
  photoInputKey = 0;

  form: ItemForm = this.emptyForm();

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadItems();
  }

  private emptyForm(): ItemForm {
    return {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: '',
      isActive: true
    };
  }

  loadItems(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Item[]>(`${this.api}/items`).subscribe({
      next: (items) => {
        this.items = items;
        this.loading.set(false);
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load items.';
        this.loading.set(false)
      }
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${this.api}/categories`).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load categories.';
      }
    });
  }

  get filteredItems(): Item[] {
    const term = this.search.trim().toLowerCase();

    if (!term) return this.items;

    return this.items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      (item.category?.name || '').toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  }

  get activeCount(): number {
    return this.items.filter(item => item.isActive).length;
  }

  get lowStockCount(): number {
    return this.items.filter(item => item.quantity < 10).length;
  }

  openCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.selectedPhoto = null;
    this.photoInputKey++;
    this.error.set('');
    this.success = '';
    this.showForm = true;
  }

  openEdit(item: Item): void {
    this.editingId = item._id;
    this.form = {
      name: item.name,
      description: item.description || '',
      price: item.price,
      quantity: item.quantity,
      categoryId: item.categoryId,
      isActive: item.isActive
    };

    this.selectedPhoto = null;
    this.photoInputKey++;
    this.error.set('')
    this.success = '';
    this.showForm = true;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedPhoto = input.files?.[0] || null;
  }

  closeForm(): void {
    if (this.saving) return;
    this.showForm = false;
  }

  saveItem(): void {
    if (
      !this.form.name.trim() ||
      !this.form.categoryId ||
      this.form.price < 0 ||
      this.form.quantity < 0 ||
      !Number.isInteger(Number(this.form.quantity))
    ) {
      this.error.set('Enter a name, category, valid price and whole-number quantity.')
      return;
    }

    this.saving = true;
    this.error.set('')
    this.success = '';

    const payload = new FormData();
    payload.append('name', this.form.name.trim());
    payload.append('description', this.form.description);
    payload.append('price', String(this.form.price));
    payload.append('quantity', String(this.form.quantity));
    payload.append('categoryId', this.form.categoryId);
    payload.append('isActive', String(this.form.isActive));

    if (this.selectedPhoto) {
      payload.append('photo', this.selectedPhoto);
    }

    const request = this.editingId
      ? this.http.put(
          `${this.api}/items/${this.editingId}`,
          payload
        )
      : this.http.post(`${this.api}/items`, payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.success = this.editingId
          ? 'Item updated successfully.'
          : 'Item created successfully.';
        this.loadItems();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Could not save the item.';
      }
    });
  }

  deleteItem(item: Item): void {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    this.error.set('')
    this.success = '';

    this.http.delete(`${this.api}/items/${item._id}`).subscribe({
      next: () => {
        this.success = `"${item.name}" was deleted.`;
        this.loadItems();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not delete the item.';
      }
    });
  }

  trackById(_index: number, item: Item): string {
    return item._id;
  }
}
