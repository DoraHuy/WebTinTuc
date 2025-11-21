import React from 'react';
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
  onUnlock?: (password: string) => void;
}

export function PremiumOverlay({ onUnlock }: PremiumOverlayProps) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === 'HUANDZ') {
      setError('');
      if (onUnlock) onUnlock(password);
    } else {
      setError('Mật khẩu không đúng!');
    }
  };

  const handlePayment = () => {
    alert('Chức năng thanh toán đang được phát triển!');
  };

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="text-center p-8 max-w-md w-full mx-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Nội dung Premium</h3>
        <p className="text-muted-foreground mb-6">
          Bài viết này yêu cầu đăng ký Premium hoặc viết lại 2 bài để xem toàn bộ nội dung
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            💳 Thanh toán để mở khóa
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">
                ✍️ Nhập mã xác nhận (đã viết lại 2 bài)
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Nhập mã..."
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
            >
              Xác nhận mở khóa
            </button>
          </form>

          <p className="text-xs text-muted-foreground">
            Nhập mã xác nhận bạn nhận được sau khi viết lại 2 bài viết
          </p>
        </div>
      </div>
    </div>
  );
}
