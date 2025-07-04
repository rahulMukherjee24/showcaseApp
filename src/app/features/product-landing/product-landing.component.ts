import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-product-landing",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./product-landing.component.html",
  styleUrls: ["./product-landing.component.scss"],
})
export class ProductLandingComponent {
  productTypes = [
    {
      name: "T–Shirts",
      image: "assets/products/tshirt-landing.jpeg",
      route: "/products/tshirts",
      description: "Custom apparel with your photo, logo, or text.",
    },
    {
      name: "Mugs",
      image: "assets/products/mug-landing.jpeg",
      route: "/products/mugs",
      description: "Sip your memories every morning with a custom mug.",
    },
    {
      name: "Calendars",
      image: "assets/products/calender-landing.jpeg",
      route: "/products/calendars",
      description: "Photo calendars to brighten your desk all year.",
    },
  ];
}
