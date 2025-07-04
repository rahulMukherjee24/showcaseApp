import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PriceSummaryComponent } from "./price-summary/price-summary.component";

@Component({
  selector: "app-editor",
  standalone: true,
  imports: [CommonModule, FormsModule, PriceSummaryComponent],
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements AfterViewInit {
  @ViewChild("canvasEl", { static: false })
  canvasEl!: ElementRef<HTMLCanvasElement>;

  stageWidth = 500;
  stageHeight = 600;

  text = "Your Text Here";
  fontSize = 24;
  textColor = "#000000";
  imageUrl: string = ""; // <-- base64 of uploaded image
  productType: string = "";

  textX = 100;
  textY = 100;

  isDraggingText = false;
  isDraggingImage = false;
  isResizingImage = false;

  offsetX = 0;
  offsetY = 0;

  uploadedImage: HTMLImageElement | null = null;
  imageX = 150;
  imageY = 200;
  imageWidth = 200;
  imageHeight = 200;

  resizeHandleSize = 10;

  tshirtImage = new Image();
  ctx!: CanvasRenderingContext2D;

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.productType =
      this.route.snapshot.paramMap.get("productType") ?? "T-Shirt";
    const queryImage = this.route.snapshot.queryParamMap.get("image");
    const bgImage = queryImage ?? "tshirt-blank.png";

    this.tshirtImage.src = `/assets/images/${bgImage}`;
    this.tshirtImage.onload = () => {
      const canvas = this.canvasEl.nativeElement;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      this.ctx = ctx;

      // Mouse events
      canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
      canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      canvas.addEventListener("mousemove", this.updateCursor.bind(this));

      // Touch events
      canvas.addEventListener("touchstart", this.onTouchStart.bind(this), {
        passive: false,
      });
      canvas.addEventListener("touchmove", this.onTouchMove.bind(this), {
        passive: false,
      });
      canvas.addEventListener("touchend", this.onTouchEnd.bind(this));

      this.drawCanvas();
    };
  }

  canvasPreviewDataUrl: string = "";

  drawCanvas() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // Draw background
    ctx.drawImage(this.tshirtImage, 0, 0, this.stageWidth, this.stageHeight);

    // Draw uploaded image
    if (this.uploadedImage) {
      ctx.drawImage(
        this.uploadedImage,
        this.imageX,
        this.imageY,
        this.imageWidth,
        this.imageHeight
      );
    }

    // Draw text
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillText(this.text, this.textX, this.textY);

    // ✅ Update preview image after drawing
    if (this.canvasEl?.nativeElement) {
      this.canvasPreviewDataUrl =
        this.canvasEl.nativeElement.toDataURL("image/png");
    }
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        this.uploadedImage = img;
        this.imageUrl = img.src;
        this.drawCanvas();
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Mouse event handlers
  onMouseDown(event: MouseEvent) {
    const { x, y } = this.getCanvasCoords(event);
    this.handlePointerDown(x, y);
  }

  onMouseMove(event: MouseEvent) {
    const { x, y } = this.getCanvasCoords(event);
    this.handlePointerMove(x, y);
  }

  onMouseUp() {
    this.handlePointerUp();
  }

  updateCursor(event: MouseEvent) {
    const { x, y } = this.getCanvasCoords(event);
    const canvas = this.canvasEl.nativeElement;

    if (
      this.uploadedImage &&
      x >= this.imageX + this.imageWidth - this.resizeHandleSize &&
      x <= this.imageX + this.imageWidth &&
      y >= this.imageY + this.imageHeight - this.resizeHandleSize &&
      y <= this.imageY + this.imageHeight
    ) {
      canvas.style.cursor = "nwse-resize";
    } else {
      canvas.style.cursor = "default";
    }
  }

  // Touch event handlers
  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    if (!touch) return;
    const { x, y } = this.getCanvasTouchCoords(touch);
    this.handlePointerDown(x, y);
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    if (!touch) return;
    const { x, y } = this.getCanvasTouchCoords(touch);
    this.handlePointerMove(x, y);
  }

  onTouchEnd(event: TouchEvent) {
    event.preventDefault();
    this.handlePointerUp();
  }

  // Common pointer handling logic
  handlePointerDown(x: number, y: number) {
    // Check resize handle
    if (
      this.uploadedImage &&
      x >= this.imageX + this.imageWidth - this.resizeHandleSize &&
      x <= this.imageX + this.imageWidth &&
      y >= this.imageY + this.imageHeight - this.resizeHandleSize &&
      y <= this.imageY + this.imageHeight
    ) {
      this.isResizingImage = true;
      this.offsetX = x - (this.imageX + this.imageWidth);
      this.offsetY = y - (this.imageY + this.imageHeight);
      return;
    }

    // Check image drag
    if (
      this.uploadedImage &&
      x >= this.imageX &&
      x <= this.imageX + this.imageWidth &&
      y >= this.imageY &&
      y <= this.imageY + this.imageHeight
    ) {
      this.isDraggingImage = true;
      this.offsetX = x - this.imageX;
      this.offsetY = y - this.imageY;
      return;
    }

    // Check text drag
    const textWidth = this.ctx.measureText(this.text).width;
    const textHeight = this.fontSize;
    if (
      x >= this.textX &&
      x <= this.textX + textWidth &&
      y >= this.textY - textHeight &&
      y <= this.textY
    ) {
      this.isDraggingText = true;
      this.offsetX = x - this.textX;
      this.offsetY = y - this.textY;
    }
  }

  handlePointerMove(x: number, y: number) {
    if (this.isResizingImage) {
      this.imageWidth = Math.max(10, x - this.imageX);
      this.imageHeight = Math.max(10, y - this.imageY);
      this.drawCanvas();
      return;
    }

    if (this.isDraggingImage) {
      this.imageX = x - this.offsetX;
      this.imageY = y - this.offsetY;
      this.drawCanvas();
      return;
    }

    if (this.isDraggingText) {
      this.textX = x - this.offsetX;
      this.textY = y - this.offsetY;
      this.drawCanvas();
    }
  }

  handlePointerUp() {
    this.isDraggingText = false;
    this.isDraggingImage = false;
    this.isResizingImage = false;
  }

  // Coordinate helpers
  getCanvasCoords(event: MouseEvent) {
    const canvas = this.canvasEl.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  getCanvasTouchCoords(touch: Touch) {
    const canvas = this.canvasEl.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  getCanvasPreview(): string | null {
    if (!this.canvasEl || !this.canvasEl.nativeElement) {
      return null;
    }
    return this.canvasEl.nativeElement.toDataURL("image/png");
  }
}
