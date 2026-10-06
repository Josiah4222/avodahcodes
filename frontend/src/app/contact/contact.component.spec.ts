import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpMock: HttpTestingController;

  const validBrief = 'We need a website with a CMS we can manage ourselves.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('posts the form to the api and shows the success panel', () => {
    component.form = {
      name: 'Josiah',
      email: 'josiah@example.com',
      org: 'Example Org',
      type: 'website',
      brief: validBrief,
    };

    component.send();

    const req = httpMock.expectOne('/api/contact/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toEqual('Josiah');
    expect(req.request.body.email).toEqual('josiah@example.com');
    expect(req.request.body.org).toEqual('Example Org');
    expect(req.request.body.project_type).toEqual('website');
    expect(req.request.body.brief).toEqual(validBrief);
    expect(req.request.body.company_website).toEqual('');
    expect(req.request.body.rendered_at).toBeGreaterThan(0);

    req.flush({ id: 1, detail: 'Message received.' });

    expect(component.submitted()).toBeTrue();
    expect(component.sending()).toBeFalse();
    expect(component.errorMessage()).toBe('');
  });

  it('keeps the user on the form when the server reports validation errors', () => {
    component.send();

    httpMock
      .expectOne('/api/contact/')
      .flush({ email: ['Enter a valid email address.'] }, { status: 400, statusText: 'Bad Request' });

    expect(component.submitted()).toBeFalse();
    expect(component.sending()).toBeFalse();
    expect(component.errorMessage()).toContain('Email: Enter a valid email address.');
  });

  it('reports an unreachable server', () => {
    component.send();

    httpMock
      .expectOne('/api/contact/')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(component.submitted()).toBeFalse();
    expect(component.errorMessage()).toContain('Could not reach the server');
  });

  it('reports throttling', () => {
    component.send();

    httpMock.expectOne('/api/contact/').flush(
      { detail: 'Request was throttled.' },
      { status: 429, statusText: 'Too Many Requests' },
    );

    expect(component.errorMessage()).toContain('Too many messages');
  });

  it('clears the form and messages on reset', () => {
    component.form = { name: 'Josiah', email: 'j@example.com', org: 'Org', type: 'product', brief: validBrief };
    component.website = 'http://spam.example';
    component.errorMessage.set('Something went wrong');
    component.submitted.set(true);

    component.reset();

    expect(component.form).toEqual({ name: '', email: '', org: '', type: '', brief: '' });
    expect(component.website).toEqual('');
    expect(component.submitted()).toBeFalse();
    expect(component.errorMessage()).toBe('');
  });
});