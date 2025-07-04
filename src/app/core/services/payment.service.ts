import { Injectable, NgZone } from "@angular/core";
import { CartService } from "./cart.service";
import { environment } from "../../../environments/environment";

declare var Razorpay: any;

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private cartService: CartService, private ngZone: NgZone) {}

  payWithRazorpay(options: {
    amount: number;
    name: string;
    description: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    handler: (response: any) => void; // ✅ Add this line
  }) {
    const razorpayOptions = {
      key: environment.razorpayKey, // 🔑 Your Razorpay public key from environment
      amount: options.amount * 100, // 💰 Amount in paise
      currency: "INR",
      name: options.name,
      description: options.description,
      prefill: options.prefill,

      // ✅ This is called after successful payment
      handler: (response: any) => {
        console.log("✅ Razorpay Success:", response);
        alert("✅ Payment successful!");

        // ✅ Call external handler (from CartComponent)
        if (options.handler) {
          this.ngZone.run(() => options.handler(response));
        }

        // 🧹 Clear cart after success
        this.ngZone.run(() => {
          this.cartService.clearCart(); // ✅ Now Angular will detect change
        });
      },

      modal: {
        ondismiss: () => {
          console.log("❌ Razorpay popup closed by user.");
          alert("⚠️ Payment cancelled.");
        },
      },

      theme: {
        color: "#007bff",
      },
    };

    const rzp = new Razorpay(razorpayOptions);
    rzp.open();
  }
}
