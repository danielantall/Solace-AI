"use client"

import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "@/components/app/profile-settings"
import { NotificationSettings } from "@/components/app/notification-settings"
import { VoiceSettings } from "@/components/app/voice-settings"
import { PrivacySettings } from "@/components/app/privacy-settings"

export default function SettingsPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded || !user) return null

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User Name"
  const email = user.primaryEmailAddress?.emailAddress ?? "user@example.com"
  const imageUrl = user.imageUrl ?? "/placeholder.svg?height=100&width=100"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light text-green-800 mb-2">Settings</h1>
        <p className="text-green-700">Customize your SolaceAI experience.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettings name={name} email={email} imageUrl={imageUrl} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="voice" className="mt-6">
          <VoiceSettings />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
