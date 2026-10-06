import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './work.component.html',
})
export class WorkComponent {
  projects = [
    {
      client: 'Dinq Advisory',
      category: 'Advisory & Consulting',
      domain: 'www.dinqadvisory.com',
      url: 'https://www.dinqadvisory.com',
      image: '/work/dinqadvisory.webp',
      tags: ['Website', 'CMS', 'SEO'],
      description:
        "A focused web experience designed to communicate the firm's services clearly while providing a flexible foundation for managing its digital presence.",
    },
    {
      client: 'Kairos Law Firm',
      category: 'Legal Services',
      domain: 'kairoslawfirm.com',
      url: 'https://kairoslawfirm.com',
      image: '/work/kairoslawfirm.webp',
      tags: ['Website', 'CMS', 'SEO'],
      description:
        'A professional platform built around clarity, credibility, and easy content management — giving the firm a stronger way to present its services and connect with clients.',
    },
    {
      client: 'Kal Gift Shop & Decor',
      category: 'Store Management System',
      domain: 'kalgiftshop.com',
      url: 'https://kalgiftshop.com/login',
      image: '/work/kalgiftshop.webp',
      tags: ['ASP.NET', 'Angular', 'SQL Server'],
      description:
        'An internal store management system built for daily operations — inventory, staff accounts and authorized access behind a single sign-in.',
    },
    {
      client: 'ROTOM Ethiopia',
      category: 'NGO Website & Content System',
      domain: 'rotomethiopia.org',
      url: 'https://rotomethiopia.org',
      image: '/work/rotomethiopia.webp',
      tags: ['Website', 'CMS', 'Deployment'],
      description:
        'A custom website and management system built to give the organization control over its content while creating a clear digital home for its work and initiatives.',
    },
    {
      client: 'Kale Hiwot Church',
      category: 'Church Website & Digital Platform',
      domain: null,
      url: null,
      image: null,
      tags: ['Django REST Framework', 'Angular', 'PostgreSQL', 'CMS'],
      description:
        'A modern church website built to strengthen the church\'s digital presence, communicate its ministries and activities, and provide members and visitors with accessible information about services, events, and church programs.',
    },
    {
      client: 'Defense Headquarters',
      category: 'Enterprise Digital Transformation',
      domain: null,
      url: null,
      image: null,
      tags: ['ASP.NET', 'Angular', 'SQL Server', 'ERP', 'Digital Transformation'],
      description:
        'A large-scale digital transformation initiative focused on replacing fragmented manual workflows with integrated, secure enterprise systems across Defense Headquarters.',
    },
  ];

}

