import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { InspectionReport, DefectItem, AQLData, ConformityItem, ChecklistItem, TestItem, MeasurementRow, PhotoItem, ShipmentItem } from '@/data/reportData';

type Msg = { role: 'user' | 'assistant'; content: string };

interface ReportContext {
  report: InspectionReport;
  defects: DefectItem[];
  aql: AQLData;
  conformity: ConformityItem[];
  packagingChecklist: ChecklistItem[];
  tests: TestItem[];
  measurements: MeasurementRow[];
  photos: PhotoItem[];
  cartonData: any;
  shipmentItems: ShipmentItem[];
}

const QUICK_ACTIONS = [
  { label: 'Summarize report', message: 'Summarize the key findings of this inspection in 3-5 bullet points.' },
  { label: 'Show all defects', message: 'List all defects found, grouped by severity, with quantities.' },
  { label: 'Risk assessment', message: 'What are the key risk factors in this inspection? Present the facts for a ship/no-ship decision.' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/inspection-chat`;

async function streamChat({
  messages,
  reportContext,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  reportContext: ReportContext;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, reportContext }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: 'Unknown error' }));
    onError(body.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) { onError('No response stream'); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf('\n')) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + '\n' + buf;
        break;
      }
    }
  }
  onDone();
}

export function InspectionAssistant({ reportContext }: { reportContext: ReportContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updated,
        reportContext,
        onDelta: upsert,
        onDone: () => setLoading(false),
        onError: (err) => {
          setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err}` }]);
          setLoading(false);
        },
      });
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please try again.' }]);
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Inspection Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as any}>
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center mt-4 mb-6">
              Ask anything about this inspection report. I'll answer using only the report data.
            </p>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => send(a.message)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick actions when conversation started */}
      {messages.length > 0 && !loading && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => send(a.message)}
              className="text-xs px-2.5 py-1 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this inspection…"
            disabled={loading}
            className="flex-1 rounded-xl"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-xl shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
