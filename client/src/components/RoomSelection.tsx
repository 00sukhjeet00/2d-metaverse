import { useState, useEffect } from "react";
import { Plus, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DEFAULT_MAX_PLAYERS,
  API_ENDPOINTS,
  APP_ROUTES,
} from "../utils/constants";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

interface Room {
  id: string; // Server uses _id, but we might receive id or _id. Let's map it.
  _id?: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
}

interface RoomSelectionProps {
  username?: string; // Optional if passed from parent, but we prefer context
}

const RoomSelection = ({ username: propUsername }: RoomSelectionProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const username = propUsername || user?.username;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(DEFAULT_MAX_PLAYERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const transformRoom = (serverRoom: any): Room => ({
    id: serverRoom._id,
    name: serverRoom.name,
    maxPlayers: serverRoom.maxPlayers,
    currentPlayers: serverRoom.activePlayers
      ? serverRoom.activePlayers.length
      : 0,
  });

  const fetchRooms = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ROOMS);
      const serverRooms = response.data;
      if (Array.isArray(serverRooms)) {
        setRooms(serverRooms.map(transformRoom));
      }
    } catch (err) {
      console.error("Failed to fetch rooms", err);
      setError("Failed to load rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleJoinRoom = (room: Room) => {
    navigate(APP_ROUTES.GAME_PATH(room.id));
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post(API_ENDPOINTS.ROOMS, {
        name: newRoomName,
        maxPlayers: maxPlayers,
      });

      // Add new room to list or refetch
      const newRoom = transformRoom(response.data);
      setRooms([...rooms, newRoom]);
      setShowModal(false);
      setNewRoomName("");
    } catch (err: any) {
      console.error("Failed to create room", err);
      setError(err.response?.data?.error || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Select a Room</h1>
          <p className="text-gray-400">Welcome, {username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-400 bg-red-900/20 p-3 rounded">
          {error}
        </div>
      )}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Room Card */}
        <button
          onClick={() => setShowModal(true)}
          className="h-48 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition group"
        >
          <div className="p-4 rounded-full bg-gray-800 group-hover:bg-blue-500/10 mb-4 transition">
            <Plus size={32} />
          </div>
          <span className="font-semibold">Create New Room</span>
        </button>

        {/* Existing Rooms */}
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleJoinRoom(room)}
            className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:ring-2 hover:ring-blue-500 transition border border-gray-700 hover:border-transparent group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                {room.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-400 bg-gray-900 px-2 py-1 rounded text-sm">
                <Users size={14} />
                <span>
                  {room.currentPlayers}/{room.maxPlayers}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {/* Mock avatars for visual consistency */}
                {[...Array(Math.min(3, room.currentPlayers))].map((_, i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800 bg-gray-600"
                  />
                ))}
                {room.currentPlayers > 3 && (
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800 bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-medium">
                    +{room.currentPlayers - 3}
                  </div>
                )}
              </div>
              {room.currentPlayers === 0 && (
                <span className="text-gray-600 text-sm">Empty room</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Create New Room
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g. My Awesome World"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Max Players
                </label>
                <input
                  type="number"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  min="2"
                  max="100"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-lg font-semibold text-gray-400 hover:text-white hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Room"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelection;
