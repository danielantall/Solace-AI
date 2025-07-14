"use client"

import { useState, useEffect } from "react"
import type React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Camera } from "lucide-react"

type ProfileSettingsProps = {
  name: string
  email: string
  imageUrl: string
}

export default function ProfileSettings({
  name,
  email,
  imageUrl,
}: ProfileSettingsProps) {
  const [userInfo, setUserInfo] = useState({
    name: name || "User Name",
    email: email || "user@example.com",
    avatar: imageUrl || "/placeholder.svg?height=100&width=100",
  })

  useEffect(() => {
    setUserInfo({
      name: name || "User Name",
      email: email || "user@example.com",
      avatar: imageUrl || "/placeholder.svg?height=100&width=100",
    })
  }, [name, email, imageUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile updated:", userInfo)
  }

  const handleAvatarUpload = () => {
    console.log("Avatar upload not implemented")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-800">Profile Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                  {(userInfo.name || "User Name")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                type="button"
                className="absolute bottom-0 right-0 bg-white border-green-200 text-green-700 hover:bg-green-50"
                onClick={handleAvatarUpload}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-green-700">Upload a profile picture</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-700">
                Full Name
              </Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                className="border-green-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                className="border-green-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-green-200"
              />
              <p className="text-xs text-green-600">
                Leave blank to keep your current password
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
