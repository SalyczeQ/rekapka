import { describe, it, expect } from "vitest";
import { generateIcsCalendar } from "@/lib/ics/generate-ics";

describe("generateIcsCalendar", () => {
  it("generates valid ICS with events", () => {
    const events = [
      {
        uid: "abc-123",
        title: "Sprint 42 Retro",
        date: new Date("2024-03-15"),
        location: "Office",
      },
    ];

    const ics = generateIcsCalendar("Rekapka", events);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("SUMMARY:Sprint 42 Retro");
    expect(ics).toContain("LOCATION:Office");
    expect(ics).toContain("UID:abc-123@rekapka");
    expect(ics).toContain("X-WR-CALNAME:Rekapka");
    expect(ics).toContain("DTSTART;VALUE=DATE:20240315");
  });

  it("handles events without location", () => {
    const events = [
      {
        uid: "def-456",
        title: "Remote Retro",
        date: new Date("2024-06-01"),
      },
    ];

    const ics = generateIcsCalendar("Team", events);
    expect(ics).not.toContain("LOCATION:");
    expect(ics).toContain("SUMMARY:Remote Retro");
  });

  it("generates empty calendar", () => {
    const ics = generateIcsCalendar("Empty", []);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).not.toContain("BEGIN:VEVENT");
  });

  it("escapes special characters", () => {
    const events = [
      {
        uid: "esc-1",
        title: "Retro, with commas; and semicolons",
        date: new Date("2024-01-01"),
      },
    ];

    const ics = generateIcsCalendar("Test", events);
    expect(ics).toContain("SUMMARY:Retro\\, with commas\\; and semicolons");
  });
});
