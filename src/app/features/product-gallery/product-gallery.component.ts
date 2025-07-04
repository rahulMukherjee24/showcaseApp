import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss'],
})
export class ProductGalleryComponent {
  productType = '';
  templates: Array<any> = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params) => {
      this.productType = params['productType'];
      this.loadTemplates();
    });
  }

  loadTemplates() {
    this.templates = [
      {
        id: 't1',
        name: 'Round Neck T-Shirt',
        image: 'collarneck.jpeg',
        price: 499,
      },
      {
        id: 't2',
        name: 'Polo T-Shirt',
        image: 'roundneck.jpeg',
        price: 599,
      },
    ];
  }

  openEditor(templateId: string, imageName: string) {
    this.router.navigate(['/editor', this.productType, templateId], {
      queryParams: {
        image: imageName,
      },
    });
  }
}
