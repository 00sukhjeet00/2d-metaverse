import React from "react";
import { Users, Edit2, Trash2, Lock } from "lucide-react";
import Avatar from "../atoms/Avatar";

interface Player {
  username: string;
  avatar: string;
}

interface RoomCardProps {
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  players: Player[];
  isCreator: boolean;
  isPrivate?: boolean;
  onJoin: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const RoomCard = ({
  name,
  currentPlayers,
  maxPlayers,
  players,
  isCreator,
  isPrivate = false,
  onJoin,
  onEdit,
  onDelete,
}: RoomCardProps) => {
  return (
    <div
      onClick={onJoin}
      className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:ring-2 hover:ring-purple-500 transition border border-gray-700 hover:border-transparent group relative flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition line-clamp-1">
            {name}
          </h3>
          {isPrivate && (
            <div className="flex items-center justify-center w-6 h-6 bg-purple-500/20 rounded-lg">
              <Lock size={14} className="text-purple-400" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCreator && (
            <div className="flex gap-1.5">
              <button
                onClick={onEdit}
                className="p-1.5 bg-gray-900 text-gray-400 hover:text-purple-400 hover:bg-gray-700 rounded-lg transition"
                title="Edit Room"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 bg-gray-900 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition"
                title="Delete Room"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-400 bg-gray-900 px-2 py-1 rounded text-sm">
            <Users size={14} />
            <span>
              {currentPlayers}/{maxPlayers}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <div className="flex -space-x-2 overflow-hidden">
          {players.slice(0, 3).map((player, i) => (
            <Avatar
              key={i}
              initial={player.username.charAt(0)}
              title={`${player.username} (${player.avatar})`}
            />
          ))}
          {currentPlayers > 3 && (
            <Avatar initial={`+${currentPlayers - 3}`} variant="gray" />
          )}
        </div>
        {currentPlayers === 0 && (
          <span className="text-gray-600 text-sm italic ml-1">Empty room</span>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
