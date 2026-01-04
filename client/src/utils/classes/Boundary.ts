export class Boundary {
  position: { x: number; y: number };
  width: number;
  height: number;

  constructor({
    position,
    width,
    height,
  }: {
    position: { x: number; y: number };
    width: number;
    height: number;
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "rgba(0, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
