import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import Header from "../../components/organisms/Header";
import ChatBox from "../../components/organisms/ChatBox";
import GameCanvas from "../../components/GameCanvas";
import { SOCKET_EVENTS, APP_ROUTES } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/atoms/Button";

import { io } from "socket.io-client";

const GamePage = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef<any>(null);

  const { user, logout } = useAuth();

  const [players, setPlayers] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [syncedUser, setSyncedUser] = useState<any>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Initialize Socket.io
  useEffect(() => {
    if (!user) {
      navigate(APP_ROUTES.LOGIN);
      return;
    }

    // Connect to the real server
    console.log("Connecting to socket server...");
    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
      {
        reconnectionAttempts: 5,
        timeout: 10000,
      }
    );
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      setIsConnected(true);
      // Join the room after connection with optional passcode
      const passcode = (location.state as any)?.passcode;
      socket.emit(SOCKET_EVENTS.JOIN, {
        userId: user.id,
        room: roomId,
        passcode,
      });
    });

    socket.on(SOCKET_EVENTS.JOIN_SUCCESS, (data: any) => {
      console.log("Join success, synced position:", data.position);
      setSyncedUser(data);
    });

    socket.on(SOCKET_EVENTS.JOIN_ERROR, (errorMessage: string) => {
      console.error("Join error:", errorMessage);
      setJoinError(errorMessage);
      // Navigate back to rooms after a short delay
      setTimeout(() => {
        navigate(APP_ROUTES.ROOMS);
      }, 3000);
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
      const playersObj: Record<string, any> = {};
      playersList.forEach((p) => {
        playersObj[p.id] = p;
      });
      setPlayers(playersObj);
    });

    socket.on("playerJoined", (newPlayer: any) => {
      setPlayers((prev) => ({
        ...prev,
        [newPlayer.id]: newPlayer,
      }));
    });

    socket.on("playerLeft", (playerId: string) => {
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
  }, [user, roomId, navigate, location]);

  const handleSendMessage = (text: string) => {
    socketRef.current?.emit(SOCKET_EVENTS.CHAT_MESSAGE, { message: text });
  };

  const handleLeaveGame = () => {
    navigate(APP_ROUTES.ROOMS);
  };

  if (!user) return null;

  // Show error message if join failed
  if (joinError) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-300 mb-2">{joinError}</p>
          <p className="text-gray-500 text-sm">Redirecting to rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      <Header
        username={user.username}
        playerCount={Object.keys(players).length + 1}
        onLogout={logout}
      />

      {/* Debug Overlay */}
      <div className="absolute top-20 right-4 z-40 bg-gray-900/80 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] text-gray-400 pointer-events-none border border-gray-800 flex flex-col gap-1 shadow-2xl">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                : "bg-red-500"
            }`}
          />
          <span className="font-bold uppercase tracking-widest">
            {isConnected ? "Live Sync" : "Connection Lost"}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>ROOM LOAD</span>
          <span className="text-white font-mono">
            {Object.keys(players).length + 1} ENTITIES
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative flex flex-col bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
          {/* Back button overlay */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLeaveGame}
            className="absolute top-4 left-4 z-30 !bg-gray-900/50 backdrop-blur-md border border-gray-700/50 hover:!bg-gray-800 transition-all group scale-90"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span className="ml-2 font-bold tracking-tight">ABANDON WORLD</span>
          </Button>

          <GameCanvas
            user={syncedUser || user}
            players={players}
            socket={socketRef.current}
          />
        </div>

        {showChat ? (
          <div className="absolute md:relative inset-y-0 right-0 z-30 w-full md:w-80 h-full animate-in slide-in-from-right duration-300">
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              onClose={() => setShowChat(false)}
            />
          </div>
        ) : (
          <Button
            onClick={() => setShowChat(true)}
            variant="primary"
            className="absolute bottom-6 right-6 z-30 h-12 w-12 !rounded-full !p-0 shadow-2xl animate-bounce hover:animate-none"
          >
            <MessageSquare size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
