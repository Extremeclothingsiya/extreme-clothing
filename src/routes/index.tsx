import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { seoHead } from "@/components/SEOHead";
import heroImg from "@/assets/hero.jpg";
import shortsImg from "@/assets/product-shorts.jpg";
import beanieImg from "@/assets/product-beanie.jpg";
import capImg from "@/assets/product-cap.jpg";
import joggersImg from "@/assets/product-joggers.jpg";
import hoodieImg from "@/assets/product-hoodie.jpg";
import sweatshirtImg from "@/assets/product-sweatshirt.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title:
        "XTREME CLOTHING — Premium South African Streetwear by Siyanda Ndima | Thokoza",
      description:
        "XTREME CLOTHING is a proudly black-owned premium South African streetwear label from Thokoza, Alberton. Shop hoodies, joggers, caps, beanies & mesh shorts. Quality over quantity. Founded by Siyanda Ndima.",
      canonical: "/",
      image: heroImg,
    }),
  component: Page,
});

/* ------------------------------ Catalog ------------------------------ */

type Product = {
  id: string;
  name: string;
  category: "Tops" | "Bottoms" | "Headwear";
  price: number;
  image: string;
  alt: string;
  colors: string[];
  blurb: string;
};

const PRODUCTS: Product[] = [
  {
    id: "mesh-balaclava-shorts",
    name: "Mesh Balaclava Shorts",
    category: "Bottoms",
    price: 250,
    image: shortsImg,
    alt: "XTREME Clothing black mesh shorts with balaclava mascot logo",
    colors: ["Obsidian Black"],
    blurb: "Premium black street shorts with the signature balaclava mascot on the left leg.",
  },
  {
    id: "signature-knit-beanies",
    name: "Signature Knit Beanies",
    category: "Headwear",
    price: 120,
    image: beanieImg,
    alt: "XTREME Clothing thick-cuffed knit beanies in royal blue, sand tan and pearl white",
    colors: ["Royal Blue", "Sand / Tan", "Pearl White", "Deep Black"],
    blurb: "Thick-cuffed embroidered winter beanies with the classic blocky logo patch.",
  },
  {
    id: "5-panel-caps",
    name: "Streetwear 5-Panel Caps",
    category: "Headwear",
    price: 120,
    image: capImg,
    alt: "XTREME Clothing 5-panel flat brim caps in black and crimson red",
    colors: ["Obsidian Black", "Fire Crimson Red"],
    blurb: "Flat-brim 5-panel caps with smooth script typography across the front.",
  },
  {
    id: "fleece-joggers",
    name: "Premium Fleece Joggers",
    category: "Bottoms",
    price: 250,
    image: joggersImg,
    alt: "XTREME Clothing crimson red heavyweight fleece joggers with bubble logo",
    colors: ["Fire Crimson Red", "Obsidian Black"],
    blurb: "Heavyweight luxury sweatpants with ribbed cuffs and a circular bubble emblem on the thigh.",
  },
  {
    id: "ignite-hoodie",
    name: "'Ignite Your Passion' Oversized Hoodie",
    category: "Tops",
    price: 320,
    image: hoodieImg,
    alt: "XTREME Clothing sand beige oversized hoodie with Ignite Your Passion back graphic",
    colors: ["Onyx Black", "Sand Beige"],
    blurb: "Heavy fleece oversized hoodie with the signature IGNITE YOUR PASSION back graphic.",
  },
  {
    id: "mascot-sweatshirt",
    name: "Embroidered Mascot Sweatshirt",
    category: "Tops",
    price: 280,
    image: sweatshirtImg,
    alt: "XTREME Clothing black crewneck sweatshirt with red embroidered circular logo",
    colors: ["Obsidian Black"],
    blurb: "Classic black crewneck with a bold contrasting red circular logo dead-centre.",
  },
];

const CATEGORIES = ["All", "Tops", "Bottoms", "Headwear"] as const;
type Category = (typeof CATEGORIES)[number];
const SIZES = ["S", "M", "L", "XL"] as const;
const WHATSAPP_NUMBER = "27718176685"; // international format for wa.me

/* ------------------------------ Page ------------------------------ */

function Page() {
  const [category, setCategory] = useState<Category>("All");
  const [cart, setCart] = useState<Record<string, { qty: number; size: string; product: Product }>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);

  const filtered = useMemo(
    () => (category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  );

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  function addToCart(p: Product, size: string) {
    const key = `${p.id}-${size}`;
    setCart((c) => ({
      ...c,
      [key]: { qty: (c[key]?.qty ?? 0) + 1, size, product: p },
    }));
    setCartOpen(true);
  }

  function removeItem(key: string) {
    setCart((c) => {
      const n = { ...c };
      delete n[key];
      return n;
    });
  }

  function checkoutViaWhatsApp() {
    if (cartItems.length === 0) return;
    const lines = [
      "Hi Siyanda 👋, I'd like to place an XTREME CLOTHING order:",
      "",
      ...cartItems.map(
        (i) =>
          `• ${i.qty} × ${i.product.name} (Size ${i.size}) — R${i.product.price * i.qty}`,
      ),
      "",
      `Order total: R${cartTotal}`,
      "",
      "Please confirm availability, delivery (Courier Guy / PAXI) and payment details. Enkosi!",
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <Philosophy />
      <Shop
        products={filtered}
        category={category}
        setCategory={setCategory}
        onQuickAdd={addToCart}
        onView={setDetail}
      />
      <LookbookBanner />
      <About />
      <Logistics />
      <Contact />
      <Footer />

      {detail && (
        <ProductDetail
          product={detail}
          onClose={() => setDetail(null)}
          onAdd={(size) => {
            addToCart(detail, size);
            setDetail(null);
          }}
        />
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems.map((i, idx) => ({ ...i, key: Object.keys(cart)[idx] }))}
        total={cartTotal}
        onRemove={removeItem}
        onCheckout={checkoutViaWhatsApp}
      />
    </div>
  );
}

/* ------------------------------ Header ------------------------------ */

function Header({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="glass sticky top-0 z-40 w-full">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-8">
        <a href="#top" className="font-display text-xl tracking-tight md:text-2xl">
          XTREME<span className="text-crimson">.</span>CLOTHING
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <NavItem label="Tops" items={["'Ignite' Hoodie", "Mascot Sweatshirt"]} />
          <NavItem label="Bottoms" items={["Mesh Shorts", "Fleece Joggers"]} />
          <NavItem label="Headwear" items={["Knit Beanies", "5-Panel Caps"]} />
          <a href="#story" className="text-sm font-semibold uppercase tracking-widest hover:text-crimson">
            Our Story
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-4 py-2 text-xs font-bold uppercase tracking-widest transition hover:bg-foreground hover:text-background"
          >
            Cart
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-crimson px-1 text-[10px] font-bold text-bone">
              {cartCount}
            </span>
          </button>
          <button
            className="md:hidden rounded-full border border-foreground/20 p-2"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-foreground/10 bg-background px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-widest">
            <li><a href="#shop" onClick={() => setOpen(false)}>Shop</a></li>
            <li><a href="#story" onClick={() => setOpen(false)}>Our Story</a></li>
            <li><a href="#logistics" onClick={() => setOpen(false)}>Delivery</a></li>
            <li><a href="#contact" onClick={() => setOpen(false)}>Contact</a></li>
          </ul>
        </div>
      )}
    </header>
  );
}

function NavItem({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="group relative">
      <a href="#shop" className="text-sm font-semibold uppercase tracking-widest hover:text-crimson">
        {label}
      </a>
      <div className="pointer-events-none absolute left-0 top-full mt-2 min-w-[220px] translate-y-1 opacity-0 transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <div className="rounded-md border border-foreground/10 bg-background p-3 shadow-xl">
          {items.map((it) => (
            <a key={it} href="#shop" className="block rounded px-3 py-2 text-sm hover:bg-foreground hover:text-background">
              {it}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-obsidian text-bone">
      <img
        src={heroImg}
        alt="Young man wearing XTREME Clothing streetwear against a Thokoza brick wall at golden hour"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/60 to-obsidian" />
      <div className="relative mx-auto grid min-h-[92vh] max-w-[1400px] items-end gap-8 px-4 pb-16 pt-32 md:px-8 md:pb-24">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-bone/25 bg-bone/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="h-2 w-2 rounded-full bg-crimson" />
            Thokoza · Alberton · Est. Mzansi
          </div>
          <h1 className="font-display text-[13vw] leading-[0.85] tracking-tight md:text-[9vw] lg:text-[7.5vw]">
            SERVICING <span className="text-brick">QUALITY</span>,
            <br />
            NOT <span className="italic text-crimson font-serif">quantity.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-bone/75 md:text-lg">
            Limited drops. No reprints. XTREME CLOTHING is a proudly black-owned
            premium streetwear label built from the pavements of Thokoza — for the
            youth who wear their culture loud.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="group inline-flex items-center gap-3 rounded-full bg-crimson px-8 py-4 text-sm font-bold uppercase tracking-widest text-bone transition hover:bg-brick"
            >
              Shop the Drops
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-3 rounded-full border border-bone/30 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-bone hover:text-obsidian"
            >
              Our Story
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-bone/15 pt-8 text-xs uppercase tracking-widest text-bone/60 md:grid-cols-4">
          <Stat k="06" v="Signature Pieces" />
          <Stat k="R120" v="Starting Price" />
          <Stat k="7-Day" v="Exchange Window" />
          <Stat k="100%" v="Locally Made" />
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-bone md:text-3xl">{k}</div>
      <div className="mt-1">{v}</div>
    </div>
  );
}

/* ------------------------------ Marquee ------------------------------ */

function Marquee() {
  const text = "LIMITED COPS  //  NO REPRINTS  //  XTREME QUALITY OVER QUANTITY  //  FROM THOKOZA TO THE WORLD  //  ";
  return (
    <div className="overflow-hidden border-y-4 border-obsidian bg-crimson text-bone">
      <div className="flex whitespace-nowrap py-4 animate-marquee font-display text-2xl uppercase md:text-4xl">
        <span className="pr-8">{text.repeat(4)}</span>
        <span className="pr-8" aria-hidden>{text.repeat(4)}</span>
      </div>
    </div>
  );
}

/* ------------------------------ Philosophy ------------------------------ */

function Philosophy() {
  return (
    <section className="relative grain grid-bg bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-crimson">Chapter 01</div>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] md:text-6xl">
            Built on <span className="italic text-royal font-serif">the block.</span>
          </h2>
        </div>
        <div className="md:col-span-8 md:pl-12">
          <p className="text-lg leading-relaxed md:text-xl">
            Every piece drops in tiny runs — cut, stitched and quality-checked in
            small batches so no two seasons look the same. We chase feeling over
            output: heavy fleece that hugs the shoulders, mesh that breathes on
            the taxi, embroidery that survives a decade of laundry.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { t: "Small Batch", d: "Runs capped so streets stay authentic." },
              { t: "Heavy Weights", d: "Fleece, knit and mesh built to last." },
              { t: "Local First", d: "Made and shipped from Alberton, Gauteng." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-foreground/10 bg-card p-6">
                <div className="font-display text-lg uppercase">{c.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Shop grid ------------------------------ */

function Shop({
  products,
  category,
  setCategory,
  onQuickAdd,
  onView,
}: {
  products: Product[];
  category: Category;
  setCategory: (c: Category) => void;
  onQuickAdd: (p: Product, size: string) => void;
  onView: (p: Product) => void;
}) {
  return (
    <section id="shop" className="bg-obsidian py-24 text-bone md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-brick">The Drop</div>
            <h2 className="mt-3 font-display text-5xl leading-none md:text-7xl">
              Shop the <span className="italic text-sun font-serif">collection.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition ${
                  category === c
                    ? "border-crimson bg-crimson text-bone"
                    : "border-bone/25 text-bone/80 hover:border-bone hover:text-bone"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} onQuickAdd={onQuickAdd} onView={onView} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  p,
  onQuickAdd,
  onView,
  delay,
}: {
  p: Product;
  onQuickAdd: (p: Product, size: string) => void;
  onView: (p: Product) => void;
  delay: number;
}) {
  const [size, setSize] = useState<string>("M");
  return (
    <article
      className="group animate-float-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={() => onView(p)}
        className="relative block w-full overflow-hidden rounded-2xl bg-bone/5 text-left"
      >
        <div className="aspect-[3/5] overflow-hidden bg-bone/5">
          <img
            src={p.image}
            alt={p.alt}
            loading="lazy"
            width={720}
            height={1220}
            className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.06]"
          />
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-crimson px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
          {p.category}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-bone px-3 py-1 text-[11px] font-bold text-obsidian">
          R{p.price}
        </div>
      </button>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg uppercase leading-tight">{p.name}</h3>
          <p className="mt-1 text-xs text-bone/60">{p.colors.join(" · ")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`h-8 w-8 rounded-full border text-xs font-bold transition ${
              size === s ? "border-crimson bg-crimson text-bone" : "border-bone/25 text-bone/70 hover:border-bone"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => onQuickAdd(p, size)}
          className="ml-auto rounded-full bg-bone px-5 py-2 text-xs font-bold uppercase tracking-widest text-obsidian transition hover:bg-brick hover:text-obsidian"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

/* ------------------------------ Lookbook banner ------------------------------ */

function LookbookBanner() {
  return (
    <section className="relative overflow-hidden bg-brick py-24 text-obsidian md:py-32 grain">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.25em]">Lookbook 26</div>
          <h2 className="mt-3 font-display text-5xl leading-[0.9] md:text-7xl">
            Ignite <span className="italic font-serif">your</span> passion.
          </h2>
          <p className="mt-6 max-w-md text-base md:text-lg">
            The IGNITE hoodie sits at the heart of this drop — a heavyweight
            fleece silhouette carrying a statement graphic that spans the entire
            back. Cop it before the run runs.
          </p>
          <a
            href="#shop"
            className="mt-8 inline-flex rounded-full bg-obsidian px-8 py-4 text-sm font-bold uppercase tracking-widest text-bone hover:bg-crimson"
          >
            View the piece →
          </a>
        </div>
        <div className="relative">
          <img
            src={hoodieImg}
            alt="XTREME Ignite Your Passion oversized hoodie back graphic"
            loading="lazy"
            width={1024}
            height={1280}
            className="w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ About ------------------------------ */

function About() {
  return (
    <section id="story" className="bg-background py-24 md:py-32 grid-bg">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-crimson">About the Brand</div>
          <h2 className="mt-3 font-display text-6xl leading-[0.9] md:text-7xl">
            XTREME<br />
            <span className="italic font-serif text-royal">CLOTHING.</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed md:text-xl">
            Founded by <strong className="font-display uppercase tracking-wide">Siyanda Ndima</strong>,
            XTREME CLOTHING is a proudly black-owned South African streetwear
            label born on the corners of Thokoza, Alberton. What started as one
            silhouette has grown into a full lookbook stitched from local pride
            — worn from the taxi rank to the front row.
          </p>
          <blockquote className="mt-8 border-l-4 border-crimson pl-6 font-serif text-2xl italic leading-snug md:text-3xl">
            "We don't do fast fashion. We do pieces you'll still be flexing
            three winters from now."
            <footer className="mt-3 font-sans text-sm not-italic uppercase tracking-widest text-muted-foreground">
              — Siyanda Ndima, Founder
            </footer>
          </blockquote>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Founded</dt>
              <dd className="mt-1 font-display text-2xl">Mzansi</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Based In</dt>
              <dd className="mt-1 font-display text-2xl">Thokoza</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ownership</dt>
              <dd className="mt-1 font-display text-2xl">100% Local</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Logistics ------------------------------ */

function Logistics() {
  return (
    <section id="logistics" className="bg-royal py-24 text-bone md:py-32 grain">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-sun">Delivery & Checkout</div>
        <h2 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] md:text-7xl">
          From Thokoza <span className="italic font-serif">to your door.</span>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Card
            tag="Courier"
            title="The Courier Guy"
            body="Door-to-door delivery anywhere in South Africa. Tracked 1–3 business days from Gauteng."
            accent="bg-crimson"
          />
          <Card
            tag="Collection"
            title="PAXI @ PEP"
            body="PEP-to-PEP collection nationwide from R59.95. Perfect if you're outside metro Gauteng."
            accent="bg-sun text-obsidian"
          />
          <Card
            tag="Checkout"
            title="WhatsApp Order"
            body="No card entry, no drama. Confirm your order with the founder directly on WhatsApp — 071 817 6685."
            accent="bg-bone text-obsidian"
          />
        </div>

        <div className="mt-14 rounded-3xl border border-bone/20 bg-bone/5 p-8 md:p-12">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-display text-3xl uppercase">How Checkout Works</h3>
              <ol className="mt-6 space-y-4 text-sm text-bone/80">
                <li className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crimson font-display text-xs">1</span>
                  Add your fits to cart and choose sizes.
                </li>
                <li className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crimson font-display text-xs">2</span>
                  Hit <em className="font-serif">Proceed to Checkout</em> — we'll build your order message.
                </li>
                <li className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crimson font-display text-xs">3</span>
                  You're forwarded straight to WhatsApp to confirm with Siyanda.
                </li>
                <li className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crimson font-display text-xs">4</span>
                  Pay via EFT / instant EFT, then pick Courier Guy or PAXI.
                </li>
              </ol>
            </div>
            <div className="w-full max-w-xs rounded-2xl bg-obsidian p-6 text-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-sun">Returns Policy</div>
              <p className="mt-3 leading-relaxed text-bone/80">
                Strictly <strong className="text-bone">exchange only within 7 days</strong> of purchase.
                No refunds. Item must be unworn with tags attached. Direct exchanges via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ tag, title, body, accent }: { tag: string; title: string; body: string; accent: string }) {
  return (
    <div className="rounded-3xl bg-bone/5 p-6 border border-bone/15 backdrop-blur-sm">
      <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${accent}`}>
        {tag}
      </span>
      <h3 className="mt-4 font-display text-2xl uppercase">{title}</h3>
      <p className="mt-3 text-sm text-bone/75">{body}</p>
    </div>
  );
}

/* ------------------------------ Contact / Map ------------------------------ */

function Contact() {
  const address = "1144 Lepele Street, Thokoza Ext 2, Alberton";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return (
    <section id="contact" className="bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:grid-cols-2 md:px-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-crimson">Find Us</div>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] md:text-6xl">
            1144 Lepele<br /><span className="italic font-serif text-royal">Street.</span>
          </h2>
          <div className="mt-8 space-y-5 text-base">
            <Row k="Address" v="1144 Lepele Street, Thokoza Ext 2, Alberton" />
            <Row k="WhatsApp / Cell" v="071 817 6685" href={`https://wa.me/${WHATSAPP_NUMBER}`} />
            <Row k="Email" v="ndima.siyanda4@icloud.com" href="mailto:ndima.siyanda4@icloud.com" />
            <Row k="Weekdays" v="Monday to Friday · 08:00 – 17:00" />
            <Row k="Saturday" v="08:00 – 13:00" />
            <Row k="Sunday" v="Closed" />
            <Row k="Instagram" v="@xtreme_clothing" href="https://instagram.com/xtreme_clothing" />
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-xl">
          <iframe
            title="XTREME CLOTHING location — 1144 Lepele Street, Thokoza"
            src={mapSrc}
            width="100%"
            height="520"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[520px] w-full grayscale-[0.2]"
          />
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, href }: { k: string; v: string; href?: string }) {
  const body = href ? (
    <a href={href} className="story-link border-b border-foreground/30 pb-0.5 hover:border-crimson hover:text-crimson">
      {v}
    </a>
  ) : (
    <span>{v}</span>
  );
  return (
    <div className="flex flex-col gap-1 border-b border-foreground/10 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{k}</span>
      <span className="font-display text-lg uppercase tracking-tight">{body}</span>
    </div>
  );
}

/* ------------------------------ Footer ------------------------------ */

function Footer() {
  return (
    <footer className="bg-obsidian text-bone">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-3xl">
              XTREME<span className="text-crimson">.</span>CLOTHING
            </div>
            <p className="mt-4 max-w-sm text-sm text-bone/60">
              Proudly black-owned South African streetwear. Founded by Siyanda Ndima
              in Thokoza, Alberton. Quality over quantity — always.
            </p>
            <form
              className="mt-6 flex max-w-sm overflow-hidden rounded-full border border-bone/20 bg-bone/5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks for joining the XTREME list.");
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-bone/40 focus:outline-none"
              />
              <button className="bg-crimson px-5 text-xs font-bold uppercase tracking-widest">
                Join
              </button>
            </form>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-bone/50">Shop</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#shop" className="hover:text-crimson">Tops</a></li>
              <li><a href="#shop" className="hover:text-crimson">Bottoms</a></li>
              <li><a href="#shop" className="hover:text-crimson">Headwear</a></li>
              <li><a href="#story" className="hover:text-crimson">Our Story</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-bone/50">Support</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Mon–Fri · 08:00–17:00</li>
              <li>Sat · 08:00–13:00</li>
              <li><a href="mailto:ndima.siyanda4@icloud.com" className="hover:text-crimson">Email support</a></li>
              <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-crimson">WhatsApp us</a></li>
              <li><a href="https://instagram.com/xtreme_clothing" className="hover:text-crimson">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-6 text-xs uppercase tracking-widest text-bone/50 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} XTREME CLOTHING · Siyanda Ndima</span>
          <span>Exchange only within 7 days · No refunds</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ Product Detail Modal ------------------------------ */

function ProductDetail({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (size: string) => void;
}) {
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(product.colors[0]);
  const [open, setOpen] = useState<string | null>("fabric");
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-obsidian/60 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {product.category} / Detail
          </span>
          <button onClick={onClose} className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background">
            Close
          </button>
        </div>
        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <div className="grid grid-cols-3 gap-3">
            <img src={product.image} alt={product.alt} loading="lazy" className="col-span-3 aspect-[3/5] w-full rounded-2xl bg-bone/5 object-contain" />
            <img src={product.image} alt="" loading="lazy" className="aspect-square rounded-lg bg-bone/5 object-contain opacity-80" />
            <img src={product.image} alt="" loading="lazy" className="aspect-square rounded-lg bg-bone/5 object-contain opacity-80" />
            <img src={product.image} alt="" loading="lazy" className="aspect-square rounded-lg bg-bone/5 object-contain opacity-80" />
          </div>
          <div>
            <h3 className="font-display text-4xl uppercase leading-tight">{product.name}</h3>
            <div className="mt-2 font-display text-2xl text-crimson">R{product.price}</div>
            <p className="mt-4 text-base text-muted-foreground">{product.blurb}</p>

            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-widest">Color</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                      color === c ? "border-crimson bg-crimson text-bone" : "border-foreground/20 hover:border-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-widest">Size</div>
              <div className="mt-3 flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-11 w-11 rounded-full border font-bold ${
                      size === s ? "border-crimson bg-crimson text-bone" : "border-foreground/20 hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onAdd(size)}
              className="mt-8 w-full rounded-full bg-obsidian px-8 py-4 text-sm font-bold uppercase tracking-widest text-bone transition hover:bg-crimson"
            >
              Add to Cart · R{product.price}
            </button>

            <div className="mt-8 divide-y divide-foreground/10 border-t border-foreground/10">
              {[
                { id: "fabric", t: "Fabric & Fit", d: "Heavyweight, pre-washed for minimal shrinkage. True-to-size for a relaxed street fit; size down for a fitted look." },
                { id: "care", t: "Care Instructions", d: "Cold wash inside-out. Do not tumble dry. Iron on reverse only over embroidery / print." },
                { id: "shipping", t: "SA Shipping Timelines", d: "1–3 working days Gauteng · 2–5 working days nationwide via The Courier Guy · PAXI PEP-to-PEP available." },
              ].map((a) => (
                <div key={a.id}>
                  <button
                    onClick={() => setOpen(open === a.id ? null : a.id)}
                    className="flex w-full items-center justify-between py-4 text-left text-sm font-bold uppercase tracking-widest"
                  >
                    {a.t}
                    <span className="text-xl">{open === a.id ? "−" : "+"}</span>
                  </button>
                  {open === a.id && <p className="pb-5 text-sm text-muted-foreground">{a.d}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-foreground/10 px-6 py-10 md:px-10">
          <div className="text-xs font-bold uppercase tracking-widest text-crimson">Complete the Fit</div>
          <h4 className="mt-2 font-display text-3xl uppercase">Pair it with</h4>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <div key={r.id} className="rounded-2xl bg-muted p-3">
                <img src={r.image} alt={r.alt} loading="lazy" className="aspect-[3/5] w-full rounded-xl bg-bone/5 object-contain" />
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-display uppercase">{r.name}</span>
                  <span className="text-crimson">R{r.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Cart Drawer ------------------------------ */

function CartDrawer({
  open,
  onClose,
  items,
  total,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  items: { key: string; qty: number; size: string; product: Product }[];
  total: number;
  onRemove: (key: string) => void;
  onCheckout: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-obsidian/60 backdrop-blur-sm">
      <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
          <h3 className="font-display text-xl uppercase">Your Cart</h3>
          <button onClick={onClose} className="rounded-full border border-foreground/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              Your cart is empty. Go cop something.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.key} className="flex gap-3 rounded-2xl border border-foreground/10 p-3">
                  <img src={i.product.image} alt="" className="h-20 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-display text-sm uppercase leading-tight">{i.product.name}</div>
                    <div className="text-xs text-muted-foreground">Size {i.size} · Qty {i.qty}</div>
                    <div className="mt-1 text-sm font-bold">R{i.product.price * i.qty}</div>
                  </div>
                  <button onClick={() => onRemove(i.key)} className="text-xs text-muted-foreground hover:text-crimson">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-foreground/10 p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="uppercase tracking-widest text-muted-foreground">Subtotal</span>
            <span className="font-display text-2xl">R{total}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="mt-4 w-full rounded-full bg-crimson px-6 py-4 text-sm font-bold uppercase tracking-widest text-bone transition hover:bg-obsidian disabled:opacity-40"
          >
            Checkout via WhatsApp →
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            You'll be forwarded to Siyanda on WhatsApp (071 817 6685) with your order pre-filled.
          </p>
        </div>
      </aside>
    </div>
  );
}
