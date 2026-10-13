<div align="center">

# Route

### Real-time web analytics, one event at a time.

Track page views, sessions, and custom events with a lightweight script, then watch them land on your dashboard live.

[Features](#-features) · [How it works](#-how-it-works) · [Getting started](#-getting-started) · [Tracking script](#-tracking-script) · [Deployment](#-deployment) · [Roadmap](#-roadmap)

</div>


## ✨ Features

- **Lightweight tracking script**: drop one snippet into any website to collect page views, sessions, and custom events.
- **Live dashboard**: new events stream to connected dashboards instantly via [Ably](https://ably.com), with no refreshing.
- **Multi-project support**: create separate projects for each website you track.
- **Event collection API**: a Next.js API route validates, stores, and broadcasts incoming events.
- **Persistent storage**: projects, sessions, and events live in PostgreSQL (hosted on Neon).
- **Type-safe data layer**: Prisma ORM keeps your schema and queries in sync.
- **Serverless-ready**: designed to deploy on Vercel with minimal configuration.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router and API routes) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| UI | [React](https://react.dev) |
| Database | [PostgreSQL](https://www.postgresql.org) on [Neon](https://neon.tech) |
| ORM | [Prisma](https://www.prisma.io) |
| Real-time | [Ably](https://ably.com) |
| Hosting | [Vercel](https://vercel.com) |

## 🏗️ How It Works

1. A website sends an event to the collection API through the tracking script.
2. The backend validates the payload and stores it in PostgreSQL.
3. The backend publishes the event to an authorized Ably channel for that project.
4. Connected dashboards receive the update immediately, with no page refresh.

PostgreSQL stays the **source of truth** for analytics data. Ably handles **real-time delivery** only.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- npm
- A [Neon](https://neon.tech) PostgreSQL database
- An [Ably](https://ably.com) account and API key
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL connection string
DATABASE_URL="your_neon_database_url"

# Private Ably API key (server-side only, never expose to the browser)
ABLY_API_KEY="your_private_ably_api_key"
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connection string for your Neon PostgreSQL database |
| `ABLY_API_KEY` | Private Ably key used by the server to publish events and issue tokens |

> ⚠️ Never commit `.env.local`. Make sure it's listed in your `.gitignore`.

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 📡 Tracking Script

Add the Route script to any website you want to track:

```html
<script
  defer
  src="https://<YOUR_ROUTE_DOMAIN>/route.js"
  data-project-id="<YOUR_PROJECT_ID>"
></script>
```

> Update the script URL and attributes to match your implementation.

### Collection API

Events are sent to the collection endpoint with an HTTP `POST`:

```http
POST /api/collect
Content-Type: application/json
```

```json
{
  "projectId": "<YOUR_PROJECT_ID>",
  "type": "pageview",
  "url": "https://example.com/pricing",
  "referrer": "https://google.com",
  "sessionId": "<SESSION_ID>"
}
```

> Adjust the endpoint path and payload fields to match your actual API.

## ⚡ Real-Time Updates

Route uses Ably to push newly collected events to every connected dashboard.

- The **server** holds the private Ably API key and publishes events.
- The **browser** never sees that key. It authenticates through short-lived tokens issued by the backend.
- Each project publishes to its own channel, so users only receive events for projects they're authorized to view.

## ☁️ Deployment

Route is built to run on **Vercel** (app and API routes), **Neon** (database), and **Ably** (real-time messaging).

**Pre-deployment checklist**

- [ ] Add `DATABASE_URL` and `ABLY_API_KEY` as production environment variables
- [ ] Apply migrations to the production database: `npx prisma migrate deploy`
- [ ] Confirm Ably credentials are available only on the server
- [ ] Configure authentication and project-level channel permissions
- [ ] Test event collection, database persistence, and live dashboard updates end to end

## 🔐 Security Considerations

- Keep database credentials and Ably API keys private.
- Authenticate dashboard users and authorize access per project.
- Validate every incoming event on the server.
- Apply rate limiting to the public collection endpoint.
- Use token authentication for browser-based Ably clients.
- Collect only what you need and avoid personal or sensitive information.

## 🗺️ Roadmap

- [ ] Enhanced visitor and session analytics
- [ ] Custom event tracking
- [ ] Real-time visualizations
- [ ] Project-level filters
- [ ] Date-range reporting
- [ ] Traffic and event breakdowns
- [ ] Performance and reliability improvements

Have an idea? [Open an issue](../../issues) and let's talk about it.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request describing your changes

## 📄 License

This project is licensed under the **<LICENSE_NAME>** license. See the [LICENSE](./LICENSE) file for details.

> Add a `LICENSE` file to the repository (MIT is a common choice) and update this section.

---

<div align="center">

**Route**: understand your website activity, one event at a time.

</div>
