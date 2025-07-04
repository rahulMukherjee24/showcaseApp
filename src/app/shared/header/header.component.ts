import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AsyncPipe } from "@angular/common";
import { MenuComponent } from "../menu/menu/menu.component";
import { CartService } from "../../core/services/cart.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe, MenuComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  animateCart = false;

  constructor(public auth: AuthService, private cartService: CartService) {}

  isMenuOpen = false;

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      const newCount = items.length;
      this.cartCount = items.length;

      if (newCount !== this.cartCount) {
        this.triggerCartAnimation();
      }

      this.cartCount = newCount;
    });
  }

  triggerCartAnimation() {
    this.animateCart = true;

    setTimeout(() => {
      this.animateCart = false;
    }, 400); // match the animation duration
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
