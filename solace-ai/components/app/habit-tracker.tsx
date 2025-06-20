"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { DialogClose, DialogDescription, DialogFooter, DialogHeader,Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addHabit, getDays, getHabits, Habit } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// BACKEND INTEGRATION: Fetch actual habit data from the database

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [dialogOpen, setDialogOpen] = useState(false) // Add this line
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    async function fetchHabits() {
      setLoading(true)
      const habitData = await getHabits("kjhwjdf")
      setHabits(habitData)
      setLoading(false)
    }
    fetchHabits()
  }, [])

  // Get day names for the last 7 days
  const getDayNames = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date().getDay()
    const result = []

    for (let i = 6; i >= 0; i--) {
      const index = (today - i + 7) % 7
      result.push(days[index])
    }

    return result
  }


  const dayNames = getDayNames()

    
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
      message: "Description must be at least 2 characters.",
    }),
    target: z.number().nonnegative({message: "Must be greater than 0"})
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      target: 0
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addHabit(values.name, values.description, values.target, "kjhwjdf")
      const habitData = await getHabits("kjhwjdf")
      setHabits(habitData)
      form.reset()
      setDialogOpen(false) // Close dialog after save
    } catch (e: any) {
      form.setError("root", { message: e.message || "Failed to add habit" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-green-800">Your Habits</h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-4 h-4"/>
              <span>Add Habit</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new habit</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
                />
                <FormField 
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
                />
                <FormField 
                control={form.control}
                name="target"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Target (days)</FormLabel>
                  <FormControl>
                    <Input type="number"
                    placeholder="Number of days"
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
                />
                <div className="pt-5 w-full justify-right">
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Show 3 skeleton cards as placeholders
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-2 w-full mb-2" />
                  <div className="grid grid-cols-7 gap-2 pt-2">
                    {[...Array(7)].map((_, j) => (
                      <Skeleton key={j} className="w-6 h-6 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          habits.map((habit) => (
            <Card key={habit.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-green-800">{habit.name}</CardTitle>
                <CardDescription>{habit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-green-700">
                      Current streak: <span className="font-medium text-green-800">{habit.streak} days</span>
                    </div>
                    <div className="text-green-700">
                      Target: <span className="font-medium text-green-800">{habit.target} days</span>
                    </div>
                  </div>

                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 pt-2">
                    {dayNames.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xs text-green-600 mb-1">{day}</div>
                        <div className="flex justify-center">
                          {/* BACKEND INTEGRATION: Update habit completion status in database */}
                          {habit.days[index] ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-green-200" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
