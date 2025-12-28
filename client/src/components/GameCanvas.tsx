import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRID_SIZE,
  MOVE_SPEED,
  ANIMATION_FRAME_RATE,
  SOCKET_EVENTS,
} from "../utils/constants";

interface GameCanvasProps {
  user: any;
  players: any;
  socket: any;
}

const GameCanvas = ({ user, players, socket }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const playerPos = useRef(user.position || { x: 400, y: 300 });

  // Sync position if user data is updated (e.g. from joinSuccess)
  useEffect(() => {
    if (user?.position) {
      playerPos.current = user.position;
    }
  }, [user]);

  const animationFrame = useRef<any>(null);

  const drawPlayer = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    username: string,
    isCurrentPlayer = false
  ) => {
    // Draw shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw body
    ctx.fillStyle = isCurrentPlayer ? "#4a90e2" : "#e74c3c";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - 7, y - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw pupils
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x - 7, y - 5, 2, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw username
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(username, x, y - 30);
  };

  // Canvas rendering
  useEffect(() => {
    if (!user || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "#16213e";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw other players
      Object.values(players).forEach((player: any) => {
        drawPlayer(ctx, player.position.x, player.position.y, player.username);
      });

      // Draw current player
      drawPlayer(
        ctx,
        playerPos.current.x,
        playerPos.current.y,
        user.username,
        true
      );

      animationFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [user, players]);

  // Player movement
  useEffect(() => {
    if (!user) return;

    const gameLoop = setInterval(() => {
      let moved = false;
      let newX = playerPos.current.x;
      let newY = playerPos.current.y;

      if (keysPressed.current["ArrowUp"] || keysPressed.current["w"]) {
        newY -= MOVE_SPEED;
        moved = true;
      }
      if (keysPressed.current["ArrowDown"] || keysPressed.current["s"]) {
        newY += MOVE_SPEED;
        moved = true;
      }
      if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"]) {
        newX -= MOVE_SPEED;
        moved = true;
      }
      if (keysPressed.current["ArrowRight"] || keysPressed.current["d"]) {
        newX += MOVE_SPEED;
        moved = true;
      }

      // Boundary check
      newX = Math.max(20, Math.min(CANVAS_WIDTH - 20, newX));
      newY = Math.max(20, Math.min(CANVAS_HEIGHT - 20, newY));

      if (moved) {
        playerPos.current = { x: newX, y: newY };
        socket?.emit(SOCKET_EVENTS.MOVE, { position: playerPos.current });
      }
    }, ANIMATION_FRAME_RATE);

    return () => clearInterval(gameLoop);
  }, [user, socket]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't move if typing in an input field (e.g. Chat)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      keysPressed.current[e.key] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="bg-gray-800 rounded-lg p-2 md:p-4 w-full max-w-[1240px] shadow-2xl border border-gray-700">
        <div className="relative w-full aspect-[1200/520] bg-gray-900 rounded overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>
        <div className="mt-2 md:mt-4 text-gray-400 text-xs md:text-sm text-center">
          Use arrow keys or WASD to move around
        </div>
      </div>
    </div>
  );
};
// End of component

export default GameCanvas;
