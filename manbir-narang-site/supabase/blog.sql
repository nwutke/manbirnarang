-- Blog: run once in Supabase -> SQL Editor -> New query -> Run. Safe to run again.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  published_on date not null default current_date,
  summary text,
  body text not null default '',
  cover text,
  published boolean not null default true
);

alter table public.posts enable row level security;

drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts" on public.posts
  for select using (published = true);

drop policy if exists "admin reads all posts" on public.posts;
create policy "admin reads all posts" on public.posts
  for select to authenticated using (true);

drop policy if exists "admin writes posts" on public.posts;
create policy "admin writes posts" on public.posts
  for all to authenticated using (true) with check (true);

-- Four starter articles (skipped if a post with the same web address already exists)
insert into public.posts (slug, title, published_on, summary, body, cover, published) values
  ($p$sproat-lake-or-alberni-inlet$p$, $p$Sproat Lake or Alberni Inlet: which waterfront suits you?$p$, '2026-10-20', $p$Fresh water or salt water? A look at the lifestyle, access and practical questions that come with each shoreline.$p$, $p$Waterfront is one of the main reasons people fall in love with the Alberni Valley. But Sproat Lake and the Alberni Inlet offer very different ways of living on the water, and the right choice depends on how you plan to use it.

## Life on Sproat Lake

Sproat Lake is a large freshwater lake just west of Port Alberni. In summer it is all about swimming, paddling, waterskiing and long evenings on the dock. Many properties are recreational or seasonal, though more people are choosing to live at the lake year-round.

What buyers usually love:

- Warm, swimmable water in summer
- A strong cabin and boating community
- Quiet surroundings, minutes from town

## Life on the Alberni Inlet

The Alberni Inlet is a long saltwater fjord that runs from Port Alberni out to Barkley Sound and the open Pacific. It suits people who want ocean access for fishing, boating and exploring the coast, along with big water and mountain views.

What buyers usually love:

- Direct boat access toward Barkley Sound, Bamfield and the Broken Group Islands
- World-class salmon fishing
- A working-harbour character close to town

## Practical questions to ask on either shoreline

- **Docks and moorage.** In BC, the foreshore is usually Crown land. Ask whether any dock, buoy or boathouse has the right provincial authorization, and what it would take to add or change one.
- **Water supply.** Some waterfront homes draw water from the lake or a well rather than a municipal system. Find out the source, how it is treated, and get it tested.
- **Septic.** Many waterfront homes outside city limits use septic systems. Ask for records and consider an inspection by a qualified professional.
- **Zoning and setbacks.** Rules for building near the water depend on whether the property is in the City of Port Alberni or the Alberni-Clayoquot Regional District. Check before you plan an addition or a new shop.
- **Flood and tsunami mapping.** Low-lying areas near the inlet have tsunami and flood considerations. Local hazard maps are worth a look, and they can affect insurance.
- **Year-round access.** Check road access and maintenance in winter, especially for properties down steep driveways.

## Which one is right for you?

If summers on the dock, swimming and calm water sound ideal, Sproat Lake is hard to beat. If you picture heading out for salmon at dawn or cruising to Barkley Sound, the inlet is likely the better fit.

I am happy to walk you through properties on both shorelines and help you weigh up the details. Get in touch any time.$p$, $p$/images/listing-4.jpg$p$, true),
  ($p$buying-acreage-in-the-alberni-valley$p$, $p$What to know before buying acreage in the valley$p$, '2026-10-06', $p$Wells, septic, zoning and access: the questions worth asking early when you are looking at rural property.$p$, $p$Acreage in places like Beaver Creek and Cherry Creek offers space, privacy and room for gardens, animals or a workshop. Rural property also comes with systems and rules that most city homes don't have. Here is what I recommend checking early.

## Water: wells

Most acreages rely on a private well. Before you commit, find out:

- **How much water it produces.** A flow test shows whether the well can keep up with a household, gardens or livestock, including in late summer.
- **Water quality.** Have the water tested by an accredited lab for bacteria and common minerals.
- **The well's history.** Many BC wells are listed in the province's groundwater well database, which can show depth and construction details.

## Septic systems

In BC, septic (onsite sewage) systems must be designed and installed by a qualified professional. Ask the seller for records of when the system was installed, its type and size, and when it was last pumped. An inspection is money well spent, because replacing a system is a major cost.

## Zoning and land use

Most acreage outside city limits falls under the Alberni-Clayoquot Regional District. Zoning controls what you can build and how you can use the land, including secondary suites, home businesses, shops and livestock. Also check whether the property is in the Agricultural Land Reserve (ALR), which has its own rules on building and land use.

## Access and services

- Is the road public and maintained year-round, or is it a private road with a shared maintenance arrangement?
- Are there easements or rights-of-way registered on title?
- What are the options for internet and cell coverage?
- How far is the nearest fire hall? Distance to fire protection can affect your home insurance.

## Buildings and outbuildings

Barns, shops and cabins add a lot of value, but confirm that they were built with permits where required. A home inspection should cover the main house, and you may want a specialist to look at outbuildings, wood stoves and electrical work.

## Build these checks into your offer

Most of these questions can be answered with the right conditions in your offer, giving you time to test the water, inspect the septic and review the documents before you are fully committed.

If you are thinking about acreage in the valley, I can help you find the right property and make sure nothing is missed along the way.$p$, $p$/images/listing-3.jpg$p$, true),
  ($p$how-to-price-your-port-alberni-home$p$, $p$How to price your Port Alberni home to sell$p$, '2026-09-22', $p$Why the right price at launch matters most, and how a realistic number is built.$p$, $p$Price is the single biggest factor in how quickly a home sells and how much it sells for. Getting it right from day one matters more than any other decision you make as a seller.

## The first few weeks matter most

When a home first comes on the market, it gets the most attention it will ever get. Buyers who have been watching the market see it right away, and agents bring their clients through quickly. If the price is right, that early interest can turn into strong offers.

If the price is too high, many buyers skip the home completely. As the days on market add up, buyers start to wonder what's wrong with it, and a price reduction can end up selling the home for less than a realistic price at the start would have.

## Your assessment is not your price

Your BC Assessment value is a useful reference, but it is not a market price. Assessments are based on market conditions as of July 1 of the year before, and they can't reflect your home's condition, updates or the details that buyers pay for.

## How a good price is built

I put together a comparative market analysis that looks at:

- **Recent sales** of similar homes nearby, adjusted for size, lot, condition and updates
- **Active listings**, which are your competition today
- **Expired listings**, which show what buyers would not pay
- **Market conditions**, including how quickly homes are selling and how many are available

## Think about how buyers search

Buyers search online within price ranges. A home listed just over a common search limit can be missed by buyers who would happily pay that amount. Pricing with search ranges in mind helps more of the right buyers find your home.

## Condition and presentation still count

Price and presentation work together. Small repairs, a deep clean and professional photography help your home stand out against others at the same price.

## Listen to the market

If the right buyers are coming through but not making offers, their feedback is telling you something. A plan for reviewing price and presentation after the first couple of weeks keeps your sale on track.

Curious what your home could sell for? Request a free, no-obligation valuation and I will prepare a pricing plan for your home.$p$, $p$/images/listing-6.jpg$p$, true),
  ($p$preparing-your-home-for-a-winter-sale$p$, $p$Preparing your home for a winter sale$p$, '2026-09-08', $p$Simple steps that help a home show well in any season, even on a grey, rainy day.$p$, $p$Homes sell all year in the Alberni Valley. Winter buyers are often serious ones, such as people relocating for work, and with fewer homes on the market, a well-presented listing can stand out. A little preparation goes a long way when the days are short and wet.

## Make it bright

Winter light is limited, so add it wherever you can:

- Open every blind and curtain before showings
- Turn on all the lights, including lamps and under-cabinet lighting
- Replace dim or mismatched bulbs with bright, warm-white ones
- Schedule listing photos for the brightest part of the day

## Keep it warm and dry

Set the heat to a comfortable temperature for showings, even if you are away. A cold house feels empty and makes buyers rush through.

In our rainy climate, make sure the entry handles wet weather well. Put down a good door mat, leave space for boots and umbrellas, and keep floors clean and dry.

## Look after the outside

- Keep walkways, steps and the driveway clear, and use ice melt on frosty mornings
- Clean gutters and downspouts, and remove moss from roofs and paths
- Make sure outdoor lights work, since many showings happen after dark
- Tidy garden beds and trim back overgrown plants

## Show that the home is well maintained

Winter makes buyers think about heating, drafts and leaks. Have your furnace or heat pump serviced and keep the receipt handy. Fix drips, check for drafts, and gather records of any recent updates such as a roof, windows or a heating system.

## Keep the decor simple

A few seasonal touches can feel welcoming, but keep them light so buyers can still see the home itself. Clear away extra clutter so rooms feel open and bright.

## Be flexible

Weather and holidays can affect when buyers are able to view. The more flexible you can be with showing times, the more buyers will see your home.

Thinking of selling this winter? I would be glad to walk through your home and share a plan to get it ready for market.$p$, $p$/images/listing-7.jpg$p$, true)
on conflict (slug) do nothing;
