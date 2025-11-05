"use client"

const meta = [
  { label: "CURATOR / PROGRAMMING MANAGER", value: "Marianna Angel" },
  { label: "DATE RANGE", value: "Selected nights · Nov 14 → Jan 17" },
  { label: "LOCATION", value: "Locust Projects · Project Room" },
  { label: "SYSTEM HOURS", value: "1900 hrs → 0000 hrs" },
  { label: "BAR STATUS", value: "Counter goes live Nov 21" },
]

type ScheduleEntry = {
  date: string
  status: string
  note?: string
}

const schedule: { month: string; entries: ScheduleEntry[] }[] = [
  {
    month: "NOVEMBER 2024",
    entries: [
      {
        date: "Nov 21",
        status: "Programming TBA",
        note: "Artist open. DITM performance @ 18:30. Karaoke feedback loop encouraged.",
      },
      {
        date: "Nov 22",
        status: "Programming TBA",
        note: "Punk / garage frequency under consideration.",
      },
    ],
  },
  {
    month: "DECEMBER 2024",
    entries: [
      {
        date: "Dec 5",
        status: "Programming TBA",
        note: "Basel night. Visiting + local artists (pending confirmation).",
      },
      {
        date: "Dec 6",
        status: "Programming TBA",
        note: "Big Basel collision. DITM performance @ 18:30 with space for rogue inserts.",
      },
      {
        date: "Dec 12",
        status: "Programming TBA",
        note: "Folk-leaning transmissions under review.",
      },
      {
        date: "Dec 13",
        status: "Programming TBA",
        note: "Blindfolded ceramics w/ Brigette Hoffman + Moonbeam Mike on vinyl. Little Haiti happy hour · Makers Mart · daytime food trucks.",
      },
      {
        date: "Dec 19",
        status: "Programming TBA",
      },
      {
        date: "Dec 20",
        status: "Programming TBA",
      },
      {
        date: "Dec 21 → Jan 8",
        status: "Holiday Break",
        note: "System idling. Bar lights in low-power mode.",
      },
    ],
  },
  {
    month: "JANUARY 2025",
    entries: [
      { date: "Jan 9", status: "Programming TBA" },
      { date: "Jan 10", status: "Programming TBA" },
      { date: "Jan 16", status: "Programming TBA" },
      { date: "Jan 17", status: "Programming TBA" },
    ],
  },
]

export default function mosquitobar() {
  return (
    <div className="relative min-h-screen bg-[#040b06] text-[#7cff6b] font-mono">
      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen bg-[repeating-linear-gradient(180deg,rgba(124,255,107,0.07)_0px,rgba(124,255,107,0.07)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_center,rgba(124,255,107,0.25),transparent_65%)]" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="border border-[#1d5b2a] bg-black/80 p-6 shadow-[0_0_45px_rgba(28,133,56,0.25)] md:p-10">
          <header className="space-y-4">
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-[#94ff9a]/70">
              <span>System Boot // 1999.ESQ</span>
              <span className="text-base text-[#7cff6b] animate-pulse">▌</span>
            </p>
            <p className="text-sm text-[#94ff9a]/80 md:text-base">
        
            </p>
            <div className="mx-auto mt-6 max-w-xl border-4 border-[#1d5b2a] bg-[#06150c] p-3 shadow-[0_0_30px_rgba(40,141,70,0.35)]">
              <div className="border border-[#2e7d3f] bg-[#030804]/90 p-2 shadow-[inset_0_0_18px_rgba(0,0,0,0.6)]">
                <img
                  src="/mosquitobar.png"
                  alt="Glitch feed from the Mosquito Lounge projection"
                  className="w-full"
                  style={{ imageRendering: "pixelated" }}
                />
                <p className="mt-3 text-center text-[0.65rem] uppercase tracking-[0.35em] text-[#94ff9a]/70">
                  <span className="text-[#7cff6b]">[</span> 0x <span className="text-[#7cff6b]">]</span>
                </p>
              </div>
            </div>
          </header>

          <hr className="my-6 border-[#1d5b2a]" />

          <section className="grid gap-4 text-sm md:text-base">
            {meta.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4"
              >
                <span className="text-xs uppercase tracking-[0.35em] text-[#94ff9a]/60 md:w-64">
                  {label}
                </span>
                <span className="text-[#e8ffe9]">{value}</span>
              </div>
            ))}
          </section>

          <hr className="my-6 border-[#1d5b2a]" />

          <section>
            <p className="text-xs uppercase tracking-[0.4em] text-[#94ff9a]/70">
              Run Schedule
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#94ff9a]/50">
              All programming currently marked TBA. Expect uploads + glitches.
            </p>

            <div className="mt-6 space-y-10">
              {schedule.map((block) => (
                <div key={block.month} className="space-y-4">
                  <div className="text-sm uppercase tracking-[0.4em] text-[#7cff6b]">
                    {block.month}
                  </div>
                  <div className="space-y-3">
                    {block.entries.map((entry) => (
                      <div
                        key={entry.date + entry.status}
                        className="border border-[#1d5b2a]/80 bg-[#09170f]/70 px-4 py-3 md:flex md:items-start md:gap-6"
                      >
                        <span className="block text-sm uppercase tracking-[0.28em] text-[#a0ffa5] md:w-48">
                          {entry.date}
                        </span>
                        <div className="mt-2 text-sm text-[#e8ffe9] md:mt-0 md:flex-1 md:text-base">
                          <div>{entry.status}</div>
                          {entry.note && (
                            <div className="mt-2 text-xs text-[#94ff9a]/75 md:text-sm">
                              {entry.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-6 border-[#1d5b2a]" />

          <footer className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[#94ff9a]/60">
            <span>Everglades mode engaged</span>
            <span className="animate-pulse">▌</span>
          </footer>
        </div>
      </div>
    </div>
  )
}
