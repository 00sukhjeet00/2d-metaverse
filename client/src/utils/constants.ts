export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 520;
export const GRID_SIZE = 50;
export const MOVE_SPEED = 3;
export const ANIMATION_FRAME_RATE = 16;

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN: "join",
  LEAVE: "leave",
  MOVE: "move",
  CHAT_MESSAGE: "chatMessage",
  CURRENT_PLAYER: "currentPlayer",
  PLAYER_MOVED: "playerMoved",
  JOIN_SUCCESS: "joinSuccess",
  JOIN_ERROR: "joinError",
  PLAYER_COUNT_UPDATE: "playerCountUpdate",
};

export const DEFAULT_MAX_PLAYERS = 50;
export const APP_ROUTES = {
  LOGIN: "/login",
  ROOMS: "/rooms",
  GAME: "/room/:id",
  // Helper to generate game path with ID
  GAME_PATH: (id: string) => `/room/${id}`,
};

export const STORAGE_KEYS = {
  USER: "metaverse_user",
  TOKEN: "metaverse_token",
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  ROOMS: "/rooms",
};
