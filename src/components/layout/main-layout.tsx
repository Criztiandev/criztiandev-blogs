"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Badge } from "@/components/ui/badge";
import { SKILL_SET } from "@/features/landing/data/skillset.data";
import SOCIALS_DATA from "@/features/landing/data/socials.data";
import Link from "next/link";
import NewsLetterModal from "@/components/blocks/modals/news-letter-modal";

export function MainLayoutSidebar() {
  return (
    <>
      {/* Mobile Header - Show on mobile/tablet only */}
      <header className="bg-background/80 sticky top-0 right-0 left-0 z-40 border-b px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between">
          <h1 className="font-permanent-marker text-5xl font-bold sm:hidden">Criz</h1>
          <AnimatedThemeToggler defaultValue="" />
        </div>
      </header>

      {/* Mobile/Tablet Hero Section - Show on mobile/tablet only */}
      <section className="bg-background border-b px-6 py-12 pt-16 lg:hidden">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Bio */}
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Hi, Im Criztian a Full Stack Developer focused on building scalable web and mobile apps
            with MERN, React Native, Laravel, and Generative AI. I collaborate with diverse teams to
            create impactful products that solve real problems with excellent user experiences.
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {SKILL_SET.map((items) => (
              <Badge
                key={items}
                variant="outline"
                className="text-muted-foreground rounded-full px-3 py-1 text-sm"
              >
                {items}
              </Badge>
            ))}
          </div>

          {/* Newsletter */}
          <NewsLetterModal />

          {/* Socials */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-sm">@criztiandev</span>
            <div className="flex gap-3">
              {SOCIALS_DATA.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  className="hover:text-primary transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Sidebar - Show on desktop only */}
      <div className="sticky top-0 hidden h-screen w-full flex-col items-center justify-between p-8 lg:flex">
        <header className="mt-12 flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <span className="font-permanent-marker text-4xl font-bold">Criz</span>
            <AnimatedThemeToggler defaultValue="" />
          </div>

          <p className="text-muted-foreground">
            Hi, Im Criztian a Full Stack Developer focused on building scalable web and mobile apps
            with MERN, React Native, Laravel, and Generative AI. I collaborate with diverse teams to
            create impactful products that solve real problems with excellent user experiences.
          </p>

          <div className="flex flex-wrap gap-2">
            {SKILL_SET.map((items) => (
              <Badge
                key={items}
                variant="outline"
                className="text-md text-muted-foreground rounded-full px-4 py-2"
              >
                {items}
              </Badge>
            ))}
          </div>

          <NewsLetterModal />
        </header>

        <footer className="flex w-full items-center justify-between">
          <span className="text-muted-foreground">@criztiandev</span>

          <div className="flex gap-2">
            {SOCIALS_DATA.map((social) => (
              <Link key={social.id} href={social.href}>
                {social.icon}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
