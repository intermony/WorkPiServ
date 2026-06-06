import { Search, ShoppingCart, Package, CheckCircle } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const steps = [
  { number: '1', icon: Search, title: 'Browse', description: 'Explore thousands of services from talented freelancers across multiple categories.' },
  { number: '2', icon: ShoppingCart, title: 'Order', description: 'Select your service, choose a package, and pay securely using Pi cryptocurrency.' },
  { number: '3', icon: Package, title: 'Deliver', description: 'Your freelancer works on your project with milestone tracking and regular updates.' },
  { number: '4', icon: CheckCircle, title: 'Release', description: 'Review the completed work and release payment from escrow when satisfied.' },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="section-container">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-navy">
              How It Works
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              Get your project done in 4 simple steps with Pi-powered security
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-gray-200" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.number} delay={index * 0.12}>
                <div className="text-center relative">
                  {/* Number */}
                  <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mx-auto relative z-10">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  {/* Icon */}
                  <div className="mt-4">
                    <Icon size={28} className="text-brand mx-auto" />
                  </div>
                  <h3 className="mt-4 font-semibold text-navy text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-[240px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
