import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { featuredServices } from '@/data/services';
import { useLanguage } from '@/i18n';

export function FeaturedServices() {
  const { t } = useLanguage();
  return (
    <section className="py-16 lg:py-24">
      <div className="section-container">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-navy">
              {t('home.featured')}
            </h2>
            <Link
              to="/marketplace"
              className="text-sm font-medium text-brand hover:underline flex items-center gap-1"
            >
              {t('home.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
