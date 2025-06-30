"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MorningGuidance } from "@/components/app/morning-guidance";
import { JournalPrompt } from "@/components/app/journal-prompt";
import { ProgressSummary } from "@/components/app/progress-summary";
import { CheckInReminder } from "@/components/app/check-in-reminder";
import Link from "next/link";

export default function DashboardClient() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light text-green-800 mb-2">
          Good morning, <span className="font-medium">{user?.firstName ?? "User"}</span>
        </h1>
        <p className="text-green-700">Here's your personalized guidance for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MorningGuidance />

          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Recent Insights</CardTitle>
              <CardDescription>Based on your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Replace with real data later */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium mb-1">Sleep Pattern</p>
                  <p className="text-green-700 text-sm">
                    Your sleep quality improves when you avoid screens before bed.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium mb-1">Stress Trigger</p>
                  <p className="text-green-700 text-sm">
                    Work meetings in the afternoon tend to increase your stress levels.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium mb-1">Mood Booster</p>
                  <p className="text-green-700 text-sm">
                    Morning walks consistently improve your mood for the rest of the day.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/app/progress">
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    View All Insights
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <JournalPrompt />
          <ProgressSummary />
          <CheckInReminder />
        </div>
      </div>
    </div>
  );
}
