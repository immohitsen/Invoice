"use client";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import React from "react";
import { useState } from "react";
import { Github } from "lucide-react";

export default function Navbar() {
  const navItems = [
    {
      name: "Dashboard",
      link: "/Dashboard",
    },
    {
      name: "About",
      link: "/About",
    },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full sticky top-5 z-50">
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton
              href="https://github.com/immohitsen/Invoice "
              target="_blank"
              rel="noopener noreferrer"
              variant="dark"
              className="flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              GitHub
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                href="https://github.com/immohitsen/Invoice"
                target="_blank"
                rel="noopener noreferrer"
                variant="dark"
                className="w-full flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                  <Github className="w-5 h-5" />
                GitHub
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
      {/* <DummyContent /> */}

      {/* Navbar */}
    </div>
  );
}
