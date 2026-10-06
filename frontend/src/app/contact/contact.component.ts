import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contact/';

  readonly email = 'hello@avodah.studio';

  readonly phones = [
    { label: '+251 94 236 5100', href: 'tel:+251942365100' },
    { label: '+251 91 094 4444', href: 'tel:+251910944444' },
  ];

  /** Values must match ProjectType choices in the backend inquiries model. */
  readonly buildOptions = [
    { value: 'website', label: 'Website' },
    { value: 'business_system', label: 'Business System' },
    { value: 'product', label: 'Product' },
    { value: 'not_sure', label: 'Not sure yet' },
  ];

  form = {
    name: '',
    email: '',
    org: '',
    type: '',
    brief: '',
  };

  /** Honeypot. A real visitor never sees or fills this in. */
  website = '';

  /** When the form was rendered, so the API can reject instant submissions. */
  private readonly renderedAt = Date.now();

  readonly submitted = signal(false);
  readonly sending = signal(false);
  readonly errorMessage = signal('');

  send(): void {
    if (this.sending()) {
      return;
    }

    this.errorMessage.set('');
    this.sending.set(true);

    this.http
      .post(this.endpoint, {
        name: this.form.name,
        email: this.form.email,
        org: this.form.org,
        project_type: this.form.type,
        brief: this.form.brief,
        company_website: this.website,
        rendered_at: this.renderedAt,
      })
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe({
        next: () => this.submitted.set(true),
        error: (err: HttpErrorResponse) => this.errorMessage.set(this.describe(err)),
      });
  }

  reset(): void {
    this.form = { name: '', email: '', org: '', type: '', brief: '' };
    this.website = '';
    this.submitted.set(false);
    this.errorMessage.set('');
  }

  private describe(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Could not reach the server. Please try again, or email us directly.';
    }

    if (err.status === 429) {
      return 'Too many messages were sent from this connection. Please try again later, or email us directly.';
    }

    if (err.status === 400 && err.error && typeof err.error === 'object') {
      const messages = Object.entries(err.error as Record<string, unknown>).map(([field, value]) => {
        const detail = Array.isArray(value) ? value.join(' ') : String(value);
        return `${this.fieldLabel(field)}: ${detail}`;
      });

      if (messages.length) {
        return messages.join(' ');
      }
    }

    return 'Something went wrong while sending your message. Please try again, or email us directly.';
  }

  private fieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      org: 'Organisation',
      project_type: 'Project type',
      brief: 'Brief',
    };

    return labels[field] ?? field;
  }
}