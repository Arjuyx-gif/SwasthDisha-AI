'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Leaf, Archive, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';

export const Nav = () => {
  const pathname = usePathname();
  const { t } = useStore();

  const links = [
    { href: '/',          icon: Home,            label: 'Home' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/nutrition', icon: Leaf,            label: 'Poshan Lab' },
    { href: '/vitals',    icon: Archive,         label: 'Vault' },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 bg-[#0d1117]/95 backdrop-blur-xl border border-[#1a2030] rounded shadow-2xl shadow-black/60">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link key={link.href} href={link.href}>
            <div className={`relative flex items-center gap-2 px-4 py-2 rounded transition-all duration-200
              ${isActive
                ? 'text-white bg-[#f97c0a]/15 border border-[#f97c0a]/30'
                : 'text-[#5a677d] hover:text-[#8a97aa] hover:bg-[#1a2030]/60 border border-transparent'
              }`}
            >
              <link.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#f97c0a]' : ''}`} />
              <AnimatedLabel show={isActive} label={link.label} />
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#f97c0a] rounded-full"
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

function AnimatedLabel({ show, label }: { show: boolean; label: string }) {
  if (!show) return null;
  return (
    <motion.span
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-white"
    >
      {label}
    </motion.span>
  );
}
