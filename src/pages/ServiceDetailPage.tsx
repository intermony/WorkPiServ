import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, ShieldCheck, RefreshCcw, Heart, ChevronDown,
  Check, X, MessageCircle
} from 'lucide-react';
import { services } from '@/data/services';
import { reviews } from '@/data/reviews';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { StarRating } from '@/components/shared/StarRating';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const service = services.find(s => s.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [activePackage, setActivePackage] = useState(1); // Standard
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Service not found</h1>
          <Link to="/marketplace" className="text-brand hover:underline mt-4 inline-block">
            Browse services
          </Link>
        </div>
      </main>
    );
  }

  const gallery = service.gallery || [service.image];
  const pkg = service.packages?.[activePackage];
  const toggleFaq = (q: string) => {
    setOpenFaqs(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q]);
  };

  const ratingBreakdown = [
    { stars: 5, count: 22 },
    { stars: 4, count: 1 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 1 },
  ];
  const totalReviews = reviews.length;

  return (
    <main className="min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="section-container py-4">
          <div className="text-sm text-gray-500 truncate">
            <Link to="/" className="text-brand hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/marketplace" className="text-brand hover:underline">Marketplace</Link>
            <span className="mx-2">/</span>
            <span className="capitalize text-gray-700">{service.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-700 truncate">{service.title}</span>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <ScrollReveal>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={gallery[activeImage]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImage ? 'border-brand' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </ScrollReveal>

            {/* Service Header */}
            <ScrollReveal className="mt-8">
              <h1 className="font-heading font-bold text-2xl lg:text-3xl text-navy">
                {service.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-brand-light text-brand text-xs font-medium px-3 py-1 rounded-full capitalize">
                  {service.category}
                </span>
                <span className="bg-escrow-light text-escrow text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Escrow Protected
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={14} /> {service.deliveryDays} days delivery
                </span>
              </div>
            </ScrollReveal>

            {/* Freelancer Preview */}
            <ScrollReveal delay={0.1} className="mt-4">
              <div className="flex items-center gap-3">
                <img
                  src={service.freelancer.avatar}
                  alt={service.freelancer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy">{service.freelancer.name}</span>
                    {service.freelancer.verified && (
                      <span className="text-green-500">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <StarRating rating={service.rating} size={12} showValue />
                    <span>{service.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal className="mt-8">
              <div className="card-surface p-6 lg:p-8">
                <h2 className="font-heading font-bold text-xl text-navy mb-4">About This Service</h2>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                  <p>{service.description}</p>
                  <p className="mt-4"><strong>What You'll Get:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2 marker:text-brand">
                    <li>Unique, custom logo design tailored to your brand</li>
                    <li>High-resolution files suitable for print and digital use</li>
                    <li>Full ownership and copyright of the final design</li>
                    <li>Professional communication throughout the process</li>
                  </ul>
                  <p className="mt-4"><strong>My Process:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 mt-2 marker:text-brand marker:font-bold">
                    <li>Discovery — I'll learn about your brand, target audience, and vision</li>
                    <li>Concept Development — I'll create initial logo concepts based on our discussion</li>
                    <li>Refinement — We'll work together to refine your chosen concept</li>
                    <li>Delivery — You'll receive all final files in multiple formats</li>
                  </ol>
                </div>

                {/* FAQ */}
                {service.faqs && service.faqs.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-heading font-bold text-lg text-navy mb-4">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-0">
                      {service.faqs.map((faq) => {
                        const isOpen = openFaqs.includes(faq.question);
                        return (
                          <div key={faq.question} className="border-b border-gray-200">
                            <button
                              onClick={() => toggleFaq(faq.question)}
                              className="w-full flex items-center justify-between py-4 text-left"
                            >
                              <span className="font-medium text-navy text-sm pr-4">{faq.question}</span>
                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown size={18} className="text-gray-400 shrink-0" />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <p className="pb-4 text-sm text-gray-500">{faq.answer}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Reviews */}
            <ScrollReveal className="mt-8">
              <div className="card-surface p-6 lg:p-8">
                <h2 className="font-heading font-bold text-xl text-navy mb-6">Customer Reviews</h2>
                
                {/* Rating Summary */}
                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-bold text-navy">{service.rating}</div>
                    <StarRating rating={service.rating} size={24} className="mt-2 justify-center sm:justify-start" />
                    <p className="text-sm text-gray-500 mt-1">{totalReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingBreakdown.map(item => {
                      const pct = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;
                      return (
                        <div key={item.stars} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">{item.stars} ★</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-amber-400 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-6 text-right">{item.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-0 divide-y divide-gray-100">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="py-5"
                    >
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <span className="font-medium text-navy text-sm">{review.author}</span>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <StarRating rating={review.rating} size={14} showValue />
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{review.content}</p>
                      <span className="inline-block mt-2 bg-brand-light text-brand text-xs px-2.5 py-1 rounded-full">
                        {review.package}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Sticky Pricing Card */}
          <aside className="lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-24">
              <ScrollReveal>
                <div className="card-surface p-6">
                  {/* Package Tabs */}
                  {service.packages && (
                    <>
                      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
                        {service.packages.map((p, i) => (
                          <button
                            key={p.name}
                            onClick={() => setActivePackage(i)}
                            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all relative ${
                              activePackage === i
                                ? 'bg-brand text-white shadow-sm'
                                : 'text-gray-600 hover:text-navy'
                            }`}
                          >
                            {p.name}
                            {p.popular && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                Popular
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {pkg && (
                          <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-3xl font-bold text-brand">π {pkg.price}</div>
                            <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> {pkg.deliveryDays} days
                              </span>
                              <span>{pkg.revisions} revisions</span>
                            </div>

                            {/* Features */}
                            <ul className="mt-5 space-y-2.5">
                              {pkg.features.map(f => (
                                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                                  {f.included ? (
                                    <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                                  ) : (
                                    <X size={16} className="text-gray-300 shrink-0 mt-0.5" />
                                  )}
                                  <span className={f.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                                    {f.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {/* CTA */}
                  <button className="btn-primary w-full mt-6 py-3.5 text-base">
                    Continue (π {pkg?.price || service.price})
                  </button>
                  <div className="flex gap-3 mt-3">
                    <button className="btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                      <MessageCircle size={16} /> Contact
                    </button>
                    <button
                      onClick={() => setSaved(!saved)}
                      className={`btn-ghost py-2.5 px-4 ${saved ? 'text-red-500' : ''}`}
                    >
                      <Heart size={18} className={saved ? 'fill-red-500' : ''} />
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ShieldCheck size={14} /> Escrow
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <RefreshCcw size={14} /> Free Cancel
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={14} /> On Time
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
