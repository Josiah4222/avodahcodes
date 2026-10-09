import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../site-header/site-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  projects = [
    {
      client: 'Dinq Advisory',
      category: 'Advisory & Consulting',
      domain: 'www.dinqadvisory.com',
      url: 'https://www.dinqadvisory.com',
      image: '/work/dinqadvisory.webp',
      description:
        'A focused web experience designed to communicate the firm’s services clearly while providing a flexible foundation for managing its digital presence.',
    },
    {
      client: 'Kairos Law Firm',
      category: 'Legal Services',
      domain: 'kairoslawfirm.com',
      url: 'https://kairoslawfirm.com',
      image: '/work/kairoslawfirm.webp',
      description:
        'A professional platform built around clarity, credibility, and easy content management — giving the firm a stronger way to present its services and connect with clients.',
    },
    {
      client: 'Kal Gift Shop & Decor',
      category: 'Store Management System',
      domain: 'kalgiftshop.com',
      url: 'https://kalgiftshop.com/login',
      image: '/work/kalgiftshop.webp',
      description:
        'An internal store management system built for daily operations — inventory, staff accounts and authorized access behind a single sign-in, so the shop runs on one system instead of scattered notebooks.',
    },
  ];
}
