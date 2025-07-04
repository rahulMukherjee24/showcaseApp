import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../core/services/cart.service";
import { PaymentService } from "../../core/services/payment.service";
import {
  Firestore,
  collection,
  addDoc,
  Timestamp,
} from "@angular/fire/firestore";
import { AuthService } from "../../services/auth.service";

export interface CartItem {
  productType: string;
  imageUrl: string;
  text: string;
  textColor: string;
  fontSize: number;
  quantity: number;
  price: number;
}

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  showPaymentOptions = false;
  selectedPaymentMethod: string = "";

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private firestore: Firestore,
    private authService: AuthService // ✅ Injected
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      setTimeout(() => this.renderAllPreviews(), 0); // Wait for DOM
    });
  }

  get totalPrice(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }

  renderAllPreviews() {
    this.cartItems.forEach((item, index) => {
      const canvas = document.getElementById(
        `preview-canvas-${index}`
      ) as HTMLCanvasElement;

      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const baseImg = new Image();
      baseImg.src = item.imageUrl;

      baseImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = item.textColor;
        ctx.font = `${Math.max(10, item.fontSize * 0.5)}px Arial`;
        ctx.fillText(item.text, 10, canvas.height - 10);
      };
    });
  }

  confirmCheckout() {
    if (!this.selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const orderDescription = this.cartItems
      .map((item) => `${item.productType} × ${item.quantity}`)
      .join(", ");

    this.paymentService.payWithRazorpay({
      amount: this.totalPrice,
      name: "Classic Impression",
      description: orderDescription,
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9876543210",
      },
      handler: (response: any) => this.handlePaymentSuccess(response),
    });

    this.showPaymentOptions = false;
    this.selectedPaymentMethod = "";
  }

  async handlePaymentSuccess(paymentResponse: any) {
    const user = this.authService.user$.value;

    if (!user) {
      alert("User not logged in. Cannot save order.");
      return;
    }

    const orderRef = collection(this.firestore, "orderHistory");

    const order = {
      userId: user.uid, // ✅ Real UID from Firebase auth
      items: this.cartItems,
      totalAmount: this.totalPrice,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      createdAt: Timestamp.now(),
      status: "placed",
    };

    try {
      await addDoc(orderRef, order);
      console.log("✅ Order saved to Firestore");
      alert("Payment successful and order saved!");
    } catch (err) {
      console.error("❌ Failed to save order:", err);
      alert("Payment successful, but failed to save order.");
    }
  }
}
