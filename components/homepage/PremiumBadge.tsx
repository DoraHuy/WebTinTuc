import { Crown, Lock } from 'lucide-react';

interface PremiumBadgeProps {
  type?: 'paid' | 'rewrite';
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ type = 'paid', size = 'md' }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full font-semibold shadow-lg ${sizeClasses[size]}`}
    >
      <Crown className={`${iconSize[size]} fill-white`} />
      <span>PREMIUM</span>
    </div>
  );
}

interface PremiumOverlayProps {
  onUnlock?: () => void;
}

export function PremiumOverlay({ onUnlock }: PremiumOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center p-6 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Nội dung Premium</h3>
        <p className="text-muted-foreground mb-4">
          Bài viết này yêu cầu đăng ký Premium để xem toàn bộ nội dung
        </p>
        <div className="space-y-2">
          <button
            onClick={onUnlock}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Mở khóa với Premium
          </button>
          <p className="text-sm text-muted-foreground">
            hoặc <span className="text-primary font-medium cursor-pointer hover:underline">viết lại 2 bài</span> để mở khóa
          </p>
        </div>
      </div>
    </div>
  );
}
