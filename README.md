# Bold Stock

An inventory management system designed for tracking warehouse stock, receipts, deliveries, and item movements.

---

## Project Overview

Bold Stock helps manage inventory operations across multiple warehouses and enables accurate tracking of stock logs. The system connects a dynamic web interface to a secure backend pipeline and database, bridging managers to accurate warehouse counts in real-time.

---

## Core Features

*   **Dashboard Analytics:** Displays ambient metrics, late operations, and stock value totals.
*   **Receipt Operations:** Logs and creates incoming shipments securely into stock.
*   **Delivery Operations:** Tracks outgoing stock and validates product availability beforehand.
*   **Stock Tracking:** Views exact items on-hand count lists across absolute layouts.
*   **Move History Logs:** Audits detailed logs of operations with locations movement history.
*   **Warehouse Management:** Organizes locations belonging to specific code frameworks.
*   **Authentication System:** Secures API routes and user nodes with session access layout thresholds.

---

## Tech Stack

*   **Frontend:** React (Next.js 15+ App Router), Framer Motion, Vanilla CSS
*   **Backend API:** Next.js API Routes (Serverless endpoints)
*   **Database:** PostgreSQL (Relational index layout)
*   **ORM:** Prisma ORM
*   **Authentication:** JWT (HTTPOnly Cookies)
*   **Email Service:** Nodemailer (SMTP Dispatch)

---

## System Architecture

The frontend components trigger HTTP requests into Next.js API Routes. The APIs communicate through the PrismaClient query engine directly connected into the PostgreSQL Database.

```mermaid
graph TD
    Client[User / Browser] -->|HTTP Requests| NextJS[Next.js App Router]
    NextJS -->|Views| React[React Components]
    NextJS -->|Endpoints| API[API Routes]
    API -->|Queries| Prisma[Prisma ORM]
    Prisma -->|Writes/Reads| Postgres[(PostgreSQL Database)]
```

---

## Project Structure

*   **/app:** Frontend page routes and Next.js Backend API handlers.
*   **/components:** Reusable visual UI modular components template sets.
*   **/prisma:** Database client model schemas definition layout benchmarks.
*   **/lib:** Shared helper singletons including definition for `prisma.ts`.
*   **/context:** React context bundles managing user and inventory stateful streams.

---

## Environment Variables

Create a file named `.env.local` inside the workspace folder with the following variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string URL (`postgresql://user:pass@host:port/db`) |
| `JWT_SECRET` | Secret key used to sign authorization authorization headers |
| `SMTP_HOST` | Hostname address supporting Nodemailer SMTP routers sets |
| `SMTP_PORT` | Port binding supporting Nodemailer layout thresholds |
| `SMTP_USER` | Email user authentication supportive loaders |
| `SMTP_PASS` | Password authorization for SMTP Dispatch layouts |
| `EMAIL_FROM` | Dispatch headers identification origin address |

---

## Installation & Setup

Follow these commands inside your local environment to start the workflow:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd ims-frontend-next/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Environment:**
   Add a `.env.local` and `.env` according to the variables mentioned above.

4. **Spin up local Infrastructure (Optional with Docker):**
   ```bash
   docker compose up -d
   ```

5. **Sync Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start server:**
   ```bash
   npm run dev
   ```

---

## Database Setup

This project utilizes **Prisma ORM** coupled with a PostgreSQL driver.
To push schema updates to the connected database without creating migrators overheads inside developer sessions, simply run:
```bash
npx prisma db push
```
To view database records visually using a GUI dashboard:
```bash
npx prisma studio
```

---

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Registers a user account nodes thresholds |
| `/api/auth/login` | POST | Authenticates user credentials layout multipliers |
| `/api/products` | GET / POST | Manages Product item creation lists accurately |
| `/api/receipts` | GET / POST | Manages incoming receipts document structures |
| `/api/deliveries` | GET / POST | Manages outgoing deliveries document items |
| `/api/warehouses`| GET / POST | Creates supportive locations endpoints links |

---

## Future Improvements

*   **Real-time synchronization:** Integrating Socket.io interfaces for updates.
*   **Role-Based Access:** Standardizing permissions layout levels flawlessly setup.
*   **Advanced Analytics:** Plotting metrics variables trackers flawlessly set triggers.
*   **Multi-warehouse allocations:** Adding transfer movements between warehouses correctly.
