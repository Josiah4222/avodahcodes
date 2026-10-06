import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './studio.component.html',
})
export class StudioComponent {
  principles = [
    { step: 'Understand', desc: 'We start with the problem.' },
    { step: 'Build', desc: 'We create the simplest solution that can do the job well.' },
    { step: 'Improve', desc: 'We keep refining it until it works in the real world.' },
  ];
}
