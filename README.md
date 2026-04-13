# PharmaKhabri

A full-stack pharmaceutical news aggregator application. It automatically fetches the latest news from various sources and presents them in a clean, modern user interface.

## System Architecture

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Job Processing:** BullMQ & Redis (for background news ingestion)
- **Workflows:** n8n (optional automation workflows)

## Project Structure

- `frontend/` - Contains the Next.js UI application
- `backend/` - Contains the Express API and ingestion services
- `n8n/` - Automation workflows

## Getting Started

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
