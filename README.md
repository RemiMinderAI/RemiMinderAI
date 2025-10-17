
# MediMinder — Phase 3 Data Preparation (RAG-ready artifacts)

**Status:** Data preparation complete — RAG artifacts generated and validated. Ready for handoff to backend / LLM integration.

**Author:** Shehab Hegab
**Contact:** @Shehab-Hegab (Slack/Discord/GitHub)
**Last updated:** 2025-10-17 (use the notebook commit SHA for exact reproducibility)

---

## 1 — Project summary (short)

This repository contains the data preparation work for the MediMinderAI MVP.
The work prepares and validates the retrieval layer (RAG) for the summarization pipeline:

* Secure anonymization of patient identifiers.
* Cleaning and standardization of Synthea & medical transcription datasets.
* Chunking of long clinical text into overlapping passages for retrieval.
* Vectorization (sentence-transformer embeddings).
* FAISS index build and a retrieval validation test using the team prompt.

These outputs are intended to be consumed by the AI pipeline (LLM summarizer) and by frontend mock-ups / dashboards.

---

## 2 — Goal of this work

Provide **production-ready, privacy-preserving retrieval artifacts** that enable accurate, contextual prompts for the LLM summarizer. Deliverables allow the AI team to perform end-to-end tests (query → retrieve → summarize) without further data cleaning.

---

## 3 — Deliverables (what I produced)

> These are the files I generated and validated locally (Colab). Please confirm exact filenames in the repo / artifacts folder.

* `transcriptions_index.faiss` — FAISS vector index of all transcription chunks (normalized, ID-mapped).
* `chunked_transcriptions.parquet` — Chunk-level metadata and text (one row per chunk).
* `synthea_merged.parquet` *(or similar)* — Cleaned / standardized Synthea patient dataset used for dashboards/AI.
* `processed/v0.1/` — (recommended artifact folder; contains above files and manifest)
* `data_manifest.json` — Manifest describing sources, versions and artifact paths.
* `validation_report.json` — Quick validation statistics (row counts, null rates, unique patients).

> Note: Do **not** commit `.faiss` or large Parquet files to Git. Upload them to S3 (or secure storage) and keep references in the repo.

---

## 4 — High-level pipeline (what I ran)

1. Load source datasets (Synthea CSVs, transcription CSVs).
2. Clean & standardize fields (medications, demographics, timestamps).
3. Secure anonymization — `patient_id` → `patient_id_hashed` (deterministic, salted SHA256).
4. Deduplicate transcriptions and normalize timestamps to UTC (ISO8601).
5. Chunk long transcription text into overlapping passages (chunk_size ≈ 750 chars, overlap ≈ 150).
6. Encode chunks with `SentenceTransformer('all-MiniLM-L6-v2')` (batched).
7. Normalize embeddings (L2) and build `IndexFlatIP` + `IndexIDMap` FAISS index.
8. Save `chunked_transcriptions.parquet` and `transcriptions_index.faiss`.
9. Run RAG validation: encode query → retrieve top-k chunks → inject into Tina’s prompt template → verify context relevance.

---

## 5 — How to reproduce (run the notebook)

> The notebook contains sequential cells implementing the above steps. If you reproduce locally or in Colab, follow these minimal instructions.

### Prerequisites

* Python 3.8+ (3.11 recommended)
* Key packages: `pandas`, `numpy`, `pyarrow`, `sentence-transformers`, `faiss-cpu`
* Optional: `awscli` (for uploading artifacts to S3)

Example `requirements.txt` (minimal):

```
pandas
numpy
pyarrow
sentence-transformers
faiss-cpu
awscli
```

### Running in Colab / local:

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
2. **Set the hashing secret** (required before anonymization):

   * Preferred (production): store secret in a secrets manager (AWS Secrets Manager, GCP Secret Manager) or GitHub Actions secrets.
   * Local testing: set environment variable (Linux/macOS):

     ```bash
     export MEDIMINDER_SALT="your_long_random_secret"
     ```

     PowerShell (Windows):

     ```powershell
     $Env:MEDIMINDER_SALT="your_long_random_secret"
     ```
   * Colab: add the secret via the notebook secrets UI (left sidebar / keys panel) and enable notebook access so `os.environ['MEDIMINDER_SALT']` is available.
3. Open and run the notebook: `MediMinderAI_MVP_Data_Preparation.ipynb`. Run cells in order: cleaning → anonymization → chunking → embedding → index build → validation.
4. After successful run, confirm artifact files are created in `processed/v0.1/` (or configured output path).

---

## 6 — Handoff / upload instructions (what I need from the infra team)

To integrate my artifacts with the AI pipeline, the following are required:

1. **S3 bucket (or equivalent)**

   * Path example: `s3://mediminder-rag-data/v0.1/`
   * Required files to upload:

     * `transcriptions_index.faiss`
     * `chunked_transcriptions.parquet`
     * `data_manifest.json`
     * `validation_report.json`

2. **Access**

   * Please grant me write access (or provide pre-signed upload link).
   * If you prefer, I can upload after you create the bucket; share the bucket name and IAM / presigned instructions.

3. **Suggested upload commands (AWS CLI):**

   ```bash
   aws s3 cp transcriptions_index.faiss s3://mediminder-rag-data/v0.1/
   aws s3 cp chunked_transcriptions.parquet s3://mediminder-rag-data/v0.1/
   aws s3 cp data_manifest.json s3://mediminder-rag-data/v0.1/
   ```

---

## 7 — Security & compliance notes (must read)

* **Do not commit** any raw PHI or large binary artifacts to version control. Use secure storage (S3 with encryption, access control).
* **Salt management:** `MEDIMINDER_SALT` must be kept secret. Use secrets manager or GitHub Actions/Colab secrets. Never store the salt in the repo.
* **Anonymization is deterministic:** hashed IDs allow linking across datasets without exposing original PHI. Keep mapping / salt secure.
* **Logging & access:** limit access to artifact storage to project members only (least privilege).

---

## 8 — Validation & QA performed

* Deduplication applied to transcription texts (kept most recent where applicable).
* Timestamps normalized to UTC and converted to ISO8601.
* Embeddings created in batches and L2-normalized.
* FAISS index built with ID mapping; retrieval tested with representative queries (e.g., allergy / Nasonex).
* Validation report generated (`validation_report.json`) with counts and null rates.

---

## 9 — What I expect the integration team to do next

* Provision secure storage (S3) and provide access.
* Integrate the artifact loader into the backend AI pipeline:

  * load `transcriptions_index.faiss` and `chunked_transcriptions.parquet`
  * expose an API endpoint to retrieve top-k chunks for a query
  * feed retrieved context into the LLM prompt template for summarization
* Run E2E tests with the LLM (Flan-T5 / Phi-3 or chosen model).

---

## 10 — Files & recommended repo structure (example)

```
/notebooks
  MediMinderAI_MVP_Data_Preparation.ipynb
/processed
  /v0.1
    transcriptions_index.faiss   # *DO NOT COMMIT* — upload to S3
    chunked_transcriptions.parquet  # *DO NOT COMMIT*
    data_manifest.json
    validation_report.json
/README.md
/requirements.txt
```

---





