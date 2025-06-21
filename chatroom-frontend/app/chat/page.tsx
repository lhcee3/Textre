"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Sun, Moon, Send, ArrowLeft, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedLogo } from "@/components/animated-logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import socket from "@/utils/socket"

type Message = {
  id: string
  sender: string
  content: string
  timestamp: Date
  isCurrentUser: boolean
}

export default function ChatRoom() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId") || ""
  const username = searchParams.get("username") || ""
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const router = useRouter()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Fix hydration issues with theme
  useEffect(() => {
    setMounted(true)

    // Add some sample messages
    setMessages([
      {
        id: "1",
        sender: "System",
        content: `Welcome to room ${roomId}!`,
        timestamp: new Date(),
        isCurrentUser: false,
      },
      {
        id: "2",
        sender: "System",
        content: `${username} has joined the chat.`,
        timestamp: new Date(),
        isCurrentUser: false,
      },
    ])
  }, [roomId, username])

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  useEffect(() => {
    socket.emit("join_room", roomId)

socket.on("receive_message", (data) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: data.sender,
        content: data.message,
        timestamp: new Date(data.created_at), 
        isCurrentUser: data.sender === username,
      },
    ]);
  });
  
    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

const handleSendMessage = () => {
  if (message.trim()) {
    socket.emit("send_message", {
      roomID: roomId,
      message,
      sender: username,
    });
    setMessage("");
  }
}


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="container flex justify-between items-center py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <AnimatedLogo />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Room: {roomId}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
            {mounted && (theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <motion.main
        className="container flex-1 flex flex-col py-4 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex gap-2 max-w-[80%] ${msg.isCurrentUser ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={msg.isCurrentUser ? "bg-purple-500" : "bg-gray-500"}>
                      {msg.sender.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.isCurrentUser ? "bg-purple-600 text-white" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t mt-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-background/50"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
