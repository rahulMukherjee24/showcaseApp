import { Routes } from "@angular/router";

export const routes: Routes = [
  // Redirect empty path to /products
  {
    path: "",
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
  },
  // 👇 This is the missing piece
  {
    path: "products",
    loadComponent: () =>
      import("./features/product-landing/product-landing.component").then(
        (m) => m.ProductLandingComponent
      ),
  },

  // Product gallery (e.g., /products/tshirts)
  {
    path: "products/:productType",
    loadComponent: () =>
      import("./features/product-gallery/product-gallery.component").then(
        (m) => m.ProductGalleryComponent
      ),
  },

  // Editor route
  {
    path: "editor/:productType/:templateId",
    loadComponent: () =>
      import("./features/editor/editor.component").then(
        (m) => m.EditorComponent
      ),
  },
  // ✅ ADD THIS ROUTE
  {
    path: "cart",
    loadComponent: () =>
      import("./features/cart/cart.component").then((m) => m.CartComponent),
  },
];
