import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../../core/services/cart.service";

@Component({
  selector: "app-price-summary",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./price-summary.component.html",
  styleUrls: ["./price-summary.component.scss"],
})
export class PriceSummaryComponent implements OnChanges {
  @Input() productType: string = "T-Shirt";
  @Input() imageUrl: string = "";

  @Input() basePrice: number = 499;
  @Input() customizationCost: number = 50;

  @Input() text: string = "";
  @Input() textColor: string = "#000000";
  @Input() fontSize: number = 24;

  @Input() quantity: number = 1;

  get pricePerItem(): number {
    return this.basePrice + this.customizationCost;
  }

  totalPrice: number = this.pricePerItem * this.quantity;

  constructor(private cartService: CartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateTotal();
  }

  updateTotal(): void {
    this.totalPrice = this.quantity * this.pricePerItem;
  }

  onQuantityChange(newQty: number): void {
    this.quantity = newQty;
    this.updateTotal();
  }

  addToCart() {
    this.cartService.addToCart({
      productType: this.productType,
      imageUrl: this.imageUrl,
      text: this.text,
      textColor: this.textColor,
      fontSize: this.fontSize,
      quantity: this.quantity,
      price: this.pricePerItem,
    });
  }
}
