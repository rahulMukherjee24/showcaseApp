import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers-banner.component.html',
  styleUrls: ['./offers-banner.component.scss'],
})
export class OffersBannerComponent {
  offers: string[] = [
    '🎉 Flat 20% Off on Photo Mugs!',
    '📸 Get a FREE Keychain with every order above ₹999!',
    '🚚 Free Delivery on orders above ₹499!',
    '🖼️ Custom Canvas Prints starting at ₹299!',
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.offers.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.offers.length) % this.offers.length;
  }
}
