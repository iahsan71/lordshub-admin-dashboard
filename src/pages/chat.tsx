import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Chat = {
  id: string;
  username: string;
  lastMessage: string;
  timestamp: string;
  status: "New" | "Payment Marked" | "Verified" | "Completed";
  unread: number;
};

type Message = { 
  id: string; 
  from: "admin" | "customer"; 
  text: string; 
  timestamp: string;
  type?: "text" | "image";
};

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      username: "Customer #1234",
      lastMessage: "I've sent the payment proof",
      timestamp: "2 min ago",
      status: "Payment Marked",
      unread: 2,
    },
    {
      id: "2",
      username: "Customer #5678",
      lastMessage: "When will I receive the account?",
      timestamp: "15 min ago",
      status: "Verified",
      unread: 0,
    },
    {
      id: "3",
      username: "Customer #9012",
      lastMessage: "I want to buy Lords Mobile account",
      timestamp: "1 hour ago",
      status: "New",
      unread: 1,
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", from: "customer", text: "Hi, I want to buy a Lords Mobile account", timestamp: "10:30 AM", type: "text" },
    { id: "2", from: "admin", text: "Hello! Sure, we have several accounts available. What's your budget?", timestamp: "10:32 AM", type: "text" },
    { id: "3", from: "customer", text: "Around $300", timestamp: "10:33 AM", type: "text" },
    { id: "4", from: "customer", text: "I've sent the payment proof", timestamp: "10:45 AM", type: "text" },
  ]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredChats = chats.filter(chat => filter === "All" || chat.status === filter);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const m: Message = { 
      id: String(Date.now()), 
      from: "admin", 
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    };
    setMessages((s) => [...s, m]);
    setText("");
  };

  const statusColors = {
    "New": "bg-blue-500/20 text-blue-400",
    "Payment Marked": "bg-yellow-500/20 text-yellow-400",
    "Verified": "bg-green-500/20 text-green-400",
    "Completed": "bg-gray-500/20 text-gray-400",
  };

  const quickReplies = [
    "Payment confirmed ✅",
    "Account details sent 📧",
    "Please wait for verification ⏳",
    "Thank you for your purchase! 🎉",
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Chat Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage customer conversations in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chat List */}
        <Card className="border-primary/20 shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {["All", "New", "Payment Marked", "Verified", "Completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === f
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-primary/5 ${
                    selectedChat === chat.id ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {chat.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{chat.username}</p>
                        <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[chat.status]}`}>
                    {chat.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="border-primary/20 shadow-lg lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
                <div>
                  <CardTitle>Customer #1234</CardTitle>
                  <p className="text-sm text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 rounded-md border border-border bg-input text-sm">
                  <option>Update Status</option>
                  <option>Payment Marked</option>
                  <option>Verified</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div className={`max-w-[70%] ${m.from === "admin" ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        m.from === "admin"
                          ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-none"
                          : "bg-card border border-border rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{m.text}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${m.from === "admin" ? "text-right" : "text-left"}`}>
                      {m.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick Replies:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => setText(reply)}
                    className="px-3 py-1 rounded-full text-xs bg-primary/10 hover:bg-primary/20 text-primary whitespace-nowrap transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={send} className="flex gap-2">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-input border-border"
                />
                <Button type="button" variant="outline" className="border-primary/50">
                  📎
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                  Send
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
