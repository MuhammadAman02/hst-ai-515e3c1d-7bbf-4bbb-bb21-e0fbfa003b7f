import { ChatMessage as ChatMessageType } from '@/utils/openai';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  console.log('Rendering message:', message);
  
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 p-4 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
        isUser ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-700'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-gray-300" />
        )}
      </div>
      
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-lg ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
          : 'bg-gray-800 text-gray-100 border border-gray-700'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <div className={`text-xs mt-1 opacity-70 ${
          isUser ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;