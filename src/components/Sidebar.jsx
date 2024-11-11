'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Calendar,
  Wrench,
  LayoutDashboard,
  Store,
  HomeIcon,
  ChartIcon,
  UsersIcon,
  SettingsIcon
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Jobs', href: '/jobs', icon: FileText },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Mechanics', href: '/mechanics', icon: Wrench },
  { name: 'Shop Profile', href: '/shop/profile', icon: Store },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <div>
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'sidebar-link',
                  isActive && 'active'
                )}
              >
                <div className="sidebar-icon-container">
                  <item.icon className="sidebar-icon" />
                </div>
                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}