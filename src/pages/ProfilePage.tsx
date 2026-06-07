import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Star, ShoppingBag, CheckCircle,
  Clock, MessageCircle, Share2, Edit3, LayoutGrid, User, Settings
} from 'lucide-react';
import { freelancers } from '@/data/users';
import { services } from '@/data/services';
import { reviews } from '@/data/reviews';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { StarRating } from '@/components/shared/StarRating';
import { ServiceCard } from '@/components/shared/ServiceCard';

const profileTabs = [
  { key: 'services', label: 'Services', icon: LayoutGrid },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'about', label: 'About', icon: User },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('services');
  const freelancer = freelancers.sarah;
  const freelancerServices = services.filter(s => s.freelancer.id === freelancer.id);

  const stats = [
    { value: freelancer.rating, label: 'Rating', icon: Star },
    { value: freelancer.orders, label: 'Orders', icon: ShoppingBag },
    { value: freelancer.completion, label: 'Completion', icon: CheckCircle },
    { value: freelancer.responseTime, label: 'Response', icon: Clock },
    { value: `${freelancer.yearsExp}`, label: 'Years Exp.', icon: Calendar },
  ];

  const ratingBreakdown = [
    { stars: 5, count: 105 },
    { stars: 4, count: 12 },
    { stars: 3, count: 4 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Cover */}
      <div className="h-48 lg:h-72 bg-gradient-to-br from-navy to-[#312E81] rounded-b-3xl" />

      <div className="section-container -mt-12 lg:-mt-16 relative z-10">
        {/* Profile Info Card */}
        <ScrollReveal>
          <div className="card-surface p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="-mt-20 md:-mt-24 mx-auto md:mx-0">
                <div className="relative">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {freelancer.online && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="font-heading font-bold text-2xl text-navy">{freelancer.name}</h1>
                  {freelancer.online && (
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  )}
                </div>
                <p className="text-gray-500 mt-1">{freelancer.title}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {freelancer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> Member since {freelancer.memberSince}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                  <button className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                    <MessageCircle size={16} /> Contact Me
                  </button>
                  <button className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
                    <Share2 size={16} /> Share
                  </button>
                  <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                    <Edit3 size={16} /> Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-bold text-navy text-lg">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <div className="mt-6 sticky top-16 z-30 bg-[#F3F4F6] pt-2">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 overflow-x-auto scrollbar-hide">
            {profileTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key ? 'bg-brand-light text-brand' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {freelancerServices.length > 0 ? (
                    freelancerServices.map((service, index) => (
                      <ServiceCard key={service.id} service={service} index={index} />
                    ))
                  ) : (
                    services.slice(0, 3).map((service, index) => (
                      <ServiceCard key={service.id} service={service} index={index} />
                    ))
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="card-surface p-6 lg:p-8">
                  {/* Rating Summary */}
                  <div className="flex flex-col sm:flex-row gap-8 mb-8">
                    <div className="text-center sm:text-left">
                      <div className="text-5xl font-bold text-navy">{freelancer.rating}</div>
                      <StarRating rating={freelancer.rating} size={24} className="mt-2 justify-center sm:justify-start" />
                      <p className="text-sm text-gray-500 mt-1">{freelancer.orders} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ratingBreakdown.map(item => {
                        const total = ratingBreakdown.reduce((a, b) => a + b.count, 0);
                        const pct = (item.count / total) * 100;
                        return (
                          <div key={item.stars} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-8">{item.stars} ★</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-8 text-right">{item.count}</span>
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
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="card-surface p-6 lg:p-8">
                    <h3 className="font-heading font-bold text-lg text-navy mb-4">About Me</h3>
                    <div className="text-gray-600 leading-relaxed space-y-4">
                      <p>{freelancer.bio}</p>
                    </div>
                  </div>

                  <div className="card-surface p-6 lg:p-8">
                    <h3 className="font-heading font-bold text-lg text-navy mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills?.map(skill => (
                        <span
                          key={skill}
                          className="px-4 py-2 border border-brand/30 text-brand text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-surface p-6 lg:p-8">
                    <h3 className="font-heading font-bold text-lg text-navy mb-4">Languages</h3>
                    <div className="space-y-3">
                      {freelancer.languages?.map(lang => (
                        <div key={lang.name} className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm text-gray-700">{lang.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-surface p-6 lg:p-8">
                    <h3 className="font-heading font-bold text-lg text-navy mb-4">Experience</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-brand shrink-0 mt-1.5" />
                        <div>
                          <p className="font-medium text-navy text-sm">Senior Brand Designer — Freelance</p>
                          <p className="text-xs text-gray-400">2022 - Present</p>
                          <p className="text-sm text-gray-500 mt-1">Working with clients globally through WorkPi Serv and other platforms</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-brand shrink-0 mt-1.5" />
                        <div>
                          <p className="font-medium text-navy text-sm">Graphic Designer — Creative Agency Casablanca</p>
                          <p className="text-xs text-gray-400">2020 - 2022</p>
                          <p className="text-sm text-gray-500 mt-1">Led brand design projects for 50+ clients</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                        <div>
                          <p className="font-medium text-navy text-sm">Bachelor of Fine Arts — Design</p>
                          <p className="text-xs text-gray-400">Universite Hassan II, Casablanca — 2016-2020</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl">
                  <div className="card-surface p-6 lg:p-8">
                    <h3 className="font-heading font-bold text-lg text-navy mb-6">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                        <input
                          type="text"
                          defaultValue={freelancer.name}
                          className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Title</label>
                        <input
                          type="text"
                          defaultValue={freelancer.title}
                          className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                        <textarea
                          defaultValue={freelancer.bio}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                        <input
                          type="text"
                          defaultValue={freelancer.location}
                          className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-navy mt-8 mb-6 pt-6 border-t border-gray-200">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Email notifications for new orders', default: true },
                        { label: 'Email notifications for messages', default: true },
                        { label: 'Order status updates', default: true },
                        { label: 'Marketing emails', default: false },
                        { label: 'Browser notifications', default: true },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" />
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <button className="btn-primary w-full py-3">Save Changes</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
