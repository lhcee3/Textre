import { io, Socket } from "socket.io-client"

interface ServerToClientEvents {
  receive_message: (data: {
    sender: string
    message: string
    roomID: string
    created_at: string
  }) => void
}

interface ClientToServerEvents {
  join_room: (roomID: string) => void
  send_message: (data: {
    roomID: string
    message: string
    sender: string
  }) => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL)

export default socket
