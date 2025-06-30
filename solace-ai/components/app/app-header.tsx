"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function AppHeader() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  const [notifications] = useState([
    { id: 1, message: "Morning guidance is ready for you", time: "5 minutes ago" },
    { id: 2, message: "Time for your evening reflection", time: "2 hours ago" },
  ])

  const handleLogout = async () => {
    await signOut()
    router.push("/sign-in")
  }

  // ⛔ prevent rendering if user not loaded
  if (!isLoaded || !user) return null

  const initials = (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")

  return (
    <header className="bg-white border-b border-green-100 py-4 px-6 md:px-8 flex items-center justify-end">
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-green-700" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="py-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{n.message}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center space-x-2" size="sm">
              <Avatar className="h-8 w-8">
                {user.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-green-100 text-green-800">{initials}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-green-800">
                {user.firstName} {user.lastName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
