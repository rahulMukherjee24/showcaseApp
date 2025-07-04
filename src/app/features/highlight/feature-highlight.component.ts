import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-feature-highlight",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./feature-highlight.component.html",
  styleUrls: ["./feature-highlight.component.scss"],
})
export class FeatureHighlightComponent {
  features = [
    {
      icon: "✅",
      title: "Easy Customization",
      description: "Add photos, text, and designs in seconds.",
    },
    {
      icon: "🛡️",
      title: "Quality Guaranteed",
      description: "Premium products, durable prints.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Delivered to your door in 3–5 days.",
    },
  ];
}
