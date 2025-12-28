import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

interface Message {
  username: string;
  message: string;
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  onClose: () => void;
}

const ChatBox = ({ messages, onSendMessage, onClose }: ChatBoxProps) => {
  const [chatInput, setChatInput] = useState("");

  const handleSend = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full md:w-80 bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col h-full shadow-xl">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <MessageCircle size={18} className="text-blue-400" />
          </div>
          <h2 className="text-white font-bold">World Chat</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">
                {msg.username}
              </span>
              <span className="text-gray-500 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="bg-gray-700/50 rounded-2xl rounded-tl-none p-3 border border-gray-700/50 shadow-sm">
              <p className="text-gray-200 text-sm leading-relaxed">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Say something..."
            className="flex-1 !py-2 !px-3 text-sm"
          />
          <Button
            onClick={handleSend}
            variant="primary"
            size="sm"
            className="!px-3"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
