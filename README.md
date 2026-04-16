# PharmaKhabri 💊📰

## 🔍 What is PharmaKhabri?
It’s a modern, automated platform that centralizes the latest news from diverse pharmaceutical sources into a clean, intuitive dashboard. No more manual searching; the insights come to you.

## ⚙️ How it Works (The Workflow)
I’ve integrated a robust tech stack to ensure the data is fresh, unique, and actionable:

- **Automated Ingestion:** An ingestion worker runs every 2 hours, fetching data from various RSS feeds and News APIs (PubMed, FDA).
- **Smart Deduplication:** Using MD5 hashing (Title + Source), the system ensures no duplicate stories clutter your feed.
- **Data Integrity:** News is stored and managed in MongoDB Atlas, with a REST API serving the data to a sleek Next.js frontend.
- **Daily Digest:** An n8n automation workflow runs every morning at 08:00 to fetch the top 10 stories and send a personalized email digest to subscribers.

## 📸 Sneak Peek
![PharmaKhabri Demo](Screenshot%202026-04-17%20015408.png)

## 🚀 Features
- **Automated Aggregation:** Ingests the latest pharmaceutical news periodically using background jobs.
- **Modern UI:** Responsive, clean interface built with Next.js and Tailwind CSS.
- **Robust Backend:** Node.js & Express API for robust data delivery.
- **Reliable Queuing:** Redis & BullMQ handle ingestion smoothly.
- **Workflow Automation:** Integrated with n8n for advanced digest and notification workflows.

## 🏗️ System Architecture

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Job Processing:** BullMQ & Redis (for background news ingestion)
- **Workflows:** n8n (optional automation workflows)

## 📂 Project Structure

- `frontend/` - Contains the Next.js UI application
- `backend/` - Contains the Express API and ingestion services
- `n8n/` - Automation workflows

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance
- Redis server instance

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your connection sizes and API keys (e.g., NewsAPI key, MongoDB URI, Redis URI).
4. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.local.example` to `.env.local`.
4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:4000`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
