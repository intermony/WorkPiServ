import { Shield, Globe, Zap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n';

const platformLinks = [
  { label: 'market.title', href: '/marketplace' },
  { label: 'home.howTitle', href: '/help' },
  { label: 'footer.escrowSystem', href: '/safety' },
  { label: 'footer.pricing', href: '/help' },
];

const supportLinks = [
  { label: 'footer.helpCenter', href: '/help' },
  { label: 'footer.safetyTrust', href: '/safety' },
  { label: 'footer.reportIssue', href: '/report' },
  { label: 'footer.contactUs', href: '/contact' },
];

const communityLinks = [
  { label: 'footer.aboutUs', href: '/about' },
  { label: 'footer.blog', href: '/blog' },
  { label: 'footer.becomeFreelancer', href: '/create-service' },
  { label: 'footer.affiliate', href: '/affiliate' },
  // ── Whitepaper ── ouvre dans un nouvel onglet (fichier statique dans /public)
  { label: 'footer.whitepaper', href: '/WorkPiServ_Whitepaper_v1.2.html', external: true },
];

export function Footer() {
  const { t, lang } = useLanguage();
  const trustLinks: Record<string, { href: string; label: string }> = {
    en: { href: '/trust.html', label: 'Transparency' },
    fr: { href: '/trust-fr.html', label: 'Transparence' },
    ar: { href: '/trust-ar.html', label: 'الشفافية' },
    zh: { href: '/trust-zh.html', label: '透明度' },
    vi: { href: '/trust-vi.html', label: 'Minh bạch' },
  };
  const trustLink = trustLinks[lang] ?? trustLinks.en;
  // Livre blanc : version FR pour le français, version EN pour les autres langues
  const whitepaperHref = lang === 'fr' ? '/WorkPiServ_Whitepaper_v1.2.html' : '/WorkPiServ_Whitepaper_v1.2-en.html';
  const navigate = useNavigate();

  return (
    <footer className="bg-[#F1F5F9] text-[#0F172A] border-t border-[#E2E8F0]">
      <div className="section-container py-16 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">Pi</span>
              </div>
              <span className="font-heading font-bold text-lg text-navy">
                WorkPiServ
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Shield size={16} className="text-muted-foreground" />
              <Globe size={16} className="text-muted-foreground" />
              <Zap size={16} className="text-muted-foreground" />
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors text-left"
                  >
                    {t(link.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors text-left"
                  >
                    {t(link.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy mb-4">{t('footer.community')}</h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  {'external' in link && link.external ? (
                    // Whitepaper → nouvel onglet
                    <a
                      href={link.label === 'footer.whitepaper' ? whitepaperHref : link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors"
                    >
                      <FileText size={13} className="shrink-0 text-brand" />
                      {t(link.label)}
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-sm text-muted-foreground hover:text-brand transition-colors text-left"
                    >
                      {t(link.label)}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 WorkPiServ. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <button
              onClick={() => navigate('/privacy')}
              className="text-sm text-muted-foreground hover:text-brand transition-colors py-1"
            >
              {t('footer.privacy')}
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="text-sm text-muted-foreground hover:text-brand transition-colors py-1"
            >
              {t('footer.terms')}
            </button>
            <button
              onClick={() => navigate('/cookies')}
              className="text-sm text-muted-foreground hover:text-brand transition-colors py-1"
            >
              {t('footer.cookies')}
            </button>
            {/* Page de transparence — un fichier statique par langue dans /public */}
            <a
              href={trustLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-brand transition-colors py-1"
            >
              <Shield size={13} />
              {trustLink.label}
            </a>
            {/* Whitepaper dans le bottom bar */}
            <a
              href={whitepaperHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-brand hover:text-brand-hover transition-colors py-1 font-medium"
            >
              <FileText size={13} />
              Whitepaper
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
