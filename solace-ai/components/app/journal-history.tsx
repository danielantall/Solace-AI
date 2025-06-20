"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Play } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import { getAllJournals } from "@/lib/utils"
import { journalEntry } from "@/lib/types"

// BACKEND INTEGRATION: Fetch actual journal entries from the database

async function generateJournalEntries(user_id: string): Promise<journalEntry[]> {
  const journalEntries: journalEntry[] = []

  const journals = await getAllJournals(user_id)
  for (let i = 0; i < journals.length; i++) {
    journalEntries.push({
      id: journals[i].id,
      date: new Date(journals[i].created_at),
      summary: "Discussed challenges with project deadlines and team communication.",
      insights: [journals[i].content],
      audioUrl: "#"
    })
  }
  return journalEntries
}

export function JournalHistory() {
  const [journalEntries, setJournalEntries] = useState<journalEntry[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)

  useEffect(() => {
    generateJournalEntries("dkajfhkb").then(setJournalEntries)
  }, [])

  // Filter entries by selected date
  const filteredEntries = date
    ? journalEntries.filter((entry) => 
      entry.date.toDateString() === date.toDateString())
    : journalEntries

  // BACKEND INTEGRATION: Implement audio playback of journal recordings
  const playAudio = (audioUrl: string) => {
    console.log("Playing audio:", audioUrl)
    // Implement audio playback logic
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start text-left font-normal border-green-200 text-green-700"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Button variant="outline" className="border-green-200 text-green-700" onClick={() => setDate(undefined)}>
          Show All Entries
        </Button>
      </div>

      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`entry-${entry.id}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-green-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                        <div className="font-medium text-green-800">{format(entry.date, "MMMM d, yyyy")}</div>
                        <div className="text-sm text-green-600 sm:ml-4">{entry.summary.substring(0, 60)}...</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-6 py-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-green-800 mb-2">Summary</h4>
                          <p className="text-green-700">{entry.summary}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-green-800 mb-2">AI Insights</h4>
                          <ul className="space-y-2">
                            {entry.insights.map((insight, index) => (
                              <li key={index} className="flex items-start">
                                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-green-700">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 border-green-200 text-green-700"
                            onClick={() => playAudio(entry.audioUrl)}
                          >
                            <Play className="w-3 h-3 mr-2" />
                            <span>Play Audio Recording</span>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-lg">
            <p className="text-green-700">No journal entries found for this date.</p>
            <Button variant="link" className="text-green-600 mt-2" onClick={() => setDate(undefined)}>
              View all entries
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
