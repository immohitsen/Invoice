"use client";
import React from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";


// If you have Aceternity UI components, import them here, e.g.:
// import { SparklesCore } from "@/components/ui/sparkles";
// import { AnimatedBorderCard } from "@/components/ui/animated-border-card";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Optional: Sparkles background if available */}
      {/* <SparklesCore className="absolute inset-0 z-0" /> */}
      <div className="h-[23rem] fixed w-full top-1/10 left-0 items-center justify-center">
        <TextHoverEffect text="INVOICE" />
      </div>
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Animated border card if available */}
        {/* <AnimatedBorderCard className="p-8 rounded-2xl bg-neutral-900/90 shadow-lg"> */}
        <div className="p-8 rounded-2xl bg-neutral-900/90 shadow-lg border border-neutral-800">
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://avatars.githubusercontent.com/u/86571773?v=4" // Replace with your avatar
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gradient-to-br from-blue-500 to-green-500 shadow-lg"
            />
            <h1 className="text-3xl font-bold text-white">Mohit Sen</h1>
            <p className="text-neutral-400 text-center max-w-md">
              Hi! I&apos;m Mohit, a passionate web developer focused on building
              elegant, user-friendly web apps. I love working with React,
              Next.js, and modern UI/UX tools. Always learning, always building.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-blue-400 text-xs font-semibold">
                React
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-green-400 text-xs font-semibold">
                Next.js
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-yellow-400 text-xs font-semibold">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-pink-400 text-xs font-semibold">
                UI/UX
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-purple-400 text-xs font-semibold">
                Open Source
              </span>
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com/immohitsen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.135 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              {/* Add more social links if needed */}
            </div>
          </div>
        </div>
        {/* </AnimatedBorderCard> */}
      </div>
    </div>
  );
}
