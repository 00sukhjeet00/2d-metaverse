import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { LogOut } from "lucide-react";
import Header from "../components/Header";
import Chat from "../components/Chat";
import GameCanvas from "../components/GameCanvas";
import { SOCKET_EVENTS, APP_ROUTES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

interface GamePageProps {
  user?: any; // Optional if passed, but context preferred
}

const GamePage = ({ user: propUser }: GamePageProps) => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  const { user: contextUser, logout } = useAuth();
  const user = propUser || contextUser;

  const handleLogout = () => {
    logout();
  };

  const [players, setPlayers] = useState({});
  const [messages, setMessages] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);

  // Initialize Socket.io
  useEffect(() => {
    if (!user) {
      navigate(APP_ROUTES.LOGIN);
      return;
    }

    // Simulating socket connection
    // const socket = io('http://localhost:3000');

    const socket = {
      emit: (event: string, data: any) => {
        console.log("Socket emit:", event, data);
        // Simulation loopback for chat
        if (event === SOCKET_EVENTS.CHAT_MESSAGE) {
          // Simulated local echo if needed, or rely on optimistic update
        }
      },
      on: (event: string, callback: any) =>
        console.log("Socket on registered:", event),
    };

    socketRef.current = socket;

    // Join the room
    socket.emit(SOCKET_EVENTS.JOIN, { userId: user.id, room: roomId });

    // Real socket listeners would go here
    // socket.on('currentPlayer', (activePlayers) => setPlayers(activePlayers));
    // socket.on('playerMoved', (data) => setPlayers(prev => ({...prev, [data.id]: {...prev[data.id], position: data.position}})));
    // socket.on('chatMessage', (msg) => setMessages(prev => [...prev, msg]));

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE, { userId: user.id, room: roomId });
      // socket.disconnect();
    };
  }, [user, roomId, navigate]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      username: user.username,
      message: text,
      timestamp: new Date(),
    };

    // Optimistic update
    setMessages([...messages, newMessage]);
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
      {/* We might want a "Back to Rooms" button in Header? */}

      <div className="flex-1 flex max-h-[calc(100vh-64px)] relative">
        <GameCanvas user={user} players={players} socket={socketRef.current} />

        {/* Back button overlay? */}
        <button
          onClick={handleLeaveGame}
          className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700 z-10"
        >
          Back to Rooms
        </button>

        {showChat && (
          <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            onClose={() => setShowChat(false)}
          />
        )}

        {!showChat && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
          >
            <LogOut size={18} />
            Exit Game
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
