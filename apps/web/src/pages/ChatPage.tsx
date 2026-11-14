import { useState, useRef, useEffect } from 'react';
import { streamChat } from '../api';
import type { ChatMessage } from '@doorspeaks/shared';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const SUGGESTIONS = [
  'Can my landlord keep my full deposit?',
  'What is the notice period before eviction in Bangalore?',
  'Is a 10-month deposit legal in Koramangala?',
  'Can my landlord enter without informing me?',
  'What documents should I ask for before renting?',
  'Can my landlord charge commercial electricity rates?',
];

type UIMessage = ChatMessage & {
  id: string;
  sources?: { slug: string; title: string }[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAI, setCurrentAI] = useState('');
  const [currentSources, setCurrentSources] = useState<{ slug: string; title: string }[]>([]);
  const cancelRef = useRef<(() => void) | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentAI]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);
    setCurrentAI('');
    setCurrentSources([]);

    let accumulated = '';
    let sources: { slug: string; title: string }[] = [];

    const cancel = streamChat(
      updatedMessages.map(({ role, content }) => ({ role, content })),
      (event) => {
        if (event.type === 'text') {
          accumulated += event.text;
          setCurrentAI(accumulated);
        } else if (event.type === 'sources') {
          sources = event.sources;
          setCurrentSources(sources);
        } else if (event.type === 'done') {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: accumulated,
              sources,
            },
          ]);
          setCurrentAI('');
          setCurrentSources([]);
          setIsStreaming(false);
          cancelRef.current = null;
          inputRef.current?.focus();
        } else if (event.type === 'error') {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: `❌ Error: ${event.error}`,
            },
          ]);
          setCurrentAI('');
          setIsStreaming(false);
          cancelRef.current = null;
        }
      }
    );
    cancelRef.current = cancel;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = () => {
    if (cancelRef.current) { cancelRef.current(); cancelRef.current = null; }
    setMessages([]);
    setCurrentAI('');
    setIsStreaming(false);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-4rem)] max-h-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Ask anything about renting in Bangalore</p>
        </div>
        <button onClick={handleClear} className="btn-secondary text-sm py-2">Clear chat</button>
      </div>

      {/* Legal notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 text-xs text-amber-800 dark:text-amber-300 shrink-0">
        ⚠️ AI responses are general information, not legal advice. Sources shown are from DoorSpeaks rights articles.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🤖</div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Ask me anything about renting in Bangalore</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-sm bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-full px-4 py-2 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col gap-2 max-w-xs md:max-w-2xl">
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Sources:</span>
                  {msg.sources.map((src) => (
                    <Link
                      key={src.slug}
                      to={`/rights/${src.slug}`}
                      className="text-xs bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700 rounded-full px-2 py-0.5 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                    >
                      {src.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming AI message */}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="flex flex-col gap-2 max-w-xs md:max-w-2xl">
              <div className="chat-bubble-ai">
                {currentAI ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {currentAI}
                    <span className="inline-block w-1.5 h-4 bg-teal-500 animate-pulse ml-0.5 align-text-bottom" />
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
                  </div>
                )}
              </div>
              {currentSources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Sources:</span>
                  {currentSources.map((src) => (
                    <Link
                      key={src.slug}
                      to={`/rights/${src.slug}`}
                      className="text-xs bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700 rounded-full px-2 py-0.5 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                    >
                      {src.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about deposits, eviction, rent, rights..."
          className="input flex-1"
          disabled={isStreaming}
          aria-label="Chat input"
        />
        <button type="submit" disabled={!input.trim() || isStreaming} className="btn-primary px-4 py-2">
          {isStreaming ? <LoadingSpinner size="sm" /> : '→'}
        </button>
      </form>
    </div>
  );
}
