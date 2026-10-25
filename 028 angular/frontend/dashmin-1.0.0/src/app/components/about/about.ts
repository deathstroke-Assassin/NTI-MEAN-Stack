import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Member {
  name: string;
  role: string;
  image: string;
}

/** About page of the recreated dashmin. */
@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly features: Feature[] = [
    {
      title: 'Sidebar first routing',
      description:
        'The layout component owns the sidebar and the navbar. It is loaded once and stays mounted while the routed pages are swapped inside its outlet.',
      icon: 'fa fa-columns',
    },
    {
      title: 'Lazy loaded pages',
      description:
        'Home and About are standalone components loaded on demand, so the shell of the dashboard is always painted first.',
      icon: 'fa fa-bolt',
    },
    {
      title: 'Reused template assets',
      description:
        'Bootstrap, the customized theme, the images and Chart.js are taken straight from the original dashmin template.',
      icon: 'fa fa-paint-brush',
    },
  ];

  protected readonly team: Member[] = [
    { name: 'Jhon Doe', role: 'Admin', image: 'img/user.jpg' },
    { name: 'Jane Doe', role: 'Manager', image: 'img/testimonial-1.jpg' },
    { name: 'John Smith', role: 'Developer', image: 'img/testimonial-2.jpg' },
  ];
}
