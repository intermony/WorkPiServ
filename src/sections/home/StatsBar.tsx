import CountUp from 'react-countup';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

// WorkPiServ stats - updated as platform grows
const stats = [
  { value: 120, suffix: '+', label: 'Services Available' },
  { value: 85, suffix: '+', label: 'Active Freelancers' },
  { value: 200, suffix: '+', label: 'Pi Transactions Secured' },
];

export function StatsBar() {
  return (
    <section className="py-6">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="card-surface p-6 text-center">
                <div className="text-3xl font-bold text-brand font-heading">
                  <CountUp end={stat.value} duration={1.5} separator="," suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-sm text-gray-500 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
