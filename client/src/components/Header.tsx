import { Users, LogOut } from "lucide-react";

interface HeaderProps {
  username: string;
  playerCount: number;
  onLogout: () => void;
}

const Header = ({ username, playerCount, onLogout }: HeaderProps) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">2D Metaverse</h1>
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={18} />
          <span className="text-sm">{playerCount} online</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white font-semibold">{username}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          <LogOut size={18} />
          Exit
        </button>
      </div>
    </div>
  );
};

export default Header;
