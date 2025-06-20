"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, AudioWaveformIcon as Waveform, Save, Trash } from "lucide-react"

export function VoiceJournal() {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded">("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  // BACKEND INTEGRATION: Implement actual audio recording using Web Audio API or MediaRecorder
  // BACKEND INTEGRATION: Fetch personalized journal prompt from AI

  const startRecording = () => {
    setRecordingState("recording")
    setRecordingTime(0)
    // BACKEND INTEGRATION: Initialize audio recording
    // Start timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
    setTimer(timer)
    // Store timer ID in a ref or state to clear it later
  }

  const stopRecording = () => {
    setRecordingState("recorded")
    // BACKEND INTEGRATION: Stop audio recording
    clearInterval(timer)
    // Clear timer
  }

  const discardRecording = () => {
    setRecordingState("idle")
    setRecordingTime(0)
    // BACKEND INTEGRATION: Discard recorded audio
  }

  const saveRecording = () => {
    // BACKEND INTEGRATION: Save recording to server
    // BACKEND INTEGRATION: Process audio with speech-to-text
    // BACKEND INTEGRATION: Send transcribed text to AI for analysis
    setRecordingState("idle")
    setRecordingTime(0)
  }

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Today's Journal</CardTitle>
          <CardDescription>Speak freely about your day, thoughts, and feelings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-green-800 font-medium mb-4">Today's Prompt:</p>
              {/* BACKEND INTEGRATION: Display AI-generated prompt based on user's history */}
              <p className="text-green-700 italic">
                "Reflect on moments that brought you joy today, and situations that felt challenging. What patterns do
                you notice in how you responded to different events?"
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              {recordingState === "recording" && (
                <div className="w-full h-16 bg-green-50 rounded-lg flex items-center justify-center">
                  {/* BACKEND INTEGRATION: Display actual audio waveform visualization */}
                  <Waveform className="w-full h-8 text-green-500" />
                </div>
              )}

              {recordingState === "recorded" && (
                <div className="w-full h-16 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-green-700">Recording saved - {formatTime(recordingTime)}</div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-4">
                {recordingState === "idle" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full flex items-center space-x-2"
                    onClick={startRecording}
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Recording</span>
                  </Button>
                )}

                {recordingState === "recording" && (
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full flex items-center space-x-2"
                    onClick={stopRecording}
                  >
                    <MicOff className="w-5 h-5" />
                    <span>Stop Recording ({formatTime(recordingTime)})</span>
                  </Button>
                )}

                {recordingState === "recorded" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-500 hover:bg-red-50 px-6 py-5 rounded-full flex items-center space-x-2"
                      onClick={discardRecording}
                    >
                      <Trash className="w-4 h-4" />
                      <span>Discard</span>
                    </Button>

                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-5 rounded-full flex items-center space-x-2"
                      onClick={saveRecording}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Journal</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Tips for Effective Journaling</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-green-700">
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                1
              </span>
              <span>Speak naturally as if talking to a trusted friend</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                2
              </span>
              <span>Include both positive experiences and challenges</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                3
              </span>
              <span>Reflect on your emotions and physical sensations</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                4
              </span>
              <span>Consider patterns in your behavior and reactions</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                5
              </span>
              <span>There's no right or wrong way to journal - just be authentic</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
