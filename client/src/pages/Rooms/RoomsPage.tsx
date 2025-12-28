import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DEFAULT_MAX_PLAYERS,
  API_ENDPOINTS,
  APP_ROUTES,
} from "../../utils/constants";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/atoms/Button";
import FormField from "../../components/molecules/FormField";
import RoomCard from "../../components/molecules/RoomCard";
import Header from "../../components/organisms/Header";

interface Room {
  id: string;
  _id?: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  createdBy: string;
  players: { username: string; avatar: string }[];
}

const RoomsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(DEFAULT_MAX_PLAYERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const transformRoom = (serverRoom: any): Room => ({
    id: serverRoom._id,
    name: serverRoom.name,
    maxPlayers: serverRoom.maxPlayers,
    createdBy: serverRoom.createdBy,
    players: serverRoom.activePlayers
      ? serverRoom.activePlayers.map((p: any) => ({
          username: p.username,
          avatar: p.avatar,
        }))
      : [],
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

      const newRoom = transformRoom(response.data);
      setRooms([...rooms, newRoom]);
      closeModal();
    } catch (err: any) {
      console.error("Failed to create room", err);
      setError(err.response?.data?.error || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await api.delete(`${API_ENDPOINTS.ROOMS}/${roomId}`);
      setRooms(rooms.filter((r) => r.id !== roomId));
    } catch (err: any) {
      console.error("Failed to delete room", err);
      alert(err.response?.data?.error || "Failed to delete room");
    }
  };

  const openEditModal = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setEditingRoom(room);
    setNewRoomName(room.name);
    setMaxPlayers(room.maxPlayers);
    setShowModal(true);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom || !newRoomName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.put(
        `${API_ENDPOINTS.ROOMS}/${editingRoom.id}`,
        {
          name: newRoomName,
          maxPlayers: maxPlayers,
        }
      );

      const updatedRoom = transformRoom(response.data);
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? updatedRoom : r)));
      closeModal();
    } catch (err: any) {
      console.error("Failed to update room", err);
      setError(err.response?.data?.error || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setNewRoomName("");
    setMaxPlayers(DEFAULT_MAX_PLAYERS);
    setError("");
  };

  const totalPlayersOnline = rooms.reduce(
    (acc, room) => acc + room.currentPlayers,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header
        username={user?.username || "Explorer"}
        playerCount={totalPlayersOnline}
        onLogout={logout}
      />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Explore the Universe
          </h2>
          <p className="text-gray-400">
            Choose a world to join or create your own sanctuary.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create New Room Card */}
          <button
            onClick={() => setShowModal(true)}
            className="h-full min-h-[180px] border-2 border-dashed border-gray-700/50 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all duration-300 group shadow-lg"
          >
            <div className="p-4 rounded-full bg-gray-800 group-hover:bg-purple-500/20 mb-3 transition-colors duration-300">
              <Plus size={32} />
            </div>
            <span className="font-bold tracking-wide">Create New World</span>
          </button>

          {/* Existing Rooms */}
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              name={room.name}
              currentPlayers={room.currentPlayers}
              maxPlayers={room.maxPlayers}
              players={room.players}
              isCreator={room.createdBy === user?.id}
              onJoin={() => handleJoinRoom(room)}
              onEdit={(e) => openEditModal(e, room)}
              onDelete={(e) => handleDeleteRoom(e, room.id)}
            />
          ))}
        </div>
      </main>

      {/* Room Modal (Create/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-md transition-all">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl border border-gray-700 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-1 hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight">
              {editingRoom ? "Refine Your World" : "Forge a New World"}
            </h2>

            <div className="space-y-6">
              <FormField
                label="World Name"
                placeholder="e.g. Neon District"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />

              <FormField
                label="Max Population"
                type="number"
                min="2"
                max="100"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />

              <div className="flex gap-4 mt-10">
                <Button variant="ghost" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
                  loading={loading}
                  className="flex-1"
                >
                  {editingRoom ? "Update World" : "Ignite World"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
