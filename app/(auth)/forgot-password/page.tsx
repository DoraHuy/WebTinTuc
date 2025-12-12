'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'identify' | 'verify' | 'reset'>('identify');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const identifier = email || phone;
      if (!identifier) {
        setError('Vui lòng nhập email hoặc số điện thoại');
        return;
      }

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email || undefined,
          SDT: phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Tài khoản không tồn tại');
        return;
      }

      setUserEmail(data.email);
      setSuccess(`Mã xác nhận đã được gửi đến email: ${data.email}`);
      setStep('verify');
    } catch (err) {
      setError('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!verifyCode.trim()) {
        setError('Vui lòng nhập mã xác nhận');
        return;
      }

      const res = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          code: verifyCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Mã xác nhận không đúng hoặc đã hết hạn');
        return;
      }

      setSuccess('Mã xác nhận hợp lệ, vui lòng tạo mật khẩu mới');
      setStep('reset');
    } catch (err) {
      setError('Lỗi xác nhận, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setError('Vui lòng nhập mật khẩu');
        return;
      }

      if (newPassword.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Mật khẩu không khớp');
        return;
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          code: verifyCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Lỗi khi đặt lại mật khẩu');
        return;
      }

      setSuccess('Đặt lại mật khẩu thành công! Đang chuyển hướng...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Quên Mật Khẩu?</h1>
            <p className="text-muted-foreground">
              {step === 'identify' && 'Nhập email hoặc SDT để nhận mã xác nhận'}
              {step === 'verify' && 'Nhập mã xác nhận từ email'}
              {step === 'reset' && 'Tạo mật khẩu mới'}
            </p>
          </div>

          {/* Step 1: Identify */}
          {step === 'identify' && (
            <form onSubmit={handleIdentify} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setPhone('');
                      setError('');
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="relative flex items-center gap-2">
                <div className="flex-1 border-t"></div>
                <span className="text-xs text-muted-foreground px-2">HOẶC</span>
                <div className="flex-1 border-t"></div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Số Điện Thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="0123456789"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setEmail('');
                      setError('');
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Gửi Mã Xác Nhận
              </Button>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mã Xác Nhận</label>
                <p className="text-xs text-muted-foreground">
                  Kiểm tra email của bạn để lấy mã xác nhận (6 chữ số)
                </p>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => {
                    setVerifyCode(e.target.value);
                    setError('');
                  }}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStep('identify');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Quay Lại
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Xác Nhận
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mật Khẩu Mới</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Xác Nhận Mật Khẩu</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Đặt Lại Mật Khẩu
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Nhớ mật khẩu rồi?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Đăng Nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
