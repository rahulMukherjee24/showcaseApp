import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-banner-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./banner-carousel.component.html",
  styleUrls: ["./banner-carousel.component.scss"],
})
export class BannerCarouselComponent {
  banners = [
    {
      image: "assets/images/banner/banner-tshirt.jpeg",
      title: "Design Your Own T-Shirts",
      subtitle: "Make your brand stand out with personalized apparel!",
    },
    {
      image: "assets/images/banner/banner-mug.jpeg",
      title: "Photo Mugs for Every Occasion",
      subtitle: "Custom mugs that make memories last.",
    },
    {
      image: "assets/images/banner/banner-calendar.jpeg",
      title: "Custom Calendars 2025",
      subtitle: "Start the year organized and stylish.",
    },
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }
}
