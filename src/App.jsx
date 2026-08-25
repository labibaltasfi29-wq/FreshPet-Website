import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ShoppingBag, X, Plus, Minus, Heart, Star, Check, User, Package,
  Sparkles, Leaf, Fish, Droplets, ChevronRight, Menu, Instagram,
  Facebook, MessageCircle, Award, Truck, ShieldCheck, Cat, ArrowRight,
  Gift, Repeat, TrendingUp, Quote
} from "lucide-react";

const LOGO = "/images/freshpet-logo.png";
const FRONT_POUCH = "/images/freshpet-front-pouch.jpg";
const COMBO = "/images/freshpet-combo.jpg";
const BACK_POUCH = "/images/freshpet-back-pouch.jpg";

/* ---------------------------------------------------------
   Design tokens
   Pink:   #F5507F   Purple: #3B1F6B   Blush: #FFF1F5
   Ink:    #241633   Cream:  #FFFFFF
--------------------------------------------------------- */

const WaveDivider = ({ flip = false, color = "#3B1F6B", className = "" }) => (
  <svg
    viewBox="0 0 1440 90"
    className={`w-full block ${className}`}
    preserveAspectRatio="none"
    style={{ height: "60px", transform: flip ? "scaleY(-1)" : "none" }}
  >
    <path
      d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,90 L0,90 Z"
      fill={color}
    />
  </svg>
);

const PawIcon = ({ className = "", style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <circle cx="6" cy="7" r="2.1" />
    <circle cx="12" cy="4.6" r="2.1" />
    <circle cx="18" cy="7" r="2.1" />
    <path d="M12 10c-3.6 0-6.6 2.7-6.6 6.1 0 2.1 1.7 3.4 3.6 3.1.9-.1 1.9-.7 3-.7s2.1.6 3 .7c1.9.3 3.6-1 3.6-3.1C18.6 12.7 15.6 10 12 10z" />
  </svg>
);

const Pill = ({ children, tone = "pink" }) => {
  const tones = {
    pink: "bg-[#FFE3EC] text-[#C22B62]",
    purple: "bg-[#EDE6F9] text-[#3B1F6B]",
    cream: "bg-white text-[#3B1F6B] border border-[#3B1F6B]/15",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
};

const SectionEyebrow = ({ children, dark = false }) => (
  <div className="flex items-center gap-2 justify-center mb-3">
    <PawIcon className={`w-4 h-4 ${dark ? "text-[#F5A5C0]" : "text-[#F5507F]"}`} />
    <span className={`text-[13px] font-bold tracking-[0.18em] uppercase ${dark ? "text-[#F5A5C0]" : "text-[#F5507F]"}`}>{children}</span>
    <PawIcon className={`w-4 h-4 scale-x-[-1] ${dark ? "text-[#F5A5C0]" : "text-[#F5507F]"}`} />
  </div>
);

/* ---------------------------------------------------------
   Decorative background system — blobs, paw pattern, mesh
--------------------------------------------------------- */

const Blob = ({ className = "", color = "#F5507F", opacity = 0.18 }) => (
  <div
    aria-hidden="true"
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    style={{ background: color, opacity }}
  />
);

const PAW_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'>" +
  "<g fill='%233B1F6B'>" +
  "<circle cx='6' cy='7' r='2'/><circle cx='12' cy='4.4' r='2'/><circle cx='18' cy='7' r='2'/>" +
  "<path d='M12 10c-3.4 0-6.2 2.6-6.2 5.8 0 2 1.6 3.2 3.4 2.9.9-.1 1.8-.6 2.8-.6s1.9.5 2.8.6c1.8.3 3.4-.9 3.4-2.9C18.2 12.6 15.4 10 12 10z'/>" +
  "</g></svg>";

const PawPattern = ({ className = "", opacity = 0.05, rotate = 0 }) => (
  <div
    aria-hidden="true"
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `url("data:image/svg+xml,${PAW_SVG}")`,
      backgroundSize: "64px 64px",
      opacity,
      transform: rotate ? `rotate(${rotate}deg) scale(1.4)` : "none",
    }}
  />
);

/* Section wrapper that carries a soft colour wash + blobs + paw texture,
   so no section on the page is left on flat white. */
const SectionBG = ({
  children,
  wash = "linear-gradient(180deg, #FFFFFF 0%, #FFF3F7 50%, #FFFFFF 100%)",
  blobs = true,
  pattern = true,
  className = "",
}) => (
  <div className={`relative overflow-hidden ${className}`} style={{ background: wash }}>
    {pattern && <PawPattern opacity={0.04} />}
    {blobs && (
      <>
        <Blob className="w-72 h-72 -top-20 -left-24" color="#F5507F" opacity={0.14} />
        <Blob className="w-96 h-96 -bottom-32 -right-28" color="#3B1F6B" opacity={0.12} />
      </>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

/* Scroll-reveal: fades + lifts content into view as the user scrolls */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const Reveal = ({ children, className = "", delay = 0 }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* =========================================================
   MAIN APP
========================================================= */
export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [subscribe, setSubscribe] = useState(false);
  const [toast, setToast] = useState(null);
  const [feedWeight, setFeedWeight] = useState("3-5");
  const [petForm, setPetForm] = useState({ name: "", age: "", weight: "", breed: "" });
  const [petResult, setPetResult] = useState(null);
  const [accountTab, setAccountTab] = useState("orders");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const price = 70;
  const subDiscountPct = 12; // within stated 10-15% range
  const unitPrice = subscribe ? +(price * (1 - subDiscountPct / 100)).toFixed(2) : price;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2200);
  };

  const addToCart = () => {
    setCart((prev) => {
      const key = subscribe ? "sub" : "onetime";
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          name: "FreshPet Chicken & Marine Fish Recipe",
          type: subscribe ? "Monthly Care Plan" : "One-time purchase",
          unitPrice,
          qty,
        },
      ];
    });
    showToast(`Added ${qty} pouch${qty > 1 ? "es" : ""} to cart`);
    setCartOpen(true);
  };

  const updateCartQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeCartItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const feedingTable = {
    "2-3": { label: "2 – 3 kg", amount: "1 pouch / day" },
    "3-5": { label: "3 – 5 kg", amount: "1–2 pouches / day" },
    "5+": { label: "5 kg+", amount: "2 pouches / day" },
  };

  const calcFeeding = (weightKg) => {
    const w = parseFloat(weightKg);
    if (isNaN(w)) return null;
    if (w < 3) return feedingTable["2-3"].amount;
    if (w <= 5) return feedingTable["3-5"].amount;
    return feedingTable["5+"].amount;
  };

  const submitPetForm = (e) => {
    e.preventDefault();
    if (!petForm.name || !petForm.weight) return;
    const amount = calcFeeding(petForm.weight);
    setPetResult({ ...petForm, amount });
  };

  const scrollTo = (id) => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    { id: "story", label: "About Us" },
    { id: "blog", label: "Cat Care" },
    { id: "footer", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#241633]" style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui" }}>
      <style>{`
        .font-display { font-family: 'Baloo 2', 'Plus Jakarta Sans', ui-sans-serif, system-ui; }
        .grad-pink-purple { background: linear-gradient(135deg, #F5507F 0%, #C63B8E 55%, #3B1F6B 100%); }
        .grad-blush { background: radial-gradient(120% 120% at 10% 0%, #FFE9F0 0%, #FFF6F9 45%, #ffffff 100%); }
        .card-shadow { box-shadow: 0 20px 45px -20px rgba(59,31,107,0.25); }
        .btn-press:active { transform: scale(0.97); }
        @keyframes floaty { 0%,100%{ transform: translateY(0px);} 50%{ transform: translateY(-10px);} }
        .float { animation: floaty 4.5s ease-in-out infinite; }
        @keyframes fadeUp { 0%{ opacity:0; transform: translateY(8px);} 100%{ opacity:1; transform: translateY(0);} }
        @media (prefers-reduced-motion: reduce) {
          .float { animation: none; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ================= TOP BAR ================= */}
      <div className="grad-pink-purple text-white text-center text-[12.5px] font-semibold tracking-wide py-2 px-4">
        Free delivery inside Dhaka on orders above BDT 500 &nbsp;•&nbsp; Proudly made in Bangladesh 🇧🇩
      </div>

      {/* ================= NAV ================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#3B1F6B]/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 shrink-0">
            <img src={LOGO} alt="FreshPet" className="h-9 md:h-10 w-auto object-contain" />
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-[15px] font-semibold text-[#3B1F6B]/80 hover:text-[#F5507F] transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setPetModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-full border-2 border-[#3B1F6B]/15 px-4 py-2 text-[13.5px] font-bold text-[#3B1F6B] hover:border-[#F5507F] hover:text-[#F5507F] transition-colors"
            >
              <Cat className="w-4 h-4" /> My Cat's Profile
            </button>
            <button
              onClick={() => setAccountOpen(true)}
              aria-label="Account"
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFE9F0] transition-colors"
            >
              <User className="w-5 h-5 text-[#3B1F6B]" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFE9F0] transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-[#3B1F6B]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#F5507F] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFE9F0]"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[#3B1F6B]" />
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-[#3B1F6B]/8 bg-white px-5 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-left py-2.5 text-[15px] font-semibold text-[#3B1F6B]"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileNavOpen(false); setPetModalOpen(true); }}
              className="text-left py-2.5 text-[15px] font-semibold text-[#F5507F] flex items-center gap-2"
            >
              <Cat className="w-4 h-4" /> My Cat's Profile
            </button>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="grad-blush relative overflow-hidden">
        <PawPattern opacity={0.05} rotate={4} />
        <Blob className="w-96 h-96 -top-40 -left-32" color="#F5507F" opacity={0.16} />
        <Blob className="w-80 h-80 top-1/3 -right-24" color="#3B1F6B" opacity={0.1} />
        <PawIcon className="hidden md:block absolute top-24 left-[8%] w-6 h-6 text-[#F5507F]/25 rotate-[-15deg] float" />
        <PawIcon className="hidden md:block absolute bottom-20 left-[20%] w-8 h-8 text-[#3B1F6B]/15 rotate-[20deg] float" style={{ animationDelay: "1.2s" }} />
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-16 md:pb-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <Pill tone="pink"><Sparkles className="w-3.5 h-3.5" /> Premium Wet Cat Food, Made in Bangladesh</Pill>
            <h1 className="font-display font-extrabold text-[#3B1F6B] text-[42px] leading-[1.06] sm:text-[52px] md:text-[60px] mt-5">
              Fresh Nutrition.
              <br />
              <span className="text-[#F5507F]">Happy Cats.</span>
            </h1>
            <p className="text-[17px] md:text-[18px] text-[#241633]/70 mt-5 max-w-md leading-relaxed">
              Premium wet cat food made with quality ingredients for healthier and happier companions — in convenient 85g pouches your cat will run to the bowl for.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={() => scrollTo("shop")}
                className="btn-press grad-pink-purple text-white font-bold text-[15px] px-7 py-3.5 rounded-full card-shadow hover:brightness-105 transition flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("story")}
                className="btn-press font-bold text-[15px] px-7 py-3.5 rounded-full border-2 border-[#3B1F6B]/15 text-[#3B1F6B] hover:border-[#3B1F6B] transition"
              >
                Learn More
              </button>
            </div>
            <div className="flex items-center gap-6 mt-9">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#F5507F]" />
                <span className="text-[13.5px] font-semibold text-[#3B1F6B]/80">No artificial preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F5507F]" />
                <span className="text-[13.5px] font-semibold text-[#3B1F6B]/80">DLS &amp; BSTI compliant</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#F5507F]/10 blur-3xl -z-0" />
            <img
              src={FRONT_POUCH}
              alt="FreshPet Chicken & Marine Fish Recipe pouch"
              className="float relative z-10 w-64 sm:w-80 md:w-[380px] drop-shadow-2xl rounded-[28px]"
            />
            <div className="hidden sm:flex absolute top-6 -left-2 md:left-0 bg-white rounded-2xl card-shadow px-4 py-3 items-center gap-2 z-20">
              <div className="w-9 h-9 rounded-full bg-[#FFE3EC] flex items-center justify-center">
                <Star className="w-4 h-4 text-[#F5507F] fill-[#F5507F]" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#3B1F6B] leading-none">4.9/5</div>
                <div className="text-[11px] text-[#3B1F6B]/60 leading-none mt-1">Cat-approved</div>
              </div>
            </div>
            <div className="hidden sm:flex absolute bottom-8 -right-2 md:right-2 bg-white rounded-2xl card-shadow px-4 py-3 items-center gap-2 z-20">
              <div className="w-9 h-9 rounded-full bg-[#EDE6F9] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#3B1F6B]" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#3B1F6B] leading-none">78 kcal</div>
                <div className="text-[11px] text-[#3B1F6B]/60 leading-none mt-1">per pouch</div>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider color="#ffffff" />
      </section>

      {/* ================= WHY FRESHPET ================= */}
      <SectionBG className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal>
            <SectionEyebrow>Why FreshPet</SectionEyebrow>
            <h2 className="font-display font-extrabold text-[#3B1F6B] text-[30px] md:text-[38px] text-center">
              Everything your cat needs. Nothing it doesn't.
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Leaf, title: "Quality Ingredients", desc: "Carefully selected ingredients for your cat's daily nutrition.", tone: "bg-[#FFE3EC] text-[#F5507F]", ring: "hover:ring-[#F5507F]/30" },
              { icon: Heart, title: "Complete Nutrition", desc: "Balanced nutrition designed for healthy and happy cats.", tone: "bg-[#EDE6F9] text-[#3B1F6B]", ring: "hover:ring-[#3B1F6B]/25" },
              { icon: Package, title: "Convenient Feeding", desc: "Easy-to-serve wet food pouch that keeps meals fresh.", tone: "bg-[#FFE3EC] text-[#F5507F]", ring: "hover:ring-[#F5507F]/30" },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className={`group relative rounded-3xl bg-white/90 backdrop-blur card-shadow border border-[#3B1F6B]/6 ring-2 ring-transparent p-8 hover:-translate-y-2 transition-all duration-300 overflow-hidden ${c.ring}`}>
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-[#F5507F]/10 to-[#3B1F6B]/10 group-hover:scale-125 transition-transform duration-500" />
                  <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${c.tone}`}>
                    <c.icon className="w-7 h-7" />
                  </div>
                  <h3 className="relative font-display font-bold text-[#3B1F6B] text-[21px] mt-5">{c.title}</h3>
                  <p className="relative text-[#241633]/65 text-[15px] mt-2 leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionBG>

      {/* ================= PRODUCT / SHOP ================= */}
      <section id="shop" className="relative overflow-hidden py-16 md:py-20" style={{ background: "linear-gradient(160deg, #FFEAF1 0%, #FFF6F9 45%, #F3EBFB 100%)" }}>
        <PawPattern opacity={0.05} rotate={8} />
        <Blob className="w-80 h-80 top-10 -left-20" color="#F5507F" opacity={0.16} />
        <Blob className="w-96 h-96 -bottom-24 -right-24" color="#3B1F6B" opacity={0.14} />
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <Reveal>
            <SectionEyebrow>Shop FreshPet</SectionEyebrow>
            <h2 className="font-display font-extrabold text-[#3B1F6B] text-[30px] md:text-[38px] text-center mb-12">
              One recipe. Zero compromises.
            </h2>
          </Reveal>

          <Reveal>
          <div className="bg-white/95 backdrop-blur rounded-[32px] card-shadow border border-[#3B1F6B]/6 p-6 md:p-10 grid md:grid-cols-2 gap-10 items-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-[#F5507F]/8 to-transparent" />
            <div className="relative flex justify-center">
              <div className="absolute w-64 h-64 rounded-full bg-[#EDE6F9] blur-2xl" />
              <div className="absolute w-40 h-40 rounded-full bg-[#F5507F]/15 blur-2xl -bottom-4 right-4" />
              <img src={FRONT_POUCH} alt="FreshPet product pouch" className="relative w-56 sm:w-64 md:w-72 drop-shadow-xl rounded-2xl hover:rotate-2 hover:scale-105 transition-transform duration-500" />
            </div>

            <div>
              <Pill tone="purple">Wet Cat Food · 85g pouch</Pill>
              <h3 className="font-display font-extrabold text-[#3B1F6B] text-[26px] md:text-[30px] mt-4 leading-snug">
                FreshPet Chicken &amp; Marine Fish Recipe
              </h3>
              <p className="text-[#241633]/65 text-[15px] mt-2 leading-relaxed">
                High-protein, complete nutrition with no artificial preservatives — for adult cats 1+ years. Deliciously healthy, naturally loved.
              </p>

              <div className="flex items-center gap-1.5 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#F5507F] fill-[#F5507F]" />
                ))}
                <span className="text-[13px] text-[#3B1F6B]/60 ml-1 font-semibold">4.9 (312 reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mt-6">
                <span className="font-display font-extrabold text-[#3B1F6B] text-[34px]">BDT {unitPrice}</span>
                {subscribe && <span className="text-[15px] text-[#3B1F6B]/40 line-through">BDT {price}</span>}
                <span className="text-[13px] text-[#241633]/50">/ pouch</span>
              </div>

              {/* Purchase type */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => setSubscribe(false)}
                  className={`rounded-2xl border-2 px-4 py-3 text-left transition ${!subscribe ? "border-[#F5507F] bg-[#FFE3EC]/50" : "border-[#3B1F6B]/12"}`}
                >
                  <div className="text-[14px] font-bold text-[#3B1F6B]">One-time purchase</div>
                  <div className="text-[12.5px] text-[#241633]/55 mt-0.5">BDT {price} / pouch</div>
                </button>
                <button
                  onClick={() => setSubscribe(true)}
                  className={`rounded-2xl border-2 px-4 py-3 text-left transition relative ${subscribe ? "border-[#F5507F] bg-[#FFE3EC]/50" : "border-[#3B1F6B]/12"}`}
                >
                  <span className="absolute -top-2.5 right-3 bg-[#3B1F6B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE {subDiscountPct}%</span>
                  <div className="text-[14px] font-bold text-[#3B1F6B]">Subscribe &amp; Save</div>
                  <div className="text-[12.5px] text-[#241633]/55 mt-0.5">Monthly delivery</div>
                </button>
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border-2 border-[#3B1F6B]/12 rounded-full">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#3B1F6B] hover:bg-[#FFE9F0] rounded-full transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-[#3B1F6B]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#3B1F6B] hover:bg-[#FFE9F0] rounded-full transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  className="btn-press flex-1 grad-pink-purple text-white font-bold text-[15px] px-6 py-3.5 rounded-full card-shadow hover:brightness-105 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#3B1F6B]/8">
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#3B1F6B]/70"><Truck className="w-4 h-4" /> Fast Dhaka delivery</div>
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#3B1F6B]/70"><ShieldCheck className="w-4 h-4" /> BSTI certified</div>
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#3B1F6B]/70"><Repeat className="w-4 h-4" /> Cancel anytime</div>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ================= BRAND STORY ================= */}
      <SectionBG
        wash="linear-gradient(135deg, #FFFFFF 0%, #FDEFF4 55%, #F4EEFB 100%)"
        className="py-16 md:py-24"
      >
      <section id="story" className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <Reveal className="order-2 md:order-1">
          <Pill tone="cream">Our Story</Pill>
          <h2 className="font-display font-extrabold text-[#3B1F6B] text-[30px] md:text-[38px] mt-4 leading-snug">
            "At FreshPet, we believe every cat deserves meals made with care."
          </h2>
          <p className="text-[#241633]/70 text-[15.5px] mt-5 leading-relaxed">
            FreshPet started with a simple frustration: quality wet food for cats in Bangladesh almost always meant an imported pouch, a steep price tag, and weeks of uncertain shelf life. We asked why a cat in Dhaka couldn't have fresh, complete nutrition made close to home.
          </p>
          <p className="text-[#241633]/70 text-[15.5px] mt-4 leading-relaxed">
            So we built FreshPet from the ground up — locally sourced chicken, chicken liver and marine fish, cooked and sealed using retort technology, with no artificial preservatives. Every pouch is designed around one goal: the quiet, happy moment when your cat finishes a meal and looks up for more.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-7">
            <div className="rounded-2xl bg-[#FFF6F9] p-5">
              <div className="font-display font-extrabold text-[#F5507F] text-[26px]">100%</div>
              <div className="text-[13px] text-[#3B1F6B]/70 font-semibold mt-1">Made in Bangladesh</div>
            </div>
            <div className="rounded-2xl bg-[#FFF6F9] p-5">
              <div className="font-display font-extrabold text-[#F5507F] text-[26px]">0</div>
              <div className="text-[13px] text-[#3B1F6B]/70 font-semibold mt-1">Artificial preservatives</div>
            </div>
          </div>
        </Reveal>
        <Reveal className="order-1 md:order-2 relative flex justify-center" delay={150}>
          <div className="absolute w-72 h-72 rounded-full bg-[#F5507F]/10 blur-3xl" />
          <div className="absolute w-40 h-40 rounded-full bg-[#3B1F6B]/10 blur-2xl -top-6 -right-6" />
          <img src={COMBO} alt="FreshPet front and back packaging" className="relative w-full max-w-md rounded-3xl card-shadow hover:-rotate-1 transition-transform duration-500" />
        </Reveal>
      </section>
      </SectionBG>

      {/* ================= INGREDIENTS & NUTRITION ================= */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(160deg, #3B1F6B 0%, #4A2578 55%, #5B2E8F 100%)" }}>
        <PawPattern opacity={0.06} className="mix-blend-overlay" />
        <Blob className="w-96 h-96 -top-32 -right-20" color="#F5507F" opacity={0.25} />
        <Blob className="w-80 h-80 -bottom-24 -left-24" color="#F5A5C0" opacity={0.15} />
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <Reveal>
          <div className="text-center">
            <SectionEyebrow dark>Ingredients &amp; Nutrition</SectionEyebrow>
            <h2 className="font-display font-extrabold text-white text-[30px] md:text-[38px]">
              Real ingredients. Guaranteed nutrition.
            </h2>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Package, name: "Chicken", note: "Lean, high-protein base for strong muscles" },
              { icon: Heart, name: "Chicken Liver", note: "Rich in essential vitamins & minerals" },
              { icon: Fish, name: "Marine Fish", note: "Omega-rich for a shiny, healthy coat" },
            ].map((ing, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group relative bg-white/8 backdrop-blur border border-white/15 rounded-3xl p-7 hover:bg-white/14 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-[#F5507F]/20 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  <div className="relative w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <ing.icon className="w-7 h-7 text-[#F5A5C0]" />
                  </div>
                  <h3 className="relative font-display font-bold text-white text-[20px] mt-5">{ing.name}</h3>
                  <p className="relative text-white/60 text-[14px] mt-1.5 leading-relaxed">{ing.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: TrendingUp, label: "Protein" },
              { icon: Heart, label: "Nutrition" },
              { icon: Sparkles, label: "Taste" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2.5 text-white font-semibold text-[13.5px]">
                <b.icon className="w-4 h-4 text-[#F5A5C0]" /> {b.label}
              </div>
            ))}
          </div>

          <Reveal className="mt-14 bg-white rounded-3xl p-6 md:p-8 card-shadow">
            <h3 className="font-display font-bold text-[#3B1F6B] text-[19px] mb-5">Nutritional Analysis (Guaranteed)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Crude Protein (min.)", val: "9.0%" },
                { label: "Crude Fat (min.)", val: "4.0%" },
                { label: "Crude Fiber (max.)", val: "1.0%" },
                { label: "Moisture (max.)", val: "82.0%" },
                { label: "Ash (max.)", val: "2.5%" },
                { label: "Taurine (min.)", val: "0.1%" },
              ].map((n, i) => (
                <div key={i} className="text-center">
                  <div className="font-display font-extrabold text-[#F5507F] text-[22px]">{n.val}</div>
                  <div className="text-[11.5px] text-[#3B1F6B]/60 font-semibold mt-1 leading-tight">{n.label}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6 pt-5 border-t border-[#3B1F6B]/8 text-[13.5px] text-[#3B1F6B]/70 font-semibold">
              Calorie Content (ME Calculated): 920 kcal/kg &nbsp;|&nbsp; 78 kcal/pouch
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FEEDING GUIDE ================= */}
      <SectionBG
        wash="linear-gradient(160deg, #FFF3F7 0%, #FFFFFF 50%, #F4EEFB 100%)"
        className="py-16 md:py-24"
      >
      <section className="max-w-5xl mx-auto px-5 md:px-8">
        <Reveal>
          <SectionEyebrow>Feeding Guide</SectionEyebrow>
          <h2 className="font-display font-extrabold text-[#3B1F6B] text-[30px] md:text-[38px] text-center">
            How much should your cat eat?
          </h2>
          <p className="text-center text-[#241633]/60 text-[15px] mt-3 max-w-lg mx-auto">
            Select your cat's weight to see the daily recommended feeding amount.
          </p>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3 mt-9">
          {Object.entries(feedingTable).map(([key, v]) => (
            <button
              key={key}
              onClick={() => setFeedWeight(key)}
              className={`rounded-2xl px-6 py-4 border-2 font-bold text-[15px] transition-all duration-300 ${
                feedWeight === key
                  ? "border-[#F5507F] bg-[#FFE3EC] text-[#3B1F6B] scale-105 shadow-lg shadow-[#F5507F]/15"
                  : "border-[#3B1F6B]/12 text-[#3B1F6B]/70 hover:border-[#3B1F6B]/30 bg-white/70"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="mt-8 relative bg-white rounded-3xl p-8 md:p-10 text-center card-shadow overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F5507F]/8 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#3B1F6B]/8 blur-2xl" />
          <div className="relative text-[13px] font-bold tracking-wide uppercase text-[#F5507F]">Recommended Daily Feeding</div>
          <div key={feedWeight} className="relative font-display font-extrabold text-[#3B1F6B] text-[38px] md:text-[44px] mt-2 animate-[fadeUp_0.4s_ease-out]">
            {feedingTable[feedWeight].amount}
          </div>
          <p className="relative text-[13.5px] text-[#241633]/55 mt-3 max-w-md mx-auto">
            Adjust amount according to your cat's age, activity level and environment. Split into 2 feedings per day for best results.
          </p>
        </div>
      </section>
      </SectionBG>

      {/* ================= SUBSCRIPTION ================= */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(160deg, #FFEAF1 0%, #FFF6F9 60%, #F4EEFB 100%)" }}>
        <PawPattern opacity={0.04} rotate={10} />
        <div className="max-w-5xl mx-auto px-5 md:px-8 relative z-10">
          <Reveal>
          <div className="grad-pink-purple rounded-[32px] p-8 md:p-14 text-white grid md:grid-cols-2 gap-10 items-center card-shadow relative overflow-hidden">
            <PawPattern opacity={0.08} className="mix-blend-overlay" />
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-16 w-48 h-48 rounded-full bg-white/8" />
            <div className="relative">
              <Pill tone="cream">FreshPet Monthly Care Plan</Pill>
              <h2 className="font-display font-extrabold text-[30px] md:text-[36px] mt-4 leading-snug">
                Never run out of mealtime happiness.
              </h2>
              <p className="text-white/80 text-[15px] mt-3 leading-relaxed">
                Subscribe and get fresh FreshPet pouches delivered to your door every month — at a discounted price, with zero effort.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Truck, text: "Regular monthly delivery, right on schedule" },
                  { icon: Repeat, text: "Full convenience — pause, skip, or cancel anytime" },
                  { icon: Gift, text: `Save ${subDiscountPct}% on every pouch, every month` },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14.5px] font-semibold">
                    <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4" />
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative bg-white rounded-3xl p-7 text-[#241633]">
              <div className="text-[13px] font-bold uppercase tracking-wide text-[#F5507F]">Monthly Plan</div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display font-extrabold text-[#3B1F6B] text-[34px]">
                  BDT {(price * (1 - subDiscountPct / 100)).toFixed(0)}
                </span>
                <span className="text-[13px] text-[#241633]/50">/ pouch</span>
              </div>
              <div className="text-[12.5px] text-[#3B1F6B]/40 line-through">BDT {price} / pouch</div>
              <button
                onClick={() => {
                  setSubscribe(true);
                  scrollTo("shop");
                }}
                className="btn-press w-full mt-6 grad-pink-purple text-white font-bold py-3.5 rounded-full hover:brightness-105 transition"
              >
                Start My Subscription
              </button>
              <p className="text-[11.5px] text-[#3B1F6B]/50 text-center mt-3">No commitment. Cancel anytime.</p>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <SectionBG
        wash="linear-gradient(180deg, #FFFFFF 0%, #FFF0F5 50%, #FFFFFF 100%)"
        className="py-16 md:py-24"
      >
      <section className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal>
          <SectionEyebrow>Happy Cats, Happy Owners</SectionEyebrow>
          <h2 className="font-display font-extrabold text-[#3B1F6B] text-[30px] md:text-[38px] text-center mb-12">
            What our FreshPet family says
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "Since switching to FreshPet, my cat loves mealtime. She actually runs to the kitchen now!", name: "Ayesha R.", cat: "Mishti", rating: 5 },
            { quote: "Finally a local wet food that doesn't cost a fortune. Tumpa is obsessed with the fish recipe.", name: "Farhan K.", cat: "Tumpa", rating: 5 },
            { quote: "The pouches are so convenient for our small apartment — no mess, no leftovers, no fuss.", name: "Nusrat J.", cat: "Bagheera", rating: 4 },
          ].map((r, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="group relative bg-white rounded-3xl border border-[#3B1F6B]/8 card-shadow p-7 overflow-hidden hover:-translate-y-1.5 transition-all duration-300">
                <div className="absolute -left-6 -top-6 w-20 h-20 rounded-full bg-[#F5507F]/6 group-hover:scale-125 transition-transform duration-500" />
                <Quote className="relative w-7 h-7 text-[#F5507F]/30" />
                <p className="relative text-[15px] text-[#241633]/75 mt-3 leading-relaxed">"{r.quote}"</p>
                <div className="relative flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < r.rating ? "text-[#F5507F] fill-[#F5507F]" : "text-[#3B1F6B]/15 fill-[#3B1F6B]/15"}`} />
                  ))}
                </div>
                <div className="relative flex items-center gap-3 mt-4 pt-4 border-t border-[#3B1F6B]/8">
                  <div className="w-11 h-11 rounded-full bg-[#EDE6F9] flex items-center justify-center">
                    <Cat className="w-5 h-5 text-[#3B1F6B]" />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold text-[#3B1F6B]">{r.name}</div>
                    <div className="text-[12px] text-[#241633]/50">Cat parent to {r.cat}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      </SectionBG>

      {/* ================= BLOG ================= */}
      <section id="blog" className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(160deg, #F4EEFB 0%, #FFF6F9 50%, #FFEAF1 100%)" }}>
        <PawPattern opacity={0.05} rotate={-6} />
        <Blob className="w-80 h-80 -top-24 right-1/4" color="#3B1F6B" opacity={0.1} />
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <Reveal>
            <SectionEyebrow>Cat Care</SectionEyebrow>
            <h2 className="font-display font-extrabold text-[#3B1F6B] text-[30px] md:text-[38px] text-center mb-12">
              Learn to care, one pouch at a time
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tag: "Nutrition 101", title: "Wet Food vs Dry Food", desc: "Understand the real differences in hydration, protein and digestibility — and why most vets recommend a mix.", icon: Droplets },
              { tag: "Feeding", title: "How Much Food Does My Cat Need?", desc: "A practical breakdown by weight, age and activity level so you never over- or under-feed.", icon: Package },
              { tag: "Wellness", title: "Importance of Hydration for Cats", desc: "Cats are famously bad at drinking water — here's how wet food quietly solves that problem.", icon: Heart },
            ].map((b, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white rounded-3xl border border-[#3B1F6B]/8 card-shadow overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                  <div className="h-36 grad-pink-purple flex items-center justify-center relative overflow-hidden">
                    <PawPattern opacity={0.12} className="mix-blend-overlay" />
                    <b.icon className="w-12 h-12 text-white/90 relative group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <span className="text-[11.5px] font-bold uppercase tracking-wide text-[#F5507F]">{b.tag}</span>
                    <h3 className="font-display font-bold text-[#3B1F6B] text-[18.5px] mt-2 leading-snug">{b.title}</h3>
                    <p className="text-[13.5px] text-[#241633]/60 mt-2 leading-relaxed">{b.desc}</p>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#F5507F] mt-4 group-hover:gap-2.5 transition-all">
                      Read more <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PET PROFILE CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <Reveal>
        <div className="relative rounded-[32px] border-2 border-dashed border-[#F5507F]/30 bg-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#F5507F]/6 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#3B1F6B]/6 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE3EC] flex items-center justify-center shrink-0">
              <Cat className="w-7 h-7 text-[#F5507F]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#3B1F6B] text-[20px]">Create your cat's profile</h3>
              <p className="text-[13.5px] text-[#241633]/60 mt-1">Get a personalized feeding suggestion in 10 seconds.</p>
            </div>
          </div>
          <button
            onClick={() => setPetModalOpen(true)}
            className="relative btn-press grad-pink-purple text-white font-bold text-[14.5px] px-6 py-3 rounded-full card-shadow hover:brightness-105 transition whitespace-nowrap"
          >
            Build Cat Profile
          </button>
        </div>
        </Reveal>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="footer" className="bg-[#241633] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10">
            <div>
              <img src={LOGO} alt="FreshPet" className="h-9 w-auto object-contain bg-white rounded-xl px-2 py-1" />
              <p className="text-white/55 text-[13.5px] mt-4 leading-relaxed max-w-xs">
                Premium wet cat food, made fresh in Bangladesh. Fresh Nutrition. Happy Cats.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5507F] transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[14px] mb-4 text-white/90">Navigate</h4>
              <ul className="space-y-2.5 text-[13.5px] text-white/55">
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <button onClick={() => scrollTo(l.id)} className="hover:text-white transition-colors">{l.label}</button>
                  </li>
                ))}
                <li><button className="hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[14px] mb-4 text-white/90">Contact</h4>
              <ul className="space-y-2.5 text-[13.5px] text-white/55 leading-relaxed">
                <li>House-12, Road-6, Sector-11,<br />Uttara, Dhaka-1230, Bangladesh</li>
                <li>www.freshpet.com.bd</li>
                <li>@freshpet.bd</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[14px] mb-4 text-white/90">Ingredients</h4>
              <ul className="space-y-2.5 text-[13.5px] text-white/55">
                <li>Chicken, Chicken Liver</li>
                <li>Marine Fish</li>
                <li>Taurine, Vitamins &amp; Minerals</li>
                <li>No artificial preservatives</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12.5px] text-white/40">© 2026 FreshPet Bangladesh. All rights reserved.</span>
            <span className="text-[12.5px] text-white/40 flex items-center gap-1.5">
              <PawIcon className="w-3.5 h-3.5 text-[#F5507F]" /> Fresh Nutrition. Happy Cats.
            </span>
          </div>
        </div>
      </footer>

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-[#241633] text-white text-[13.5px] font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-[#F5507F]" /> {toast}
        </div>
      )}

      {/* ================= CART DRAWER ================= */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-[#241633]/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#3B1F6B]/8">
              <h3 className="font-display font-bold text-[#3B1F6B] text-[20px] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h3>
              <button onClick={() => setCartOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#FFE9F0]">
                <X className="w-5 h-5 text-[#3B1F6B]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 && (
                <div className="text-center py-20">
                  <PawIcon className="w-10 h-10 text-[#3B1F6B]/15 mx-auto" />
                  <p className="text-[#241633]/50 text-[14px] mt-3">Your cart is empty. Add some happiness for your cat!</p>
                </div>
              )}
              {cart.map((item) => (
                <div key={item.key} className="flex gap-4 bg-[#FFF6F9] rounded-2xl p-4">
                  <img src={FRONT_POUCH} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-[#3B1F6B] leading-snug">{item.name}</div>
                    <div className="text-[11.5px] text-[#3B1F6B]/50 mt-0.5">{item.type}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#3B1F6B]/15 rounded-full">
                        <button onClick={() => updateCartQty(item.key, -1)} className="w-7 h-7 flex items-center justify-center text-[#3B1F6B]">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-[12.5px] font-bold text-[#3B1F6B]">{item.qty}</span>
                        <button onClick={() => updateCartQty(item.key, 1)} className="w-7 h-7 flex items-center justify-center text-[#3B1F6B]">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-[#3B1F6B] text-[14px]">BDT {(item.qty * item.unitPrice).toFixed(0)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeCartItem(item.key)} className="text-[#3B1F6B]/30 hover:text-[#F5507F] transition-colors self-start">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[#3B1F6B]/8">
                <div className="flex items-center justify-between text-[15px] font-bold text-[#3B1F6B] mb-4">
                  <span>Subtotal</span>
                  <span>BDT {cartSubtotal.toFixed(0)}</span>
                </div>
                <button
                  onClick={() => {
                    showToast("Demo checkout — order placed! 🐾");
                    setCart([]);
                    setCartOpen(false);
                  }}
                  className="btn-press w-full grad-pink-purple text-white font-bold py-3.5 rounded-full hover:brightness-105 transition"
                >
                  Checkout
                </button>
                <p className="text-[11px] text-center text-[#3B1F6B]/40 mt-3">Demo experience — no real order will be placed.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ACCOUNT DASHBOARD MODAL ================= */}
      {accountOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#241633]/50 backdrop-blur-sm" onClick={() => setAccountOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#3B1F6B]/8 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#EDE6F9] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#3B1F6B]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#3B1F6B] text-[19px]">Ayesha's FreshPet Account</h3>
                  <p className="text-[12.5px] text-[#241633]/50">Member since Jan 2026</p>
                </div>
              </div>
              <button onClick={() => setAccountOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#FFE9F0]">
                <X className="w-5 h-5 text-[#3B1F6B]" />
              </button>
            </div>

            <div className="flex gap-2 px-6 pt-5">
              {[
                { id: "orders", label: "Order History" },
                { id: "subscription", label: "Subscription" },
                { id: "loyalty", label: "Loyalty Points" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAccountTab(t.id)}
                  className={`px-4 py-2.5 rounded-full text-[13.5px] font-bold transition ${
                    accountTab === t.id ? "bg-[#3B1F6B] text-white" : "bg-[#FFF6F9] text-[#3B1F6B]/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {accountTab === "orders" && (
                <div className="space-y-3">
                  {[
                    { id: "#FP-1042", date: "12 Aug 2026", items: "6 pouches", status: "Delivered", total: 420 },
                    { id: "#FP-0988", date: "10 Jul 2026", items: "12 pouches", status: "Delivered", total: 806 },
                    { id: "#FP-0921", date: "08 Jun 2026", items: "6 pouches", status: "Delivered", total: 420 },
                  ].map((o, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#FFF6F9] rounded-2xl p-4">
                      <div>
                        <div className="text-[13.5px] font-bold text-[#3B1F6B]">{o.id} · {o.items}</div>
                        <div className="text-[12px] text-[#241633]/50 mt-0.5">{o.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13.5px] font-bold text-[#3B1F6B]">BDT {o.total}</div>
                        <div className="text-[11.5px] text-[#2F9E63] font-semibold mt-0.5 flex items-center gap-1 justify-end"><Check className="w-3 h-3" /> {o.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === "subscription" && (
                <div className="bg-gradient-to-br from-[#FFE3EC] to-[#EDE6F9] rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <Pill tone="cream">Active Plan</Pill>
                    <span className="text-[12px] font-bold text-[#2F9E63] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Active</span>
                  </div>
                  <h4 className="font-display font-bold text-[#3B1F6B] text-[19px] mt-4">Monthly Care Plan</h4>
                  <p className="text-[13.5px] text-[#241633]/60 mt-1">12 pouches / month · Next delivery: 05 Sep 2026</p>
                  <div className="flex items-center gap-3 mt-5">
                    <button className="text-[13px] font-bold text-[#3B1F6B] bg-white px-4 py-2 rounded-full">Skip next month</button>
                    <button className="text-[13px] font-bold text-[#F5507F] bg-white px-4 py-2 rounded-full">Manage plan</button>
                  </div>
                </div>
              )}

              {accountTab === "loyalty" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13.5px] font-bold text-[#3B1F6B]">Paw Points</span>
                    <span className="text-[13.5px] font-bold text-[#F5507F]">640 / 1000</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#FFF6F9] overflow-hidden">
                    <div className="h-full grad-pink-purple rounded-full" style={{ width: "64%" }} />
                  </div>
                  <p className="text-[12.5px] text-[#241633]/50 mt-3">360 points to your next free pouch reward 🐾</p>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { label: "Free pouch", pts: "300 pts" },
                      { label: "10% off box", pts: "600 pts" },
                      { label: "Free delivery", pts: "150 pts" },
                    ].map((r, i) => (
                      <div key={i} className="bg-[#FFF6F9] rounded-2xl p-4 text-center">
                        <Gift className="w-5 h-5 text-[#F5507F] mx-auto" />
                        <div className="text-[12px] font-bold text-[#3B1F6B] mt-2">{r.label}</div>
                        <div className="text-[11px] text-[#241633]/50">{r.pts}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= PET PROFILE MODAL ================= */}
      {petModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#241633]/50 backdrop-blur-sm" onClick={() => { setPetModalOpen(false); setPetResult(null); }} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#3B1F6B]/8">
              <h3 className="font-display font-bold text-[#3B1F6B] text-[19px] flex items-center gap-2">
                <Cat className="w-5 h-5" /> Create Your Cat's Profile
              </h3>
              <button onClick={() => { setPetModalOpen(false); setPetResult(null); }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#FFE9F0]">
                <X className="w-5 h-5 text-[#3B1F6B]" />
              </button>
            </div>

            {!petResult ? (
              <form onSubmit={submitPetForm} className="p-6 space-y-4">
                <div>
                  <label className="text-[13px] font-bold text-[#3B1F6B]">Cat's Name</label>
                  <input
                    required
                    value={petForm.name}
                    onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                    placeholder="e.g. Mishti"
                    className="w-full mt-1.5 rounded-xl border-2 border-[#3B1F6B]/12 px-4 py-3 text-[14px] focus:border-[#F5507F] outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] font-bold text-[#3B1F6B]">Age (years)</label>
                    <input
                      value={petForm.age}
                      onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                      placeholder="2"
                      type="number"
                      min="0"
                      className="w-full mt-1.5 rounded-xl border-2 border-[#3B1F6B]/12 px-4 py-3 text-[14px] focus:border-[#F5507F] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-[#3B1F6B]">Weight (kg)</label>
                    <input
                      required
                      value={petForm.weight}
                      onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                      placeholder="4"
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full mt-1.5 rounded-xl border-2 border-[#3B1F6B]/12 px-4 py-3 text-[14px] focus:border-[#F5507F] outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#3B1F6B]">Breed</label>
                  <input
                    value={petForm.breed}
                    onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                    placeholder="e.g. Local shorthair, Persian..."
                    className="w-full mt-1.5 rounded-xl border-2 border-[#3B1F6B]/12 px-4 py-3 text-[14px] focus:border-[#F5507F] outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-press w-full grad-pink-purple text-white font-bold py-3.5 rounded-full hover:brightness-105 transition mt-2"
                >
                  Get Feeding Suggestion
                </button>
              </form>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFE3EC] flex items-center justify-center mx-auto">
                  <Cat className="w-8 h-8 text-[#F5507F]" />
                </div>
                <h4 className="font-display font-bold text-[#3B1F6B] text-[20px] mt-4">
                  {petForm.name}'s Feeding Plan
                </h4>
                <p className="text-[13px] text-[#241633]/55 mt-1">
                  {petForm.breed || "Cat"} · {petForm.age ? `${petForm.age} yrs old` : "Age not set"} · {petForm.weight} kg
                </p>
                <div className="bg-[#FFF6F9] rounded-2xl p-6 mt-5">
                  <div className="text-[12.5px] font-bold uppercase tracking-wide text-[#F5507F]">Recommended Daily Feeding</div>
                  <div className="font-display font-extrabold text-[#3B1F6B] text-[28px] mt-2">{petResult.amount}</div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setPetResult(null)}
                    className="flex-1 font-bold text-[13.5px] text-[#3B1F6B] border-2 border-[#3B1F6B]/15 py-3 rounded-full"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setPetModalOpen(false);
                      scrollTo("shop");
                    }}
                    className="flex-1 btn-press grad-pink-purple text-white font-bold text-[13.5px] py-3 rounded-full"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
