import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  subscribeToChats,
  subscribeToMessages,
  sendMessage,
  sendImageMessage,
  markChatAsRead,
} from "@/store/actions/chatActions";
import { setSelectedChat } from "@/store/slices/chatSlice";
import { Timestamp } from "firebase/firestore";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { chats, messages, selectedChatId, uploadingImage } = useAppSelector((state) => state.chat);
  const [text, setText] = useState("");
  const [imageError, setImageError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to all chats on mount
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToChats());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Subscribe to messages when a chat is selected
  useEffect(() => {
    if (selectedChatId) {
      const unsubscribe = dispatch(subscribeToMessages(selectedChatId));
      
      // Mark chat as read when opened
      dispatch(markChatAsRead(selectedChatId));

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [selectedChatId, dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChatId]);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const currentMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  const handleSelectChat = (chatId: string) => {
    dispatch(setSelectedChat(chatId));
    dispatch(markChatAsRead(chatId));
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !selectedChatId) return;

    try {
      await dispatch(sendMessage(selectedChatId, text, "admin"));
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatId) return;

    setImageError("");

    try {
      await dispatch(sendImageMessage(selectedChatId, file, "admin"));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Failed to upload image");
    }
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  const formatMessageTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    
    try {
      const date = timestamp.toDate();
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      return "";
    }
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
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage customer conversations in real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chat List */}
        <Card className="border-primary/20 shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations ({chats.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {chats.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Chats will appear here when customers message you</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-primary/5 ${
                      selectedChatId === chat.id
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {chat.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{chat.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(chat.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || "No messages yet"}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="border-primary/20 shadow-lg lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                      {selectedChat.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle>{selectedChat.customerName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {selectedChat.conversationId}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
                  {currentMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    currentMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${
                          m.from === "admin" ? "justify-end" : "justify-start"
                        } animate-in fade-in slide-in-from-bottom-2`}
                      >
                        <div className={`max-w-[70%] ${m.from === "admin" ? "order-2" : "order-1"}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              m.from === "admin"
                                ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-none"
                                : "bg-card border border-border rounded-bl-none"
                            }`}
                          >
                            {m.type === "image" && m.imageUrl ? (
                              <div>
                                <img
                                  src={m.imageUrl}
                                  alt="Uploaded"
                                  className="rounded-lg max-w-full h-auto mb-2"
                                  style={{ maxHeight: "300px" }}
                                />
                                <p className="text-sm">{m.text}</p>
                              </div>
                            ) : (
                              <p className="text-sm">{m.text}</p>
                            )}
                          </div>
                          <p
                            className={`text-xs text-muted-foreground mt-1 ${
                              m.from === "admin" ? "text-right" : "text-left"
                            }`}
                          >
                            {formatMessageTime(m.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
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

                {/* Image Error */}
                {imageError && (
                  <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
                    {imageError}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message..."
                      className="bg-input border-border"
                      disabled={uploadingImage}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary/50"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "⏳" : "📎"}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-primary to-secondary"
                      disabled={uploadingImage}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-semibold">Select a conversation</p>
                <p className="text-sm mt-2">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
