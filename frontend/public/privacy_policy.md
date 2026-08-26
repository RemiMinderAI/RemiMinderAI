# Privacy Policy

**Effective Date:** July 14, 2026
**Last Updated:** July 14, 2026

## 1. Introduction

RemiMinderAI ("RemiMinderAI," "we," "us," or "our") is a personal recorder and reminder app designed for older adults managing their own healthcare and the family members or friends who help them. This Privacy Policy explains what information we collect, how we use it, and your rights. It applies to the RemiMinderAI mobile application (iOS and Android), our website at remiminderai.com, and related services (collectively, the "Services").

By using the Services, you agree to the practices described here. If you don't agree, please don't use the Services.

### Note on HIPAA Compliance

RemiMinderAI is designed with privacy best practices aligned to HIPAA principles (encryption, access controls, no sale of data). However, RemiMinderAI is not a HIPAA-covered entity and does not operate under a Business Associate Agreement (BAA). If you require HIPAA-covered services for your healthcare practice, please consult with qualified legal counsel. For individual users, our encryption and privacy practices provide strong data protection.

## 2. Information We Collect

We collect only what we need to help you record doctor visits, scan medical documents, and keep plain-language summaries you can refer back to later:

- **Audio recordings of doctor visits** — captured via the in-app recorder after users confirm they have obtained any required consent from participants
- **Document images** — photos of prescriptions, lab results, and medical documents, captured via the in-app camera
- **Transcripts** — text generated from your audio recordings
- **Plain-language summaries** — AI-generated summaries of your visits and scanned documents, provided for informational purposes to help users organize healthcare information
- **Account information** — your email address and name, provided when you register using email/password or Google Sign-In
- **Device information and app usage data** — details about your phone or tablet and how you use the app, to help us troubleshoot problems

We do not sell your data, show ads, or track you across other apps and websites.

## Voice & Audio Data (RemiVox)

RemiMinderAI includes RemiVox, an optional voice companion that lets you ask questions about your health records and set reminders using your voice.

**What we collect when you use RemiVox:**

- **Voice audio** — captured through your device microphone only while the RemiVox button is actively pressed
- **Text transcript** — generated from your voice audio
- **Question or command** — as interpreted by our AI system
- **AI-generated spoken response** — delivered back to you

**RemiVox does not listen in the background.** Audio capture occurs only when you actively initiate a voice interaction by pressing the RemiVox button. A visible on-screen indicator confirms when audio capture is active.

## Third-Party AI Services (RemiVox)

RemiVox processes your voice through three third-party services to convert your speech into a response. Each service receives only the data it needs to perform its specific function:

| Service | Provider | What it receives | Purpose |
| --- | --- | --- | --- |
| Speech-to-Text | Deepgram, Inc. | Your voice audio | Converts your spoken words into text |
| AI Understanding | Google (Gemini API) | Your transcribed text and relevant health record context | Understands your question and generates an appropriate response |
| Text-to-Speech | Smallest AI, Inc. (Lightning) | The AI-generated response text | Converts the response text into natural-sounding speech |

**How your data flows:**

1. Your voice audio is streamed to Deepgram, which returns a text transcript. Deepgram does not store your audio after transcription is complete.
2. The transcript, along with relevant context from your health records (such as medication names or appointment details needed to answer your question), is sent to Google's Gemini API. Gemini processes the request and returns a text response. Per Google's API data usage policies, data sent through the Gemini API is not used to train Google's models.
3. The response text is sent to Smallest AI's Lightning service, which returns synthesized speech audio played back to you.

No third-party service listed above receives your full health record. Each service receives only the minimum data required for its function.

**Third-party privacy policies:**

- [Deepgram](https://deepgram.com/privacy)
- [Google Gemini API](https://ai.google.dev/gemini-api/terms)
- [Smallest AI](https://smallest.ai/privacy)

## Doctor Visit Recordings

When you use the Record feature to capture a doctor visit, your audio is processed by Deepgram's speech-to-text service to generate a transcript. The same data handling practices described above for Deepgram apply. Visit recordings are stored on your device and in your encrypted cloud account. AI-generated summaries of your visits are processed through Google's Gemini API.

## Document Scanning

When you scan lab results, prescriptions, or other health documents, the document image is processed on-device using optical character recognition. Extracted text may be sent to Google's Gemini API for structured interpretation. The same data handling practices described above for Google apply.

## Data Retention & Deletion (RemiVox)

- **Voice audio (RemiVox):** Streamed in real time and not stored by RemiMinderAI or any third-party service after the interaction completes.
- **Transcripts & AI responses:** Stored in your account to provide conversation history. You can delete individual interactions or your entire RemiVox history from Settings > Privacy > Voice History.
- **Visit recordings & summaries:** Stored in your account until you delete them. You can delete individual recordings from the visit detail screen.
- **Account deletion:** You can delete your entire account and all associated data from Settings > Account > Delete Account. Deletion is permanent and completed within 30 days.

## Health Data

RemiMinderAI is a consumer wellness tool. It is not a medical device and is not subject to HIPAA. However, we recognize that the information you store — doctor visit recordings, lab results, medication lists — is sensitive. We protect it with:

- Encryption in transit (TLS 1.2+) for all data sent to third-party services
- Encryption at rest for all stored health records
- No sale of your personal or health data to any third party, ever
- No use of your data to train AI models

## 3. How We Process Your Data

Here is what happens to your information after you capture it in the app:

- **Audio recordings** are sent to Deepgram for speech-to-text transcription. The resulting transcript may be sent to Google Gemini to generate plain-language summaries
- **Document images** are processed on-device for optical character recognition (OCR). Extracted text may be sent to Google Gemini for structured interpretation
- **Recordings, images, and generated content** are stored in Google Cloud infrastructure (Cloud SQL, Cloud Storage, Firestore)
- **Push notifications** (such as medication or appointment reminders) are delivered via Google Firebase Cloud Messaging
- **Authentication** is handled by Google Firebase Authentication

Your information is used only to provide the features you use in the app. We do not use your health information for advertising.

## 4. Data Security

Your health information deserves protection. Here's how we keep it secure:

- **Encryption in Transit:** All data transmitted between your device and our servers uses HTTPS/TLS encryption
- **Encryption at Rest:** Your data is encrypted when stored in Google Cloud infrastructure
- **Access Controls:** Firebase security rules prevent unauthorized access to your data—only you and our system can access your recordings and documents
- **No Third-Party Selling:** Your health data is never sold to advertisers, data brokers, or insurance companies
- **Limited Processing:** Your data is processed only by Google Cloud services for transcription, summarization, and OCR—never for any other purpose

No method of transmission or storage is 100% secure. If we become aware of a security incident that affects your data, we will notify you as required by applicable law.

## 5. Third-Party Processors

RemiMinderAI uses the third-party processors described in the RemiVox sections above, as well as Google Cloud Platform for core account, storage, notification, and AI functionality. Google Cloud includes:

- **Gemini and Gemma** — for plain-language summaries and structured interpretation of medical documents
- **Firebase** — for user authentication and push notifications (medication and appointment reminders)
- **Cloud SQL, Cloud Storage, and Firestore** — for storing and managing your recordings, documents, and account information

These services process your data only on our behalf and only for the purposes described in this policy. Google Cloud services are contractually bound to maintain confidentiality and use your data only as instructed by us. They are not permitted to use your information for advertising or unrelated purposes. If we add additional processors in the future, we will update this list and notify you of material changes to this Privacy Policy.

## In-App Purchases

RemiMinderAI uses RevenueCat to manage in-app purchases, subscriptions, and purchase restoration across supported platforms.

When you make or restore a purchase, limited information related to your purchase (such as anonymous app user identifiers, subscription status, and transaction information) may be processed by RevenueCat to validate purchases and manage your subscription.

Payment card information is processed by the Apple App Store or Google Play and is never collected, processed, or stored by RemiMinderAI.

For more information, please review RevenueCat's Privacy Policy:
[https://www.revenuecat.com/privacy](https://www.revenuecat.com/privacy)

## 6. Data Retention and Deletion

**You are in control of your data.**

### Access Your Data

You have the right to request a copy of all your data in a portable, machine-readable format. Contact us at **team@remiminderai.com** to submit a data access request. We will provide your data within 30 days of receipt.

### Delete Individual Content {#delete-individual-content}

You can delete individual recordings, summaries, and scanned documents at any time from within the app without deleting your account. This gives you granular control over your data:

- **Delete voice recordings:** Remove doctor visit audio from your account
- **Delete transcripts and summaries:** Remove generated summaries anytime
- **Delete scanned documents:** Remove individual scanned medical documents (including lab results, prescriptions) from your account

### Account Deletion

You can delete your account and all associated data in two ways:

- **In the app:** Go to Profile → Delete Account and confirm
- **By email:** Contact **team@remiminderai.com** using the email address associated with your account

For detailed steps and options, see our [Delete Account](/delete-account) page.

### Data Retention

- Your data remains stored until you delete it
- Recordings, summaries, documents, and account information are retained for as long as your account is active
- When you delete individual content or your account, we remove it from our active systems
- Backup copies may remain for up to 30 days as part of our standard backup retention schedule before permanent removal

## 7. No Sale of Data

We want to be clear: **we never sell your personal information to third parties.** Your data is shared only with the processors listed in Section 5, and only for the purposes described in this policy. We do not share your information with advertisers, data brokers, insurance companies, or anyone else for their own purposes.

## 8. Children's Privacy

RemiMinderAI is designed for adults (18+) and is not intended for children or users under the age of 18. We don't knowingly collect personal information from children.

If you are a parent or guardian and believe a child under 18 has provided us with information, contact us at team@remiminderai.com and we will delete it promptly.

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date above. For material changes, we will provide additional notice (for example, through an in-app notification or email). Your continued use of the Services after the effective date of the updated policy constitutes your acceptance of the changes.

## 10. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, contact us at:

**RemiMinderAI**
Email: team@remiminderai.com

For account deletion requests, visit our [Delete Account](/delete-account) page or email the address above.

---

*This Privacy Policy is provided for informational purposes. It does not constitute legal advice. RemiMinderAI recommends users consult with qualified legal counsel for specific questions about their rights under HIPAA, state privacy laws, or other applicable regulations.*
