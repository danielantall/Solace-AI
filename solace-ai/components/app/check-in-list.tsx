"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Clock, Trash, Edit } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// BACKEND INTEGRATION: Fetch actual check-in data from the database

export interface CheckIn {
  id?: number
  user_id: string
  title: string
  description: string
  time: string
  completed: boolean
  active: boolean
}

export function CheckInList() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  useEffect(() => {
    async function getCheckIns() {
      const res = await fetch("/checkins", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if you use Clerk/JWT
        },
      })
      if (res.ok) {
        const data = await res.json()
        setCheckIns(data)
      }
    }
    getCheckIns()
  }, [])
  const toggleCompleted = (id: number | undefined) => {
    if (typeof id !== "number") return;
    setCheckIns(checkIns.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
    // BACKEND INTEGRATION: Update check-in completion status in the database
  }

  const toggleActive = (id: number | undefined) => {
    if (typeof id !== "number") return;
    setCheckIns(checkIns.map((item) => (item.id === id ? { ...item, active: !item.active } : item)))
    // BACKEND INTEGRATION: Update check-in active status in the database
  }

  const deleteCheckIn = (id: number | undefined) => {
    if (typeof id !== "number") return;
    setCheckIns(checkIns.filter((item) => item.id !== id))
    // BACKEND INTEGRATION: Delete check-in from the database
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-800">Your Check-ins</CardTitle>
        <CardDescription>Daily reminders to help you stay on track</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checkIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className={`p-4 border rounded-lg transition-colors ${
                checkIn.active ? "border-green-200 hover:bg-green-50" : "border-gray-200 bg-gray-50 opacity-70"
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1 cursor-pointer" onClick={() => toggleCompleted(checkIn.id)}>
                  {checkIn.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-green-300" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`font-medium ${
                          checkIn.active ? "text-green-800" : "text-gray-600"
                        } ${checkIn.completed ? "line-through" : ""}`}
                      >
                        {checkIn.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          checkIn.active ? "text-green-700" : "text-gray-500"
                        } ${checkIn.completed ? "line-through" : ""}`}
                      >
                        {checkIn.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex items-center text-sm ${checkIn.active ? "text-green-600" : "text-gray-500"}`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {checkIn.time}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleActive(checkIn.id)}>
                            {checkIn.active ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteCheckIn(checkIn.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`notifications-${checkIn.id}`}
                        checked={checkIn.active}
                        onCheckedChange={() => toggleActive(checkIn.id)}
                      />
                      <Label
                        htmlFor={`notifications-${checkIn.id}`}
                        className={`text-xs ${checkIn.active ? "text-green-600" : "text-gray-500"}`}
                      >
                        Notifications
                      </Label>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteCheckIn(checkIn.id)}
                    >
                      <Trash className="h-3 w-3 mr-1" />
                      <span className="text-xs">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {checkIns.length === 0 && (
            <div className="text-center py-12 bg-green-50 rounded-lg">
              <p className="text-green-700">No check-ins created yet.</p>
              <p className="text-green-600 text-sm mt-1">Create your first check-in to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
