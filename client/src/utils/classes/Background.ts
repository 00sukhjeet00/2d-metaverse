export class Background {
  position: { x: number; y: number };
  image: HTMLImageElement | null;
  width: number;
  height: number;

  constructor({
    position,
    imageSrc,
    width = 0,
    height = 0,
    onLoad,
  }: {
    position: { x: number; y: number };
    imageSrc?: string;
    width?: number;
    height?: number;
    onLoad?: (img: HTMLImageElement) => void;
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = null;

    if (imageSrc) {
      this.setImage(imageSrc, onLoad);
    }
  }

  setImage(src: string, onLoad?: (img: HTMLImageElement) => void) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.image = img;
      if (onLoad) {
        onLoad(img);
      }
    };
  }

  draw(c: CanvasRenderingContext2D, cameraOffset = { x: 0, y: 0 }) {
    if (this.image) {
      c.save();
      c.translate(-cameraOffset.x, -cameraOffset.y);
      c.drawImage(this.image, this.position.x, this.position.y);
      c.restore();
    }
  }
}
