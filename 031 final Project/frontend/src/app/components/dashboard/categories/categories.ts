
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  private readonly api = '/api/v1.0/categories';

  categories: Category[] = [];
  
  saving = false;
  error = signal('');
  loading = signal(true);
  success = '';
  search = '';

  showForm = false;
  editingId: string | null = null;

  form = this.emptyForm();

  constructor(
    private http: HttpClient,
    
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private emptyForm() {
    return {
      name: '',
      description: ''
    };
  }

  get filteredCategories(): Category[] {
    const term = this.search.trim().toLowerCase();

    if (!term) return this.categories;

    return this.categories.filter(category =>
      category.name.toLowerCase().includes(term) ||
      (category.description || '').toLowerCase().includes(term)
    );
  }

  loadCategories(): void {
    this.loading.set(true)
    this.error.set('');

    this.http.get<Category[]>(this.api).subscribe({
      next: categories => {
        this.categories = categories;
        this.loading.set(false)
      },
      error: err => {
        this.error = err.error?.message || 'Could not load categories.';
        this.loading.set(false)
        
      }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.error.set('');
    this.success = '';
    this.showForm = true;
  }

  openEdit(category: Category): void {
    this.editingId = category._id;
    this.form = {
      name: category.name,
      description: category.description || ''
    };
    this.error.set('');
    this.success = '';
    this.showForm = true;
  }

  closeForm(): void {
    if (this.saving) return;
    this.showForm = false;
  }

  saveCategory(): void {
    if (!this.form.name.trim()) {
      this.error.set('Category name is required.')
      return;
    }

    this.saving = true;
    this.error.set('');
    this.success = '';

    const payload = {
      name: this.form.name.trim(),
      description: this.form.description.trim()
    };

    const request = this.editingId
      ? this.http.put(`${this.api}/${this.editingId}`, payload)
      : this.http.post(this.api, payload);

    const wasEditing = !!this.editingId;

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.success = wasEditing
          ? 'Category updated successfully.'
          : 'Category created successfully.';
        this.loadCategories();
      },
      error: err => {
        this.saving = false;
        this.error = err.error?.message || 'Could not save the category.';
      }
    });
  }

  deleteCategory(category: Category): void {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Items may still reference this category.`
    );

    if (!confirmed) return;

    this.error.set('');
    this.success = '';

    this.http.delete(`${this.api}/${category._id}`).subscribe({
      next: () => {
        this.success = `"${category.name}" was deleted.`;
        this.loadCategories();
      },
      error: err => {
        this.error = err.error?.message || 'Could not delete the category.';
      }
    });
  }

  trackById(_index: number, category: Category): string {
    return category._id;
  }
}
