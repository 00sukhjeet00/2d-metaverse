import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import Header from "../components/Header";
import Chat from "../components/Chat";
import GameCanvas from "../components/GameCanvas";
import { SOCKET_EVENTS, APP_ROUTES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

import { io } from "socket.io-client";

interface GamePageProps {
  user?: any; // Optional if passed, but context preferred
}

const GamePage = ({ user: propUser }: GamePageProps) => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<any>(null);

  const { user: contextUser, logout } = useAuth();
  const user = propUser || contextUser;

  const handleLogout = () => {
    logout();
  };

  const [players, setPlayers] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Socket.io
  useEffect(() => {
    if (!user) {
      navigate(APP_ROUTES.LOGIN);
      return;
    }

    // Connect to the real server
    console.log("Connecting to socket server...");
    const socket = io("http://localhost:3000", {
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      setIsConnected(true);
      // Join the room after connection
      socket.emit(SOCKET_EVENTS.JOIN, { userId: user.id, room: roomId });
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.CURRENT_PLAYER, (playersList: any[]) => {
      console.log("Received current players:", playersList);
      const playersObj: Record<string, any> = {};
      playersList.forEach((p) => {
        playersObj[p.id] = p;
      });
      setPlayers(playersObj);
    });

    socket.on("playerJoined", (newPlayer: any) => {
      console.log("A new player joined:", newPlayer);
      setPlayers((prev) => ({
        ...prev,
        [newPlayer.id]: newPlayer,
      }));
    });

    socket.on("playerLeft", (playerId: string) => {
      console.log("Player left:", playerId);
      setPlayers((prev) => {
        const next = { ...prev };
        delete next[playerId];
        return next;
      });
    });

    socket.on(SOCKET_EVENTS.PLAYER_MOVED, (data: any) => {
      setPlayers((prev) => ({
        ...prev,
        [data.id]: { ...(prev[data.id] || {}), position: data.position },
      }));
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE, { userId: user.id, room: roomId });
      socket.disconnect();
    };
  }, [user, roomId, navigate]);

  const handleSendMessage = (text: string) => {
    // Only emit to socket. The server will broadcast it back to us,
    // ensuring we don't have duplicates and have the correct server timestamp.
    socketRef.current?.emit(SOCKET_EVENTS.CHAT_MESSAGE, { message: text });
  };

  const handleLeaveGame = () => {
    // Navigate back to rooms list
    navigate(APP_ROUTES.ROOMS);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header
        username={user.username}
        playerCount={Object.keys(players).length + 1}
        onLogout={handleLogout}
      />

      {/* Debug Overlay */}
      <div className="absolute top-20 right-4 z-50 bg-black/50 p-2 rounded text-xs text-white pointer-events-none">
        <div>
          Status:{" "}
          <span className={isConnected ? "text-green-500" : "text-red-500"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div>Other Players: {Object.keys(players).length}</div>
        {Object.keys(players).length > 0 && (
          <ul className="mt-1">
            {Object.values(players).map((p) => (
              <li key={p.id}>
                {p.username} ({p.id.slice(0, 4)})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-h-[calc(100vh-64px)] relative overflow-hidden">
        <div className="flex-1 relative flex flex-col min-h-0">
          {/* Back button overlay */}
          <button
            onClick={handleLeaveGame}
            className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-all z-10 border border-gray-600 flex items-center gap-2"
          >
            <span className="text-xl">←</span>
            <span className="hidden sm:inline">Back to Rooms</span>
          </button>

          <GameCanvas
            user={user}
            players={players}
            socket={socketRef.current}
          />
        </div>

        {showChat ? (
          <div className="w-full md:w-80 h-1/3 md:h-full transition-all">
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              onClose={() => setShowChat(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-10"
          >
            <LogOut className="rotate-180" size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
