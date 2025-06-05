import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import { ChatMessage as ChatMessageType, sendMessageToOpenAI, generateMessageId } from '@/utils/openai';
import { MessageCircle, AlertCircle } from 'lucide-react';

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  console.log('Index component render - messages count:', messages.length, 'isLoading:', isLoading);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessageType = {
        id: generateMessageId(),
        role: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      console.log('Added welcome message');
    }
  }, []);
  
  const handleSendMessage = async (content: string) => {
    console.log('Sending message:', content);
    
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      toast({
        title: "Configuration Required",
        description: "Please add your OpenAI API key to the environment variables (VITE_OPENAI_API_KEY).",
        variant: "destructive",
      });
      return;
    }
    
    const userMessage: ChatMessageType = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      console.log('Calling OpenAI API...');
      const response = await sendMessageToOpenAI(updatedMessages);
      
      const assistantMessage: ChatMessageType = {
        id: generateMessageId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, assistantMessage]);
      console.log('Message sent successfully');
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Invalid API key. Please check your OpenAI API key configuration.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'API quota exceeded. Please check your OpenAI account.';
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Chatbot</h1>
              <p className="text-sm text-gray-500">Powered by OpenAI</p>
            </div>
          </div>
        </div>
        
        {/* API Key Warning */}
        {!import.meta.env.VITE_OPENAI_API_KEY && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Configuration Required:</strong> Please add your OpenAI API key as VITE_OPENAI_API_KEY in your environment variables.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;