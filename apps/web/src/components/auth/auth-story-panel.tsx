import { CommunityIcon } from "@shurokkha/icons/community-icon"
import { MedicalIcon } from "@shurokkha/icons/medical-icon"
import { SafetyIcon } from "@shurokkha/icons/safety-icon"
import { ShelterIcon } from "@shurokkha/icons/shelter-icon"
import { cn } from "@shurokkha/ui/lib/utils"

import { BrandLogo } from "@/components/brand/brand-logo"

function ResponseNode({
  className,
  tone = "default",
  children,
}: {
  className: string
  tone?: "default" | "accent"
  children: React.ReactNode
}) {
  return (
    <div className={cn("absolute flex flex-col items-center", className)}>
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-full border shadow-card ring-4 shadow-primary-foreground/10 ring-primary-foreground/5 xl:size-20 [&_svg]:size-7 xl:[&_svg]:size-8",
          tone === "accent"
            ? "border-primary-foreground/70 bg-background text-foreground"
            : "border-primary-foreground/50 bg-primary text-primary-foreground"
        )}
      >
        {children}
      </span>
      <span className="block h-8 w-px bg-primary-foreground/45 xl:h-10" />
      <span className="block size-3 rounded-full border-[3px] border-primary-foreground bg-primary xl:size-3.5" />
    </div>
  )
}

function ResponseMapArtwork() {
  return (
    <div
      className="absolute inset-x-0 bottom-24 h-[42%] xl:h-[45%]"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 size-full text-primary-foreground/20"
        viewBox="0 0 760 430"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-35 83C45 23 122 26 200 70c84 48 128-22 226-5 95 17 112 70 205 20 61-33 112-20 171 7"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-28 104C51 49 119 49 190 88c82 45 134-8 227 8 90 16 122 50 205 10 65-31 116-25 175 7"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-21 127C55 75 120 72 184 108c82 46 142 6 232 21 84 14 128 34 201 4 68-28 122-29 180 4"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-12 153c67-47 129-57 187-25 79 44 153 24 238 34 79 10 133 18 198-5 69-25 127-32 184 3"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-4 187c60-44 121-58 174-31 77 40 162 40 240 39 75 0 141 4 198-14 70-22 132-32 185 2"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-8 236c58-45 114-63 170-38 72 32 158 53 245 40 78-12 146 7 201-11 69-23 129-21 184 11"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-16 282c67-39 123-56 181-30 75 34 146 57 240 26 82-27 145 17 210-8 62-24 124-20 182 16"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-25 328c74-33 132-47 193-22 83 35 141 45 238 13 87-29 153 18 218-6 65-24 117-10 174 24"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M-31 372c78-24 138-34 202-12 89 31 145 27 239 2 92-25 154 15 225-5 62-18 110-1 163 27"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M111 205c46-29 79-17 104 29s75 47 111 12c39-38 89-32 122 12s73 54 116 21 75-24 103 9"
          stroke="var(--primary-foreground)"
          strokeWidth="2.75"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
        <circle cx="111" cy="205" r="7" fill="var(--primary-foreground)" />
        <circle
          cx="326"
          cy="246"
          r="7"
          fill="var(--background)"
          stroke="var(--primary-foreground)"
          strokeWidth="4"
        />
        <circle
          cx="563"
          cy="279"
          r="7"
          fill="var(--primary)"
          stroke="var(--primary-foreground)"
          strokeWidth="4"
        />
      </svg>

      <ResponseNode className="top-[4%] left-[8%] xl:left-[10%]">
        <ShelterIcon />
      </ResponseNode>
      <ResponseNode className="top-[32%] left-[43%]" tone="accent">
        <MedicalIcon />
      </ResponseNode>
      <ResponseNode className="top-[18%] right-[8%] xl:right-[10%]">
        <CommunityIcon />
      </ResponseNode>
    </div>
  )
}

export function AuthStoryPanel() {
  return (
    <aside className="relative hidden h-svh self-start overflow-hidden bg-primary px-10 py-9 text-primary-foreground lg:sticky lg:top-0 lg:flex lg:flex-col xl:px-14 xl:py-12 2xl:px-16 2xl:py-14">
      <div className="relative z-10 [&_.text-muted-foreground]:text-primary-foreground/70">
        <BrandLogo priority />
      </div>

      <div className="relative z-10 mt-[9vh] max-w-xl 2xl:mt-[11vh]">
        <h2 className="max-w-lg font-heading text-4xl leading-[1.12] font-bold tracking-[-0.04em] text-balance xl:text-5xl 2xl:text-[3.5rem]">
          Relief starts with a secure connection.
        </h2>
        <p className="mt-6 max-w-lg text-base leading-7 text-primary-foreground/75 xl:mt-7 xl:text-lg xl:leading-8 2xl:text-xl">
          One trusted place to request help, mobilize support, and coordinate
          recovery.
        </p>
      </div>

      <ResponseMapArtwork />

      <div className="relative z-10 mt-auto flex max-w-xl items-center gap-4 text-sm leading-6 text-primary-foreground/80 xl:text-base">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary-foreground/45 bg-primary-foreground/5 text-primary-foreground">
          <SafetyIcon />
        </span>
        <span>Secure access for communities and response teams.</span>
      </div>
    </aside>
  )
}
