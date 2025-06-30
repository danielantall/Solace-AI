"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/app/dashboard");
    } else {
      router.push("/sign-in?redirect_url=/app/dashboard");
    }
  };

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-transparent">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-teal-500" />
        <span className="text-xl font-semibold text-green-800">SolaceAI</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          href="#features"
          className="text-green-700 hover:text-green-500 transition-colors"
        >
          Features
        </Link>
        <Link
          href="#journal"
          className="text-green-700 hover:text-green-500 transition-colors"
        >
          Journal
        </Link>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
            <Button
              variant="ghost"
              className="text-green-700 hover:text-green-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Button>
          </SignInButton>
        )}

        <Button
          onClick={handleGetStarted}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Get Started
        </Button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-green-700"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="text-green-700 hover:text-green-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#journal"
              onClick={() => setIsMenuOpen(false)}
              className="text-green-700 hover:text-green-500 transition-colors"
            >
              Journal
            </Link>

            {isSignedIn ? (
              <div onClick={() => setIsMenuOpen(false)}>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
                <Button
                  variant="ghost"
                  className="text-green-700 hover:text-green-500 w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Button>
              </SignInButton>
            )}

            <Button
              onClick={() => {
                setIsMenuOpen(false);
                handleGetStarted();
              }}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
