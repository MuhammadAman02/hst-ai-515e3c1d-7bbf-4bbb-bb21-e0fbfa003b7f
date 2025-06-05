import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  console.log('Showing typing indicator');
  
  return (
    <div className="flex gap-3 p-4 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
        <Bot className="w-4 h-4 text-gray-300" />
      </div>
      
      <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-2xl px-4 py-2 shadow-lg">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;