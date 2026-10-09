import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../site-header/site-header.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  services = [
    {
      id: 'websites',
      label: 'Websites',
      tagline: 'More than a digital brochure.',
      intro: 'We build websites that give organizations a clear presence on the web and a practical way to manage it.',
      body: 'From simple company websites to content-rich platforms, we handle the design, development, CMS, deployment, and everything in between.',
      bestFor: ['Businesses', 'Organizations', 'NGOs', 'Institutions', 'Professional services'],
      items: [
        'Corporate & institutional websites',
        'Service-based websites',
        'Custom CMS platforms',
        'Appointment & inquiry systems',
        'SEO-ready websites',
        'Domain, hosting & deployment',
      ],
    },
    {
      id: 'systems',
      label: 'Business Systems',
      tagline: 'Turn complicated work into structured systems.',
      intro: 'Manual processes often work — until they don\'t.',
      body: 'We build custom systems that organize information, automate repetitive work, define workflows, and give teams better control over their operations.',
      bestFor: null,
      items: [
        'Management systems',
        'Inventory & stock systems',
        'Administrative platforms',
        'Dashboards & reporting',
        'Role-based access systems',
        'Workflow & approval systems',
        'Custom internal tools',
        'API integrations',
      ],
    },
    {
      id: 'products',
      label: 'Products',
      tagline: 'From an idea to something people can use.',
      intro: 'Have an idea for a platform or service?',
      body: 'We can take it from an early concept to a working product — shaping the idea, designing the experience, building the technology, and preparing it for real users.',
      bestFor: null,
      items: [
        'Product discovery',
        'MVP development',
        'Web platforms',
        'User accounts & authentication',
        'Payment integrations',
        'Admin platforms',
        'Product iteration & improvement',
      ],
    },
    {
      id: 'existing',
      label: 'Existing System?',
      tagline: 'We can work with what you already have.',
      intro: 'Not every project starts from zero.',
      body: 'We can review, improve, maintain, deploy, or extend existing software — whether it needs a new feature, a better architecture, a performance improvement, or simply someone who understands how it works.',
      bestFor: null,
      items: [
        'System review',
        'Bug fixing',
        'Feature development',
        'Performance improvements',
        'Deployment',
        'Maintenance',
        'Technical modernization',
      ],
    },
  ];
}
