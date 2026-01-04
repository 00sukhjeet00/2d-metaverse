import { useEffect, useRef } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRID_SIZE,
  MOVE_SPEED,
  ANIMATION_FRAME_RATE,
  SOCKET_EVENTS,
  PLAYER_RADIUS,
  CONTROLS,
} from "../utils/constants";
import { Boundary } from "../utils/classes/Boundary";
import { Background } from "../utils/classes/Background";
import { Player } from "../utils/classes/Player";

interface GameCanvasProps {
  user: any;
  players: any;
  socket: any;
  room?: any; // Add room prop
}

const GameCanvas = ({ user, players, socket, room }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const playerPos = useRef(user.position || { x: 400, y: 300 });
  const cameraOffset = useRef({ x: 0, y: 0 });

  // Game/Render objects refs
  const backgroundRef = useRef<Background | null>(null);
  const boundariesRef = useRef<Boundary[]>([]);

  // Load background and boundaries when room changes
  useEffect(() => {
    if (room?.backgroundImage) {
      backgroundRef.current = new Background({
        position: { x: 0, y: 0 },
        imageSrc: `${room.baseUrl}${room.backgroundImage}`,
        onLoad: (img) => {
          // Create boundaries only after image is loaded
          console.log(img.width / 4, img.height / 4);
          console.log("WIDTH: ", 12 * 4);
          if (room?.collisionArray) {
            const boundaries: Boundary[] = [];
            room.collisionArray.forEach((row: number[], rowIndex: number) => {
              row.forEach((cell: number, colIndex: number) => {
                if (cell !== 0) {
                  boundaries.push(
                    new Boundary({
                      position: {
                        x: colIndex * GRID_SIZE,
                        y: rowIndex * GRID_SIZE,
                      },
                      width: GRID_SIZE,
                      height: GRID_SIZE,
                    })
                  );
                }
              });
            });
            boundariesRef.current = boundaries;
          }
        },
      });
    } else {
      backgroundRef.current = null;
    }

    // Only create default boundaries immediately if NO background image
    if (!room?.backgroundImage && room?.collisionArray) {
      const boundaries: Boundary[] = [];
      room.collisionArray.forEach((row: number[], rowIndex: number) => {
        row.forEach((cell: number, colIndex: number) => {
          if (cell !== 0) {
            boundaries.push(
              new Boundary({
                position: {
                  x: colIndex * GRID_SIZE,
                  y: rowIndex * GRID_SIZE,
                },
                width: GRID_SIZE,
                height: GRID_SIZE,
              })
            );
          }
        });
      });
      boundariesRef.current = boundaries;
    } else {
      boundariesRef.current = [];
    }
  }, [room]); // Depend on the whole room object or specific fields

  // Sync position if user data is updated (e.g. from joinSuccess)
  useEffect(() => {
    if (user?.position) {
      playerPos.current = user.position;
    }
  }, [user]);

  const animationFrame = useRef<any>(null);

  // Initialize camera position to player position on load
  useEffect(() => {
    if (!canvasRef.current || !playerPos.current) return;

    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate target camera position (centered on player)
    let targetX = playerPos.current.x - centerX;
    let targetY = playerPos.current.y - centerY;

    // Get background dimensions
    const bg = backgroundRef.current;
    const bgWidth = bg?.image?.width || CANVAS_WIDTH;
    const bgHeight = bg?.image?.height || CANVAS_HEIGHT;

    // Calculate camera bounds
    const maxX = Math.max(0, bgWidth - canvas.width);
    const maxY = Math.max(0, bgHeight - canvas.height);

    // Clamp camera position to stay within bounds
    cameraOffset.current = {
      x: Math.max(0, Math.min(targetX, maxX)),
      y: Math.max(0, Math.min(targetY, maxY)),
    };
  }, [playerPos.current?.x, playerPos.current?.y]);

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

      // Draw Background Image with camera offset
      if (backgroundRef.current) {
        backgroundRef.current.draw(ctx, cameraOffset.current);
      }

      // Draw grid only if no background image
      if (!backgroundRef.current) {
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
      }

      // Draw Collision Boxes (Boundaries) with camera offset
      ctx.save();
      ctx.translate(-cameraOffset.current.x, -cameraOffset.current.y);
      boundariesRef.current.forEach((boundary) => {
        boundary.draw(ctx);
      });
      ctx.restore();

      // Apply camera transform for game objects
      ctx.save();
      ctx.translate(-cameraOffset.current.x, -cameraOffset.current.y);

      // Draw other players
      Object.values(players).forEach((player: any) => {
        const p = new Player({
          position: player.position,
          username: player.username,
          isCurrentPlayer: false,
        });
        p.draw(ctx);
      });

      // Draw current player
      const currentPlayer = new Player({
        position: playerPos.current,
        username: user.username,
        isCurrentPlayer: true,
      });
      currentPlayer.draw(ctx);

      ctx.restore();

      animationFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [user, players, room]); // Dependencies

  // Combined player and camera movement
  useEffect(() => {
    if (!user) return;

    const gameLoop = setInterval(() => {
      let moved = false;
      let newX = playerPos.current.x;
      let newY = playerPos.current.y;
      const moveSpeed = MOVE_SPEED;

      // Handle diagonal movement (normalize speed)
      const isUp = CONTROLS.UP.some((k) => keysPressed.current[k]);
      const isDown = CONTROLS.DOWN.some((k) => keysPressed.current[k]);
      const isLeft = CONTROLS.LEFT.some((k) => keysPressed.current[k]);
      const isRight = CONTROLS.RIGHT.some((k) => keysPressed.current[k]);

      const movingDiagonal =
        (isUp && isLeft) ||
        (isUp && isRight) ||
        (isDown && isLeft) ||
        (isDown && isRight);

      const speed = movingDiagonal ? moveSpeed * 0.7071 : moveSpeed; // 1/√2 for diagonal

      // Helper for collision detection
      const checkCollision = (x: number, y: number) => {
        const playerRadius = PLAYER_RADIUS;
        for (const boundary of boundariesRef.current) {
          if (
            x + playerRadius > boundary.position.x &&
            x - playerRadius < boundary.position.x + boundary.width &&
            y + playerRadius > boundary.position.y &&
            y - playerRadius < boundary.position.y + boundary.height
          ) {
            return true;
          }
        }
        return false;
      };

      // -- REFACTORING THE MOVEMENT LOGIC BLOCK --
      let nextX = playerPos.current.x;
      let nextY = playerPos.current.y;

      const isPressed = (keys: string[]) =>
        keys.some((k) => keysPressed.current[k]);

      if (isPressed(CONTROLS.UP)) {
        nextY -= speed;
        moved = true;
      }
      if (isPressed(CONTROLS.DOWN)) {
        nextY += speed;
        moved = true;
      }
      if (isPressed(CONTROLS.LEFT)) {
        nextX -= speed;
        moved = true;
      }
      if (isPressed(CONTROLS.RIGHT)) {
        nextX += speed;
        moved = true;
      }

      // Boundary check - use background dimensions if available
      const bg = backgroundRef.current;
      const bgWidth = bg?.image?.width || CANVAS_WIDTH;
      const bgHeight = bg?.image?.height || CANVAS_HEIGHT;

      // 1. Clamp to map bounds first
      nextX = Math.max(PLAYER_RADIUS, Math.min(bgWidth - PLAYER_RADIUS, nextX));
      nextY = Math.max(
        PLAYER_RADIUS,
        Math.min(bgHeight - PLAYER_RADIUS, nextY)
      );

      // 2. Check Object Collisions
      if (moved) {
        // Try X movement
        if (!checkCollision(nextX, playerPos.current.y)) {
          newX = nextX;
        } else {
          // Hit something on X, keep old X
          newX = playerPos.current.x;
        }

        // Try Y movement
        if (!checkCollision(newX, nextY)) {
          newY = nextY;
        } else {
          // Hit something on Y, keep old Y
          newY = playerPos.current.y;
        }
      }

      // Inside the game loop, right after updating player position:
      if (moved) {
        playerPos.current = { x: newX, y: newY };
        socket?.emit(SOCKET_EVENTS.MOVE, { position: playerPos.current });

        // Update camera position to follow player
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          // Calculate target camera position (centered on player)
          let targetX = newX - centerX;
          let targetY = newY - centerY;

          // Get background dimensions
          const bg = backgroundRef.current;
          const bgWidth = bg?.image?.width || CANVAS_WIDTH;
          const bgHeight = bg?.image?.height || CANVAS_HEIGHT;

          // Calculate camera bounds
          const maxX = Math.max(0, bgWidth - canvas.width);
          const maxY = Math.max(0, bgHeight - canvas.height);

          // Clamp camera position to stay within bounds
          cameraOffset.current = {
            x: Math.max(0, Math.min(targetX, maxX)),
            y: Math.max(0, Math.min(targetY, maxY)),
          };
        }
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

      // Prevent default scrolling for movement keys
      const allControlKeys = Object.values(CONTROLS).flat();
      if (allControlKeys.includes(e.key)) {
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
