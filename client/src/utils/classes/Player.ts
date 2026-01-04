export class Player {
  position: { x: number; y: number };
  username: string;
  isCurrentPlayer: boolean;

  constructor({
    position,
    username,
    isCurrentPlayer = false,
  }: {
    position: { x: number; y: number };
    username: string;
    isCurrentPlayer?: boolean;
  }) {
    this.position = position;
    this.username = username;
    this.isCurrentPlayer = isCurrentPlayer;
  }

  draw(c: CanvasRenderingContext2D) {
    const x = this.position.x;
    const y = this.position.y;

    // Draw shadow
    c.fillStyle = "rgba(0,0,0,0.3)";
    c.beginPath();
    c.ellipse(x, y + 25, 15, 5, 0, 0, Math.PI * 2);
    c.fill();

    // Draw body
    c.fillStyle = this.isCurrentPlayer ? "#9333ea" : "#4ade80"; // Current: Purple, Others: Green
    c.beginPath();
    c.arc(x, y, 20, 0, Math.PI * 2);
    c.fill();

    // Draw eyes
    c.fillStyle = "#fff";
    c.beginPath();
    c.arc(x - 7, y - 5, 4, 0, Math.PI * 2);
    c.arc(x + 7, y - 5, 4, 0, Math.PI * 2);
    c.fill();

    // Draw pupils
    c.fillStyle = "#000";
    c.beginPath();
    c.arc(x - 7, y - 5, 2, 0, Math.PI * 2);
    c.arc(x + 7, y - 5, 2, 0, Math.PI * 2);
    c.fill();

    // Draw username
    c.fillStyle = "#fff";
    c.font = "12px Arial";
    c.textAlign = "center";
    c.fillText(this.username, x, y - 30);
  }
}
