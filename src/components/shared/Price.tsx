import { usePiPrice } from '@/hooks/usePiPrice';

interface PriceProps {
  /** Montant en Pi (unité de paiement réelle). */
  pi: number;
  /** Classes du chiffre principal en Pi (reprend ton style existant). */
  className?: string;
  /** Classes de la ligne USD (équivalent indicatif). */
  usdClassName?: string;
  /** Masquer l'équivalent USD si besoin. */
  showUsd?: boolean;
  /** Mettre Pi et USD côte à côte au lieu de l'un sous l'autre. */
  inline?: boolean;
}

/**
 * Affiche un prix en Pi avec son équivalent USD indicatif.
 *
 *   <Price pi={service.price} className="text-brand font-bold text-lg" />
 *
 * Le Pi reste l'unité de référence (c'est ce qui est réellement payé) ;
 * le USD n'est qu'un repère pour aider l'utilisateur à se situer malgré
 * la volatilité. Si le taux n'est pas disponible, seul le Pi s'affiche.
 */
export default function Price({
  pi,
  className = '',
  usdClassName = '',
  showUsd = true,
  inline = false,
}: PriceProps) {
  const { toUsd } = usePiPrice();
  const usd = toUsd(pi);

  const usdLabel =
    showUsd && usd != null ? (
      <span className={`text-muted-foreground font-normal ${usdClassName}`}>
        ≈ ${usd.toFixed(2)}
      </span>
    ) : null;

  if (inline) {
    return (
      <span className="inline-flex items-baseline gap-1.5">
        <span className={className}>π {pi}</span>
        {usdLabel && <span className="text-xs">{usdLabel}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col leading-tight">
      <span className={className}>π {pi}</span>
      {usdLabel && <span className="text-xs">{usdLabel}</span>}
    </span>
  );
}
