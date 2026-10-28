# Manbir Narang | Realtor website

A Next.js site for Manbir Narang, RE/MAX Mid-Island Realty (Port Alberni).
Listings and enquiries live in **Supabase**, the code lives on **GitHub**, and the site is hosted on **Vercel**.

Pages: Home, Properties, Buy, Sell, Communities, About, Contact, plus a private `/admin` page for adding listings.

---

## Put it live (about 30 to 45 minutes)

### 1. GitHub: store the code
1. Sign in at github.com, click **New repository**, name it `manbir-narang-site`, keep it **Private**, and create it.
2. On the new repo page click **uploading an existing file**, then drag in everything from this folder (the unzipped project).
3. Click **Commit changes**.

### 2. Supabase: the database for listings and enquiries
1. Sign in at supabase.com, click **New project**, name it, pick a region close to you (Canada Central), and set a database password (save it).
2. Open **SQL Editor**, click **New query**, paste in everything from `supabase/schema.sql`, and click **Run**. This creates the listings table, the enquiries table, the photo storage bucket, and the security rules.
3. Open **Authentication > Users > Add user > Create new user**. Use your own email and a strong password, and tick **Auto confirm user**. This is your admin login.
4. Open **Authentication > Sign In / Providers** and turn **off** "Allow new users to sign up". This stops anyone else from creating an account.
5. Open **Project Settings > API** and copy two things: the **Project URL** and the **anon public** key.

### 3. Vercel: publish the site
1. Sign in at vercel.com with your GitHub account, click **Add New > Project**, and import `manbir-narang-site`.
2. Before clicking Deploy, open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = the Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the anon public key
   - `NEXT_PUBLIC_SITE_URL` = your site address (use the Vercel one first, for example `https://manbir-narang-site.vercel.app`, and change it once your domain is connected)
3. Click **Deploy**. In about a minute you will have a live link.

### 4. Domain
1. Buy a domain from a registrar such as Cloudflare Registrar, Namecheap, or Vercel itself (roughly $15 to $25 a year). Good options to check: `manbirnarang.com`, `manbirnarang.ca`, `manbirsellsalberni.com`, `albernirealtor.ca`.
2. In Vercel open your project, go to **Settings > Domains**, add the domain, and follow the DNS instructions it shows.
3. Update `NEXT_PUBLIC_SITE_URL` to the real domain and **Redeploy**.

---

## Adding and editing listings

1. Go to `yourdomain.com/admin` and sign in with the user from step 2.3.
2. Click **+ Add listing**, fill in the details, upload photos (the first photo is the cover), and **Save**.
3. The public site updates within about a minute.
4. Until you add your first real listing, the site shows six sample homes. Once any listing exists, only your real ones appear.
5. Each listing gets its own page at `yourdomain.com/web-address`. Set **Web address** in the form (or leave it blank to use the title). Fill in MLS number, year built, taxes, lot size and features (one per line) to show them on that page.
6. Use **Show on the website** to hide a listing without deleting it. Set status to **Sold** to move it to the Sold filter.
7. The **Enquiries** tab shows every message from the contact and home valuation forms. Delete them once handled.

## Things to replace with your real details

All of these are placeholders right now:
- Phone `250-000-0000`, email `manbir@example.com`, and office address: `src/lib/data.ts`
- Testimonials, blog posts, community prices and home counts, stats, and the partner boxes: `src/lib/data.ts` and `src/app/(site)/page.tsx`
- Hours and the map on the Contact page: `src/app/(site)/contact/page.tsx`
- Hero video: replace `public/hero.mp4` and `public/hero-poster.jpg` (keep it under about 5 MB, muted, 15 to 25 seconds)
- Photo of you: `public/images/manbir.jpg`

Before launch, check with your managing broker about RE/MAX branding and advertising rules for your site.

## Run it on your own computer (optional)

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Notes

- The site works without Supabase connected (it shows the sample listings and the forms say they are not connected), so you can preview it first.
- Only the public anon key is used in the browser. Security comes from the database rules in `supabase/schema.sql`: visitors can read published listings and send enquiries, and only your signed-in admin can change anything.
- Not built yet: a page for each individual listing, and a live MLS feed. Both can be added later.
