'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDate, getDaysUntilRenewal, isUrgentRenewal } from '@/lib/utils';
import { MobileMenuButton } from './Sidebar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMobileMenuClick?: () => void;
}

type UpcomingRenewal = {
  _id: string;
  name: string;
  renewalDate: string;
  amount?: number;
  currency?: string;
  isTrial?: boolean;
};

export default function Header({ title, subtitle, onMobileMenuClick }: HeaderProps) {
  const { getToken, isSignedIn } = useAuth();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<UpcomingRenewal[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) {
      setNotifications([]);
      return;
    }
    try {
      setNotifLoading(true);
      setNotifError(null);
      const token = await getToken?.();
      if (!token) {
        setNotifications([]);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/alerts/upcoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to load notifications');
      }
      setNotifications(Array.isArray(data.subscriptions) ? data.subscriptions : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load notifications';
      setNotifError(message);
    } finally {
      setNotifLoading(false);
    }
  }, [API_BASE_URL, getToken, isSignedIn]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!notifOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  return (
    <header className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a] h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMobileMenuClick && (
          <MobileMenuButton onClick={onMobileMenuClick} />
        )}
        
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="SubSentry Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] focus-within:border-blue-500/50 transition-colors">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-48"
            ref={searchRef}
            aria-label="Search subscriptions"
          />
          <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-500 bg-[#2a2a2a] rounded">
            Ctrl + K
          </kbd>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] px-1 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border border-[#1a1a1a] bg-[#0f0f0f] shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Renewal Alerts</p>
                  <p className="text-xs text-gray-500">Updated just now</p>
                </div>
                <Link
                  href="/renewals"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  View all
                </Link>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {notifLoading ? (
                  <div className="px-4 py-4 text-sm text-gray-400">
                    Loading alerts...
                  </div>
                ) : notifError ? (
                  <div className="px-4 py-4 text-sm text-red-300">
                    {notifError}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-gray-400">
                    No upcoming renewals.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((item) => {
                    const days = getDaysUntilRenewal(item.renewalDate);
                    const urgent = isUrgentRenewal(item.renewalDate);
                    return (
                      <div
                        key={item._id}
                        className="px-4 py-3 border-b border-[#1a1a1a] last:border-b-0 hover:bg-[#141414]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.renewalDate)} · {days < 0 ? 'Overdue' : `in ${days}d`}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              urgent ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-gray-300'
                            }`}
                          >
                            {urgent ? 'Urgent' : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Button */}
        <div className="pl-2 md:pl-4 border-l border-[#2a2a2a]">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 md:w-9 md:h-9',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
