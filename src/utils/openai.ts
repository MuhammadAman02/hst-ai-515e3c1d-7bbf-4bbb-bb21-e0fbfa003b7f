import OpenAI from 'openai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

let openaiClient: OpenAI | null = null;

const getOpenAIClient = () => {
  console.log('Getting OpenAI client...');
  
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
    
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    console.log('OpenAI client initialized');
  }
  
  return openaiClient;
};

export const sendMessageToOpenAI = async (messages: ChatMessage[]): Promise<string> => {
  console.log('Sending message to OpenAI...', messages);
  
  try {
    const client = getOpenAIClient();
    
    const openAIMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));
    
    console.log('Formatted messages for OpenAI:', openAIMessages);
    
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: openAIMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    console.log('OpenAI response:', completion);
    
    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    console.log('Extracted response:', response);
    
    return response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export const generateMessageId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};