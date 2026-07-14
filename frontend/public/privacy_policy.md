# Privacy Policy

**Effective Date:** July 5, 2026
**Last Updated:** July 14, 2026

## 1. Introduction

RemiMinderAI ("RemiMinderAI," "we," "us," or "our") is a personal recorder and reminder app designed for older adults managing their own healthcare and the family members or friends who help them. This Privacy Policy explains what information we collect, how we use it, and your rights. It applies to the RemiMinderAI mobile application (iOS and Android), our website at remiminderai.com, and related services (collectively, the "Services").

By using the Services, you agree to the practices described here. If you don't agree, please don't use the Services.

## 2. Information We Collect

We collect only what we need to help you record doctor visits, scan medical documents, and keep plain-language summaries you can refer back to later:

- **Audio recordings of doctor visits** — captured via the in-app recorder (with your doctor's consent)
- **Document images** — photos of prescriptions, lab results, and medical documents, captured via the in-app camera
- **Transcripts** — text generated from your audio recordings
- **Plain-language summaries** — AI-generated summaries of your visits and scanned documents, written in easy-to-read language
- **Account information** — your email address and name, provided when you register
- **Device information and app usage data** — details about your phone or tablet and how you use the app, to help us troubleshoot problems

We do not sell your data, show ads, or track you across other apps and websites.

## 3. How We Process Your Data

Here is what happens to your information after you capture it in the app:

- **Audio recordings** are sent to Google Cloud (Vertex AI / Gemini) for speech-to-text transcription and to generate plain-language summaries
- **Document images** are sent to Google Cloud (Vertex AI / Gemma) for optical character recognition (OCR) to extract text from prescriptions, lab results, and medical documents
- **Recordings, images, and generated content** are stored in Google Cloud infrastructure (Cloud SQL, Cloud Storage, Firestore)
- **Push notifications** (such as medication or appointment reminders) are delivered via Google Firebase Cloud Messaging
- **Authentication** is handled by Google Firebase Authentication

Your information is used only to provide the features you use in the app. We do not use your health information for advertising.

## 4. Third-Party Processors

In the current version of RemiMinderAI, **Google Cloud Platform** is the sole third-party processor we use. This includes:

- Vertex AI, Gemini, and Gemma (transcription, summaries, and document reading)
- Firebase (authentication and push notifications)
- Cloud SQL, Cloud Storage, and Firestore (storage and databases)

These services process your data only on our behalf and only for the purposes described in this policy. If we add additional processors in the future, we will update this list and this Privacy Policy.

## 5. Data Security

We take the security of your information seriously and use industry-standard protections:

- **HTTPS encryption** — All data transmitted between your device, our website, and our servers is protected with HTTPS/TLS encryption in transit
- **Encryption at rest** — Recordings, documents, and account data stored in Google Cloud are encrypted at rest
- **Firebase security** — Authentication and access control are managed through Google Firebase Authentication and Firebase security rules so that only you (and caregivers you explicitly invite) can access your account data
- **Least-privilege access** — Our systems and team members access personal data only when needed to operate or support the Services

No method of transmission or storage is 100% secure. If we become aware of a security incident that affects your data, we will notify you as required by applicable law.

## 6. Data Retention

We retain your data only as long as needed to provide the Services or until you delete it:

- **Active data:** Recordings, transcripts, summaries, scanned documents, reminders, and account information remain stored until you delete them individually or delete your account
- **After deletion:** When you delete content or your account, we remove it from our active systems promptly
- **Backup retention:** Backup copies may remain temporarily as part of our normal backup retention process (typically up to 30 days) before permanent removal from our cloud infrastructure

For step-by-step instructions on deleting your account, see our [Delete Account](/delete-account) page.

## 7. Account Deletion

You can permanently delete your RemiMinderAI account and associated data at any time.

- **In the app:** Open RemiMinderAI → Profile → Delete Account, then confirm your request
- **By email:** Send a deletion request to **team@remiminderai.com** from the email address associated with your account
- **On the web:** Follow the instructions on our dedicated [Delete Account](/delete-account) page

When your account is deleted, we remove account information (name and email), doctor visit recordings, transcripts, AI-generated summaries, scanned medical documents, medication reminders, and related user data from our active systems, subject to the backup retention period described in Section 6.

## 8. Your Rights

Depending on where you live, you may have rights regarding your personal information, including the right to access, correct, or delete your data. You can:

- Delete individual recordings, summaries, and documents inside the app
- Request a copy of your data by emailing **team@remiminderai.com**
- Request full account deletion using the in-app flow, by email, or via our [Delete Account](/delete-account) page

We aim to respond to privacy requests within one business day. For more detail on how deletion works, visit [Delete Account](/delete-account).

## 9. No Sale of Data

We want to be clear: **we never sell your personal information to third parties.** Your data is shared only with the processors listed in Section 4, and only for the purposes described in this policy. We do not share your information with advertisers, data brokers, insurance companies, or anyone else for their own purposes.

## 10. Children's Privacy

RemiMinderAI is designed for adults and is not intended for or directed to children under 13. We don't knowingly collect personal information from children under 13.

If you are a parent or guardian and believe your child under 13 has provided us with information, contact us at team@remiminderai.com and we will delete it promptly.

## 11. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date above. For material changes, we will provide additional notice (for example, through an in-app notification or email). Your continued use of the Services after the effective date of the updated policy constitutes your acceptance of the changes.

## 12. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, contact us at:

**RemiMinderAI**
Email: team@remiminderai.com

---

*This Privacy Policy is provided for informational purposes. It does not constitute legal advice. RemiMinderAI recommends users consult with qualified legal counsel for specific questions about their rights under HIPAA, state privacy laws, or other applicable regulations.*
