# 💸 CashFlowt - Personal Expense Tracker

A simple full-stack web app for tracking your expenses *and* incomes — built with **Next.js**, **Supabase**, and **Tailwind CSS**.

## 📚 Features

✅ Sign up & log in with Supabase Auth  
✅ Create, view, and manage transactions  
✅ Supports **expenses & incomes** in one table  
✅ Import transactions from CSV (with date parsing, case-insensitive headers)  
✅ Filters for **date ranges, category, and currency**  
✅ Default currency set to **IDR** (supports multiple currencies)  
✅ Dashboard to view transactions in a table

---

## 🚀 Tech Stack

- **Next.js** — frontend framework
- **Supabase** — database & authentication
- **Tailwind CSS** — simple styling
- **PapaParse** — client-side CSV parsing

---

## ⚙️ Getting Started

1️⃣ **Clone the repo**

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
````

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Create a `.env.local` file**

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these in your Supabase dashboard under `Project Settings > API`.

4️⃣ **Run locally**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## ✅ Database Schema

**`transactions` table**

| Column        | Type      | Notes                             |
| ------------- | --------- | --------------------------------- |
| `id`          | UUID      | Primary key                       |
| `user_id`     | UUID      | References `auth.users`           |
| `date`        | DATE      | Transaction date                  |
| `name`        | TEXT      | Required                          |
| `amount`      | FLOAT     | Required                          |
| `type`        | TEXT      | `expense` or `income`             |
| `category`    | TEXT      | Optional                          |
| `description` | TEXT      | Optional                          |
| `status`      | TEXT      | e.g., `cleared`                   |
| `currency`    | TEXT      | Defaults to `IDR`                 |
| `created_at`  | TIMESTAMP | Defaults to `now()`               |
| `updated_at`  | TIMESTAMP | Defaults to `now()`, auto-updated |

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── TransactionForm.tsx
 │   ├── CSVImport.tsx
 │   ├── TransactionFilters.tsx
 ├── lib/
 │   └── supabaseClient.js
 ├── app/
 │   ├── dashboard/page.tsx
 │   ├── signup/page.tsx
 │   ├── login/page.tsx
```

---

## 📥 CSV Import

* Must include at least `name` and `amount`.
* Supports `dd/mm/yyyy` date format (handles 2-digit years as 2000+).
* Other columns (`type`, `category`, `description`, `status`, `currency`) are optional.
* Headers are case-insensitive and can be in any order.

**Example:**

```csv
name,amount,date,type,category,description,status,currency
Coffee,3.5,10/07/25,expense,Food,Latte,cleared,IDR
Salary,2000,01/07/25,income,Job,Monthly salary,cleared,IDR
```

---

## 🔍 Filters

The dashboard lets you filter your transactions by:

* Start and end date
* Category (partial match)
* Currency

The filters update the results in real time.

---

## 🗺️ Next Steps

Here are some ideas for what to build next:

* ✅ Add charts (e.g., spending over time)
* ✅ Add sorting & pagination
* ✅ Export transactions to CSV
* ✅ Add user profile & settings
* ✅ Support recurring transactions

---

**Happy tracking! ✨**

```

---

## ✅ Tips
- Replace `yourusername/your-repo` with your actual repo link.  
- Adjust the schema table if you add new fields.  
- Add a screenshot or demo link if you want to show it off.

---

If you want, I can generate:
- ✅ `LICENSE`
- ✅ `CONTRIBUTING.md`
- ✅ `next.config.js` tweaks

Just say **“make those too!”** 🚀
```


###########################################################

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
