"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import React from "react";
import { Cover } from "@/components/ui/cover";

export default function Home() {
  return (
    <div className=" w-full rounded-md bg-neutral-950 relative my-30 antialiased">
      <div className="lg:pl-25 lg:py-15 flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto px-4 gap-20">
        {/* Left: Heading Text */}
        <div className=" text-left w-full md:w-1/2">
          <h1 className="font-montserrat font-bold text-4xl md:text-4xl lg:text-6xl max-w-7xl mx-auto text-left relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Build Your Business Invoice <br /> at <Cover>speed of light</Cover>
          </h1>
          <p className="text-neutral-400 text-lg">
            Illuminate. Automate. Dominate.
          </p>
        </div>

        {/* Right: Torch Graphic */}
        <div className="relative flex flex-col items-center w-full md:w-1/2">
          {/* Flame Glow */}
          <div className="relative z-10">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-orange-400/30 blur-3xl rounded-full z-0" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-300/30 blur-2xl rounded-full z-0" />

            {/* Actual Flame */}
            <div className="w-8 h-12 bg-gradient-to-t from-yellow-400 via-orange-500 to-transparent rounded-b-full z-10 shadow-[0_0_40px_10px_rgba(253,224,71,0.4)]" />
          </div>

          {/* Torch Body */}
          <div className="w-2 h-24 bg-neutral-700 rounded-sm shadow-inner z-10" />

          {/* Torch Base / Holder */}
          <div className="w-8 h-2 bg-neutral-900 rounded-b-md mt-1 shadow-md" />
        </div>
      </div>

      {/* <BackgroundBeams /> */}

      {/* Grid */}
      <div className="mt-30 mx-[15%] items-center justify-center">
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
            title="For solo founders & freelancers"
            description="Generate invoices that don't look like your tax nightmares."
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={
              <Settings className="h-4 w-4 text-black dark:text-neutral-400" />
            }
            title="Speed + Simplicity"
            description="No sign-up, no fluff, just done."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
            title="Customization, We Got You!"
            description="Make it yours. Add your logo, tweak layout, look pro AF."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={
              <Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />
            }
            title="For agencies and teams"
            description="Manage all invoices from one clean dashboard."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={
              <Search className="h-4 w-4 text-black dark:text-neutral-400" />
            }
            title="Export and share"
            description="Professional invoices, wherever you are."
          />
        </ul>
      </div>
    </div>
  );
}
interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
