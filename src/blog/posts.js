import {
  firstChars,
  markdownToPlainText,
  readingMinutes,
} from "./markdown";
import { BEST_APPS_MARKDOWN } from "./bestAppsMarkdown";
import { SHARE_FAMILY_MARKDOWN } from "./shareFamilyMarkdown";

const HOW_TO_REMEMBER_MARKDOWN = `*You walked out of the appointment confident you'd remember everything. By dinner, half of it was gone.*

It happens to nearly everyone. Studies show that patients forget 40 to 80 percent of the medical information their doctor tells them — and what they do remember is often inaccurate. When you're managing care for an aging parent, a chronic condition, or multiple medications, that forgotten 40 percent can mean a missed dosage, a skipped follow-up, or a family left guessing about the care plan.

So how do you actually hold on to what matters?

## Why we forget so quickly

It's not a memory problem — it's a design problem. Doctor visits pack a dense amount of new information into a short window. The average primary care appointment lasts just 12 to 18 minutes. In that time, your doctor might cover lab results, adjust medications, recommend a specialist, explain a new diagnosis, and schedule follow-ups.

Your brain is also working against you. Medical conversations trigger stress and anxiety, which impair short-term memory encoding. Add unfamiliar terminology — drug names, dosages, medical conditions you're hearing for the first time — and retention drops even further.

For caregivers who weren't in the room, the problem compounds. You're relying on your parent or loved one to relay what the doctor said, filtered through their own understanding, their own memory gaps, and sometimes a language barrier.

## The old approaches — and where they fall short

### Taking notes by hand

Writing during an appointment splits your attention between listening and scribbling. You end up with fragments — half a drug name, a number without context, an instruction you abbreviated so aggressively you can't decode it later. And you're not making eye contact with your doctor, which changes the dynamic of the conversation.

### Bringing someone with you

Having a family member in the room helps — two memories are better than one. But schedules don't always align, especially for adult children managing their own jobs and families. And even with two people present, each person remembers different parts. The conversation after the visit becomes "I thought she said Tuesday" versus "No, she definitely said Thursday."

### Asking for an after-visit summary

Many clinics provide printed or portal-based visit summaries. These help, but they're written in clinical language, they often arrive hours or days later, and they don't capture the nuance of what your doctor actually explained. "Continue current medications" doesn't tell you that the doctor specifically said to take the magnesium at night, not in the morning.

### Writing it all down afterward

Sitting in the parking lot and typing everything you remember into your phone is better than nothing. But by the time you're in the car, the details have already started to blur. Was the dosage 10 milligrams or 20? Did she say to stop the old medication before starting the new one, or to overlap them for a week?

## What actually works: record the conversation

The most reliable way to remember what the doctor said is to not rely on memory at all.

Recording the appointment captures every word — the medication names spelled correctly, the exact dosage instructions, the follow-up timeline, and the things your doctor said casually that turn out to matter most. "Keep an eye on that mole" is easy to forget in the moment but important to act on.

Recording also lets family members who weren't in the room hear exactly what was said, not a secondhand summary. A daughter in California can listen to her father's appointment in Florida and know precisely what the doctor recommended — without relying on her father's recollection.

But a raw audio recording has its own problem: nobody wants to listen to a 20-minute recording to find the one instruction that matters. That's where AI changes the equation.

## From recording to action: how AI summarization helps

Modern AI can do what your notepad can't — listen to an entire medical conversation and pull out the information that matters:

- **Medications discussed** — names, dosages, and whether they're new, changed, or continuing
- **Conditions covered** — what the doctor diagnosed, monitored, or ruled out
- **Follow-up instructions** — when to come back, what labs to complete, which specialist to see
- **Action items** — what you need to do before the next visit

Instead of re-listening to a recording or deciphering your handwritten notes, you get a structured summary you can read in two minutes, share with family, and reference when you're standing in the pharmacy wondering which medication the doctor actually prescribed.

## Putting it into practice

If you want to start capturing your medical conversations, here's a practical approach:

**1. Ask permission first.** Most doctors are fine with being recorded — they know patients forget. A simple "Do you mind if I record this so I can review it later?" is usually all it takes. Recording laws vary by state, so asking is both courteous and legally sound.

**2. Use a purpose-built tool, not your phone's voice recorder.** A generic voice memo gives you audio with no structure. You still have to listen to the whole thing and pull out the key details yourself. Tools designed for medical conversations can transcribe and summarize automatically, saving you the work.

**3. Review the summary the same day.** Even with a recording, reviewing the key points while the conversation is still fresh helps you catch anything that doesn't look right and formulate questions for next time.

**4. Share it with your care team.** Whether that's your spouse, your adult children, or a professional caregiver — everyone involved in the care plan should see the same information. Miscommunication between family members is one of the biggest sources of medication errors at home.

**5. Set reminders for action items.** A summary is only useful if you act on it. If the doctor said to complete labs within a week, set a reminder. If there's a new medication to start, set a reminder for that too.

## How RemiMinderAI helps

[RemiMinderAI](https://remiminderai.com) was built specifically for this problem. It's an AI healthcare companion app that lets you:

- **Record the doctor visit** right from your phone — one tap to start, with built-in consent prompts
- **Get an AI-generated summary** with medications, conditions, follow-ups, and action items pulled out automatically
- **Scan lab results and prescriptions** so everything lives in one place
- **Set reminders by voice** using RemiVox — just say "Remind me to take my medication at 8 PM" and it's done
- **Share the care plan with family in real time** so everyone stays aligned, even from across the country

It works in 10 languages, runs on both iPhone and Android, and starts with a free 14-day trial.

If you've ever walked out of a doctor's office and thought "I should have written that down" — this is what that looks like when it actually works.
`;

function enrichPost(post) {
  const plain = markdownToPlainText(post.markdown);
  return {
    ...post,
    plain,
    preview: firstLinePreview(post.markdown),
    description: post.description || firstChars(plain, 155),
    readMinutes: readingMinutes(plain),
    path: `/blog/${post.slug}`,
  };
}

function firstLinePreview(markdown) {
  const line = markdown
    .split("\n")
    .map((row) => row.trim())
    .find((row) => row && !row.startsWith("#") && row !== "---" && !row.startsWith(">"));
  if (!line) return "";
  return markdownToPlainText(line);
}

const RAW_POSTS = [
  {
    slug: "how-to-remember-what-doctor-said",
    title: "How to Remember What the Doctor Said After Your Appointment",
    date: "2026-09-18",
    markdown: HOW_TO_REMEMBER_MARKDOWN,
  },
  {
    slug: "how-to-share-medical-information-with-family-members-who-live-far-away",
    title: "How to Share Medical Information With Family Members Who Live Far Away",
    date: "2026-09-18",
    description:
      "Learn practical ways to share doctor's appointment information, coordinate long-distance caregiving, and keep family members informed about an aging parent's healthcare.",
    markdown: SHARE_FAMILY_MARKDOWN,
  },
  {
    slug: "best-apps-managing-elderly-parents-medical-care-2026",
    title: "Best Apps for Managing Elderly Parents' Medical Care in 2026",
    date: "2026-09-18",
    description:
      "Compare the best types of apps for managing an elderly parent's medical care in 2026, including medication reminders, patient portals, family caregiving, appointment summaries, and care coordination.",
    markdown: BEST_APPS_MARKDOWN,
  },
];

export const BLOG_POSTS = RAW_POSTS.map(enrichPost);

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

export function formatPostDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
