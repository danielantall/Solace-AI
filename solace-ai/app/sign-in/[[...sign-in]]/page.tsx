"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn
        appearance={{
          baseTheme: dark,
          elements: {
            card: "bg-neutral-900 border border-neutral-800 shadow-lg",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-300",
            socialButtonsBlockButton:
              "bg-neutral-800 hover:bg-neutral-700 text-white",
            formFieldInput:
              "bg-neutral-800 text-white border border-neutral-700",
            formButtonPrimary:
              "bg-green-600 hover:bg-green-700 text-white",
          },
        }}
        redirectUrl="/app/dashboard"
      />
    </div>
  )
}
