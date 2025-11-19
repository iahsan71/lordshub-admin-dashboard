import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Msg = { id: string; from: "me" | "customer"; text: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const m: Msg = { id: String(Date.now()), from: "me", text };
    setMessages((s) => [...s, m]);
    setText("");

    // Simulate customer reply
    setTimeout(() => {
      setMessages((s) => [
        ...s,
        {
          id: String(Date.now() + 1),
          from: "customer",
          text: "Thanks for the update — we will check.",
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Chat</h1>

      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-72 overflow-auto space-y-3 mb-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.from === "me" ? "text-right" : "text-left"}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-md ${
                    m.from === "me"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
