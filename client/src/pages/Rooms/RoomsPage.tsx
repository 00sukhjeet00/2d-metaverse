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
  isPrivate: boolean;
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
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [joiningRoom, setJoiningRoom] = useState<Room | null>(null);
  const [inputPasscode, setInputPasscode] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  const transformRoom = (serverRoom: any): Room => ({
    id: serverRoom._id,
    name: serverRoom.name,
    maxPlayers: serverRoom.maxPlayers,
    createdBy: serverRoom.createdBy,
    isPrivate: serverRoom.isPrivate || false,
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
    if (room.isPrivate && room.createdBy !== user?.id) {
      setJoiningRoom(room);
      setShowPasscodeModal(true);
      return;
    }
    navigate(APP_ROUTES.GAME_PATH(room.id));
  };

  const submitPasscode = () => {
    if (!joiningRoom || !inputPasscode.trim()) return;
    navigate(APP_ROUTES.GAME_PATH(joiningRoom.id), {
      state: { passcode: inputPasscode },
    });
    setShowPasscodeModal(false);
    setJoiningRoom(null);
    setInputPasscode("");
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    if (isPrivate && !passcode.trim()) {
      setError("Passcode is required for private rooms");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(API_ENDPOINTS.ROOMS, {
        name: newRoomName,
        maxPlayers: maxPlayers,
        isPrivate: isPrivate,
        passcode: passcode,
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
          isPrivate: isPrivate,
          passcode: passcode,
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
    setIsPrivate(room.isPrivate);
    setPasscode(""); // Don't show old passcode for security, user can set new one
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setNewRoomName("");
    setMaxPlayers(DEFAULT_MAX_PLAYERS);
    setIsPrivate(false);
    setPasscode("");
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

              <div className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-xl border border-gray-700">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor="isPrivate"
                  className="text-sm font-medium text-gray-200 cursor-pointer"
                >
                  Make this World Private
                </label>
              </div>

              {isPrivate && (
                <FormField
                  label="Security Passcode"
                  type="password"
                  placeholder="Set a secret code"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              )}

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

      {/* Passcode Entry Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center p-4 z-[60] backdrop-blur-xl transition-all">
          <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl border border-gray-700 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setShowPasscodeModal(false);
                setJoiningRoom(null);
                setInputPasscode("");
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-1 hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
              Access Restricted
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              This world is protected. Enter the passcode to proceed.
            </p>

            <div className="space-y-6">
              <FormField
                label="Passcode"
                type="password"
                placeholder="Enter world passcode"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                autoFocus
              />

              <div className="flex gap-4 mt-8">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowPasscodeModal(false);
                    setJoiningRoom(null);
                    setInputPasscode("");
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={submitPasscode} className="flex-1">
                  Enter World
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
