# About page — canonical copy (RemiMinderAI marketing site)

Use this file as the source of truth for `/about` body text. The About page component should mirror this wording.

## Status banner

**Text:** Private Beta — Invite Only. We're onboarding a small group of caregivers and patients.

**CTA button:** Request an invite

## Hero

**H1:** About RemiMinderAI

**Subheading:** Healthcare coordination, finally built for the people doing the coordinating.

**Intro (2–3 sentences):**

RemiMinderAI is an AI-native health management platform that helps families capture, organize, and act on medical information so critical care moments never slip through the cracks.

We turn fragmented doctor visits, medication schedules, and scattered records into a single, shared source of truth for patients and the caregivers who support them.

## Why We Built This

Anyone who has helped a parent, partner, or child navigate the healthcare system knows the feeling: you leave the doctor's office already forgetting half of what was said, juggling prescription names you can't pronounce, and wondering who else in the family needs to know what just happened.

RemiMinderAI started with that exact problem. Care doesn't happen in a single appointment — it happens in the days and weeks after, across phone calls, pharmacies, and kitchen tables. We're building the platform that holds it all together.

## What We Do (left column)

RemiMinderAI is an AI-powered health management platform that helps patients record, organize, and share their health information with caregivers and healthcare providers.

Our mobile and web application uses advanced speech recognition and natural language processing to transcribe doctor visits, extract key medical information, and generate actionable health insights.

The platform connects patients with their care team in real time, turning every appointment into structured, shareable knowledge instead of forgotten conversations.

## Problems We Solve (right column — bullets)

- Patients forget 40–80% of medical information immediately after a visit, and nearly half of what's remembered is recalled incorrectly^1^
- Caregivers lack real-time visibility into their loved ones' health status and appointments
- Fragmented health records across multiple providers create dangerous gaps in care
- Seniors struggle with complex medication schedules and adherence
- Families waste hours coordinating care through scattered phone calls, texts, and sticky notes

**Footnote:** ^1^ Kessels, R.P.C. Patients' memory for medical information. Journal of the Royal Society of Medicine, 2003.

## Your Data, Your Control — intro

Healthcare data is the most sensitive information a person shares. We treat it that way.

## Your Data, Your Control — bullets

1. HIPAA Compliant. We operate under a signed Business Associate Agreement (BAA) with Google Cloud, and our AI processing runs on Vertex AI — a HIPAA-eligible Google Cloud service. Protected Health Information (PHI) is encrypted at rest and in transit using industry-standard TLS.
2. Identity & access. Authentication is handled by Firebase Auth with role-based access controls.
3. Data residency. All patient data is stored in Google Cloud infrastructure in the United States.
4. No selling, no ads. We don't sell user data. We don't serve ads. Our business model is the product, not the people using it.
5. You control who sees what. Patients can grant full or partial access to caregivers and revoke it at any time. You decide what's shared, with whom, and for how long.

**Link:** Read our full Privacy Policy → (`/privacy`)

## Core Tech Stack — cards

1. **Mobile Interface** — Built with Flutter for a high-performance, cross-platform experience (iOS/Android) with rapid feature parity across devices.
2. **Document Intelligence** — Google ML Kit for on-device OCR and Google Document AI for high-accuracy extraction of prescriptions, lab results, and complex medical documents.
3. **Generative AI** — Powered by Google Gemini via Vertex AI for real-time visit transcription, medical summarization, and personalized health action plans.

## Cloud Infrastructure — cards

1. **Backend** — High-speed FastAPI (Python) services hosted on Google Cloud Run for serverless, auto-scaling performance.
2. **Database** — Google Cloud SQL (PostgreSQL) for robust, relational storage of patient records with automated backups.
3. **Security & Compliance** — Firebase Auth for secure identity management and Google Cloud Storage for encrypted PHI. We operate under a signed BAA with Google Cloud, with AI workloads running on HIPAA-eligible Vertex AI.

## Our Team — Paramita Malakar

- **Name:** Paramita Malakar
- **Role:** Product & AI/ML Leader
- **Bio:** Product & Quality Assurance Leader, with 18 years of experience, focused on transforming ideas into impactful AI and enterprise solutions.
- **LinkedIn:** https://www.linkedin.com/in/paramitam/

## What's Next (roadmap)

- Q2 2026 — External beta opens to waitlist (Android first)
- Q3 2026 — iOS release and caregiver web dashboard
- Q4 2026 — Care team collaboration features, provider integrations
- 2027 — Expanded clinical partnerships and multi-language support

## Company Information

- Company Name: RemiMinderAI
- Industry: Digital Health / HealthTech
- Company Size: 2–10 employees
- Headquarters: Hollister, California
- Founded: 2025
- Status: Private Beta (Invite Only)
- Email: team@remiminderai.com
- LinkedIn: https://www.linkedin.com/company/remiminderai/

## Closing CTA — body

Want early access? We're onboarding a limited group of families and caregivers during private beta. If RemiMinderAI sounds like something you or someone you love needs, request an invite.

**Buttons:** Request Beta Access (primary) · Contact the Team (secondary)

## Back to Home

Label: ← Back to Home — link to `/`
