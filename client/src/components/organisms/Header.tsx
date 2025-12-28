import { LogOut, Users } from "lucide-react";
import Button from "../atoms/Button";

interface HeaderProps {
  username: string;
  playerCount: number;
  onLogout: () => void;
}

const Header = ({ username, playerCount, onLogout }: HeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 md:px-8 shadow-md relative z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          2D Metaverse
        </h1>
        <div className="hidden md:flex items-center gap-2 text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full text-sm border border-gray-700">
          <Users size={16} />
          <span>{playerCount} Players Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">{username}</p>
          <p className="text-xs text-blue-400">Green Room</p>
        </div>
        <Button variant="danger" size="sm" onClick={onLogout} className="gap-2">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
