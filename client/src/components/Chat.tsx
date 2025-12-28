import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface Message {
  username: string;
  message: string;
  timestamp: Date;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  onClose: () => void;
}

const Chat = ({ messages, onSendMessage, onClose }: ChatProps) => {
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
          <MessageCircle size={20} className="text-blue-400" />
          <h2 className="text-white font-semibold">Chat</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-400 font-semibold text-sm">
                {msg.username}
              </span>
              <span className="text-gray-500 text-xs text-right">
                {/* Handle both Date object and ISO string if coming from DB */}
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-white text-sm">{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
