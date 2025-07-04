import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BannerCarouselComponent } from "../banner-carousel/banner-carousel.component";
import { FeatureHighlightComponent } from "../highlight/feature-highlight.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BannerCarouselComponent,
    FeatureHighlightComponent,
    FooterComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
