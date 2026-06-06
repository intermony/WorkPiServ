import { Link } from 'react-router-dom';
import { Clock, Shield } from 'lucide-react';
import type { Service } from '@/types';
import { StarRating } from './StarRating';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0, 0, 0.2, 1] }}
    >
      <Link to={`/service/${service.id}`} className="block group">
        <div className="card-surface-hover overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Escrow badge */}
            {service.escrow && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-escrow-light text-escrow text-xs font-medium px-2.5 py-1 rounded-full">
                <Shield size={12} />
                Escrow
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {service.category}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-navy line-clamp-2 group-hover:text-brand transition-colors duration-200">
              {service.title}
            </h3>

            {/* Freelancer */}
            <div className="flex items-center gap-2 mt-3">
              <img
                src={service.freelancer.avatar}
                alt={service.freelancer.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600 font-medium">{service.freelancer.name}</span>
              {service.freelancer.verified && (
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="mt-2">
              <StarRating rating={service.rating} size={14} showValue reviewCount={service.reviewCount} />
            </div>

            {/* Price & Delivery */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-brand font-bold text-lg">π {service.price}</span>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock size={12} />
                <span>{service.deliveryDays} days</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
