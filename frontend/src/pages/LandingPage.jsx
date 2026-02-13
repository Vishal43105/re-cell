import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  Check,
  Globe,
  Shield,
  Zap,
  Package,
  FileText,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_96a9ec26-fc2d-4460-b209-fe063f10fbb5/artifacts/q3o60yd9_Color%20logo%20-%20no%20background.png";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#supply", label: "Supply" },
    { href: "#process", label: "Process" },
    { href: "#footprint", label: "Footprint" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3" data-testid="logo-link">
            <img
              src={LOGO_URL}
              alt="Re-Cell Logo"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <div className="font-semibold text-white tracking-tight">Re-Cell Technology Solutions</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Wholesale Distribution</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-2"
              data-testid="nav-cta"
            >
              <Button className="bg-[#D5A528] hover:bg-[#E7C873] text-black font-semibold px-5 py-2 rounded-full transition-all hover:shadow-[0_0_20px_rgba(213,165,40,0.4)]">
                Request Stock List
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mobile-menu fixed inset-0 top-16 z-40 px-6 py-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg text-zinc-300 hover:text-[#D5A528] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#D5A528] hover:bg-[#E7C873] text-black font-semibold mt-4">
                  Request Stock List
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-16 md:pt-20 hero-gradient geometric-lines overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            className="lg:col-span-3 glass-card rounded-2xl p-5 sm:p-8 md:p-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border border-[#D5A528]/30 bg-[#D5A528]/10 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#D5A528] to-[#E7C873] animate-pulse" />
              <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Europe • UAE • USA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              Global wholesale distribution of{" "}
              <span className="gold-text">Apple devices</span>.
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mb-6 sm:mb-8">
              Supplying iPhone, iPad, MacBook and AirPods inventory to professional buyers.
              Built for volume, speed, and repeat supply.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a href="#contact" data-testid="hero-cta-partner" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#D5A528] hover:bg-[#E7C873] text-black font-semibold px-5 sm:px-6 py-3 rounded-full transition-all hover:shadow-[0_0_30px_rgba(213,165,40,0.4)] flex items-center justify-center gap-2">
                  Become a Trade Partner
                  <ArrowRight size={18} />
                </Button>
              </a>
              <div className="flex gap-3 sm:gap-4">
                <a href="#process" data-testid="hero-cta-process" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full sm:w-auto border-white/10 text-white hover:bg-white/5 px-4 sm:px-6 py-3 rounded-full text-sm sm:text-base">
                    How it works
                  </Button>
                </a>
                <a
                  href="https://wa.me/353830450305"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="hero-cta-whatsapp"
                  className="flex-1 sm:flex-none"
                >
                  <Button variant="outline" className="w-full sm:w-auto border-white/10 text-white hover:bg-white/5 px-4 sm:px-6 py-3 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base">
                    <MessageCircle size={18} />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-white/10 pt-4 sm:pt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6">
              {[
                { value: "2,500+", label: "weekly capacity" },
                { value: "Same-day", label: "shipment" },
                { value: "Data Cleared", label: "units" },
                { value: "IMEI", label: "recording" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5A528]/60" />
                  <span className="text-white font-medium">{stat.value}</span>
                  <span className="text-zinc-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Trade Buyer Focus</h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { title: "Wholesale-first operations", desc: "No retail noise. Fast quotes, clean terms, reliable dispatch." },
                { title: "Clear grading, realistic batches", desc: "New, Like New (Activated), and A+ depending on batch availability." },
                { title: "Structured sourcing", desc: "Professional channels including telecom auctions and enterprise supply." },
                { title: "Built for repeat supply", desc: "We work with serious buyers who need consistency and speed." },
              ].map((item, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl bg-black/40 border border-white/5 card-hover">
                  <h4 className="text-white font-medium mb-1 text-sm sm:text-base">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="text-[#D5A528]/50" size={32} />
      </motion.div>
    </section>
  );
};

// Supply Section
const SupplySection = () => {
  const products = [
    { name: "iPhone", desc: "Mixed generations, batch supply, trade-ready configurations.", icon: Phone },
    { name: "iPad", desc: "Wi-Fi and Cellular variants, bulk-friendly lines.", icon: Package },
    { name: "MacBook", desc: "Selected batches where supply is available.", icon: FileText },
    { name: "AirPods & Accessories", desc: "High-demand add-ons included when available.", icon: Zap },
  ];

  const grades = ["New", "Like New (Activated)", "A+"];

  return (
    <section id="supply" className="py-16 sm:py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">What we supply</h2>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base">
            Wholesale Apple ecosystem inventory for professional buyers across key global markets.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {products.map((product, i) => (
            <motion.div
              key={i}
              className="product-card p-4 sm:p-6 rounded-xl"
              variants={fadeInUp}
              data-testid={`product-${product.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              <product.icon className="text-[#D5A528] mb-3 sm:mb-4" size={24} />
              <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{product.name}</h4>
              <p className="text-xs sm:text-sm text-zinc-500">{product.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {grades.map((grade) => (
            <span
              key={grade}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 border border-[#D5A528]/20 bg-[#D5A528]/5"
            >
              {grade}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Process Section
const ProcessSection = () => {
  const steps = [
    { num: 1, title: "Request stock list", desc: "Tell us your region, target models, grade range and volume requirements." },
    { num: 2, title: "Quote + terms", desc: "We confirm availability, send pricing, packing spec and shipping options." },
    { num: 3, title: "Payment + dispatch", desc: "Invoice confirmed → payment received → secure dispatch with tracking." },
  ];

  return (
    <section id="process" className="py-24 md:py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-zinc-400">Simple process. Fast turnaround. No time wasting.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl bg-[#09090b] border border-white/5 card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-testid={`process-step-${step.num}`}
            >
              <div className="step-number w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mb-4">
                {step.num}
              </div>
              <h4 className="text-white font-semibold mb-2">{step.title}</h4>
              <p className="text-sm text-zinc-500">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footprint Section
const FootprintSection = () => {
  const locations = [
    { name: "Ireland — Head Office", detail: "Maynooth, Co. Kildare" },
    { name: "UAE — Regional Operations", detail: "Dubai" },
    { name: "USA — Distribution Support", detail: "Warehouse dispatch capability" },
  ];

  const reasons = [
    { title: "Consistent volume", desc: "Structured supply designed for repeat purchase cycles." },
    { title: "Transparent grading", desc: "No surprises. Clear expectations and trade communication." },
    { title: "Operational control", desc: "Secure workflow from receipt → processing → dispatch." },
    { title: "Compliance-ready", desc: "IMEI recording and data wipe documentation available on request." },
  ];

  return (
    <section id="footprint" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">International footprint</h2>
          <p className="text-zinc-400 max-w-2xl">
            We support buyers across Europe, the Middle East and North America with efficient logistics and export capability.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D5A528]/10 via-transparent to-[#D5A528]/5 pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-6 p-6 md:p-8 relative">
              {/* Locations */}
              <div>
                <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4">Operational Presence</h3>
                <div className="space-y-3">
                  {locations.map((loc, i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      data-testid={`location-${i}`}
                    >
                      <MapPin className="text-[#D5A528] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="text-white font-medium">{loc.name}</h4>
                        <p className="text-sm text-zinc-500">{loc.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Why buyers stay */}
              <div>
                <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4">Why buyers stay</h3>
                <div className="space-y-3">
                  {reasons.map((reason, i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-xl bg-black/40 border border-white/5"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <h4 className="text-white font-medium mb-1">{reason.title}</h4>
                      <p className="text-sm text-zinc-500">{reason.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${API}/faq`);
        setFaqs(response.data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        // Fallback FAQs
        setFaqs([
          { id: "1", question: "What is the minimum order quantity?", answer: "Our minimum order starts at 50 units. For first-time buyers, we recommend starting with a smaller batch to establish the working relationship." },
          { id: "2", question: "What payment methods do you accept?", answer: "We accept bank transfers (SEPA for EU, SWIFT for international), and can discuss other payment arrangements for established partners." },
          { id: "3", question: "How does your grading system work?", answer: "We use industry-standard grading: Brand New (sealed), CPO (Certified Pre-Owned), Grade A (excellent condition), Grade B (good condition), Grade C (functional, visible wear), AS-IS (untested or with known issues)." },
          { id: "4", question: "Do you provide warranty?", answer: "Warranty terms depend on the product grade and batch. Brand New and CPO come with manufacturer warranty. Pre-owned grades typically include a DOA protection period." },
          { id: "5", question: "Can you ship internationally?", answer: "Yes, we ship to Europe, UAE/GCC, USA, and other regions. We handle export documentation and can arrange DDP or DAP shipping." },
          { id: "6", question: "How quickly can you fulfill orders?", answer: "Standard orders ship within 24-48 hours of payment confirmation. Larger orders may require 3-5 business days for processing and quality checks." },
        ]);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#050505]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
          <p className="text-zinc-400">Everything you need to know about working with us.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="faq-item rounded-xl px-6 border-0"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="text-left text-white hover:text-[#D5A528] hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    region: "",
    volume: "",
    products: "",
    grade: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/enquiries`, formData);
      toast.success("Enquiry submitted successfully! We'll be in touch shortly.");
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        region: "",
        volume: "",
        products: "",
        grade: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      toast.error("Failed to submit enquiry. Please try WhatsApp or email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quoteRequirements = [
    { title: "Delivery country + shipping terms", desc: "Tell us if you need DDP / DAP expectations." },
    { title: "Target models or \"mixed generations\"", desc: "If you don't care, say that. It changes pricing + availability." },
    { title: "Volume and purchase frequency", desc: "Weekly / monthly. We build supply around cadence." },
    { title: "Grade + must-haves", desc: "Cosmetic expectations, battery rules, lock status, etc." },
  ];

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trade enquiries</h2>
          <p className="text-zinc-400">
            Professional buyers only. If you want a quote, submit real details and volume requirements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div
            className="glass-card rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Full name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                    required
                    className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white placeholder:text-zinc-600"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder="Company name"
                    required
                    className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white placeholder:text-zinc-600"
                    data-testid="input-company"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white placeholder:text-zinc-600"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Phone / WhatsApp</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+00 ..."
                    className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white placeholder:text-zinc-600"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Buying region</label>
                  <Select value={formData.region} onValueChange={(v) => handleChange("region", v)} required>
                    <SelectTrigger className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white" data-testid="select-region">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#09090b] border-white/10">
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="UAE / GCC">UAE / GCC</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Target volume</label>
                  <Select value={formData.volume} onValueChange={(v) => handleChange("volume", v)} required>
                    <SelectTrigger className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white" data-testid="select-volume">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#09090b] border-white/10">
                      <SelectItem value="50–200 units">50–200 units</SelectItem>
                      <SelectItem value="200–500 units">200–500 units</SelectItem>
                      <SelectItem value="500–1,000 units">500–1,000 units</SelectItem>
                      <SelectItem value="1,000+ units">1,000+ units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Products</label>
                  <Select value={formData.products} onValueChange={(v) => handleChange("products", v)} required>
                    <SelectTrigger className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white" data-testid="select-products">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#09090b] border-white/10">
                      <SelectItem value="iPhone">iPhone</SelectItem>
                      <SelectItem value="iPad">iPad</SelectItem>
                      <SelectItem value="MacBook">MacBook</SelectItem>
                      <SelectItem value="AirPods">AirPods</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Grade preference</label>
                  <Select value={formData.grade} onValueChange={(v) => handleChange("grade", v)} required>
                    <SelectTrigger className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white" data-testid="select-grade">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#09090b] border-white/10">
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like New (Activated)">Like New (Activated)</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Request details</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Models, quantities, target pricing, delivery country, timelines..."
                  required
                  rows={4}
                  className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white placeholder:text-zinc-600 resize-none"
                  data-testid="input-message"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#D5A528] hover:bg-[#E7C873] text-black font-semibold px-6 py-3 rounded-full transition-all hover:shadow-[0_0_30px_rgba(213,165,40,0.4)] disabled:opacity-50"
                  data-testid="submit-enquiry-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner w-4 h-4 mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Submit Trade Enquiry"
                  )}
                </Button>
                <a
                  href="https://wa.me/353830450305"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="contact-whatsapp-btn"
                >
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-6 py-3 rounded-full flex items-center gap-2">
                    <MessageCircle size={18} />
                    WhatsApp
                  </Button>
                </a>
              </div>

              <p className="text-sm text-zinc-500">
                Email: <a href="mailto:info@re-cell.ie" className="text-[#D5A528] hover:underline">info@re-cell.ie</a> •
                Phone: <a href="tel:+353830450305" className="text-[#D5A528] hover:underline">+353 83 045 0305</a>
              </p>
            </form>
          </motion.div>

          {/* Requirements */}
          <motion.div
            className="glass-card rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4">What we need to quote fast</h3>
            <div className="space-y-3">
              {quoteRequirements.map((req, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <h4 className="text-white font-medium mb-1">{req.title}</h4>
                  <p className="text-sm text-zinc-500">{req.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white font-medium">Re-Cell Technology Solutions Limited</p>
              <p className="text-sm text-zinc-500">Maynooth, Co. Kildare, Ireland</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Re-Cell Technology Solutions Limited. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#top" className="footer-link text-sm">Top</a>
            <a href="#contact" className="footer-link text-sm">Contact</a>
            <a href="/admin" className="footer-link text-sm">Admin</a>
          </div>
        </div>
        <p className="text-xs text-zinc-600 mt-4 text-center md:text-left">
          Wholesale enquiries only. If you are a consumer, contact the marketplace/retailer you purchased from.
        </p>
      </div>
    </footer>
  );
};

// Main Landing Page
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main>
        <HeroSection />
        <SupplySection />
        <ProcessSection />
        <FootprintSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
