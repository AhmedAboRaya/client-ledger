import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard, Users, UserPlus, DollarSign, CreditCard, Settings, LogOut,
  Sun, Moon, Menu, X, ChevronRight, Loader2
} from 'lucide-react';
import { useState } from 'react';
import { ROLE_LABELS } from '@/types';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Clients', path: '/clients', icon: <Users className="w-5 h-5" /> },
  { label: 'Add Client', path: '/clients/new', icon: <UserPlus className="w-5 h-5" />, permission: 'manage_clients' },
  { label: 'Add Debt', path: '/debts/new', icon: <DollarSign className="w-5 h-5" />, permission: 'add_debt' },
  { label: 'Add Payment', path: '/payments/new', icon: <CreditCard className="w-5 h-5" />, permission: 'add_payment' },
  { label: 'Users', path: '/users', icon: <Settings className="w-5 h-5" />, permission: 'manage_users' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, hasPermission, isLoadingGlobalData } = useApp();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNav = navItems.filter(item => !item.permission || hasPermission(item.permission));

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-primary-foreground flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-sidebar-primary" />
            <span className="text-sidebar-foreground">PayTracker</span>
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNav.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-semibold text-sm">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser?.name}</p>
              <p className="text-xs text-sidebar-muted">{ROLE_LABELS[currentUser?.role || 'viewer']}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border p-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">PayTracker</h1>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {isLoadingGlobalData ? (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-muted-foreground animate-fade-in">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading application data...</p>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
