"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Users, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AnimatedLogo } from "@/components/animated-logo"
import { motion } from "framer-motion"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Fix hydration issues with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const generateRoomId = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(randomId)
  }

  const handleJoinRoom = () => {
    if (roomId && username) {
      router.push(`/chat?roomId=${roomId}&username=${username}`)
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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container flex justify-between items-center py-4">
        <AnimatedLogo />
        <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
          {mounted && (theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <motion.main
        className="container flex-1 flex flex-col items-center justify-center py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center space-y-2 mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold">Welcome to Textre</h1>
          <p className="text-muted-foreground">Join a room and start chatting with friends instantly</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="w-full max-w-md bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="roomId" className="text-sm font-medium">
                    Room ID
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="roomId"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="bg-background/50"
                  />
                  <Button variant="ghost" className="text-purple-500 hover:text-purple-600" onClick={generateRoomId}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </CardContent>
            <CardFooter className="pb-6">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={handleJoinRoom}>
                Join Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-8 mt-8 text-muted-foreground"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span>Group Chats</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-500" />
            <span>Real-time Messages</span>
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}
