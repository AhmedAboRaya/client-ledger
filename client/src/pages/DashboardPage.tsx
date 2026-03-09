import { useApp } from '@/context/AppContext';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { Users, DollarSign, CreditCard, Activity } from 'lucide-react';
import { ROLE_LABELS, PAYMENT_METHOD_LABELS } from '@/types';

export default function DashboardPage() {
  const { getAccessibleClients, activityLogs, getUserById } = useApp();
  const clients = getAccessibleClients();

  const totalDebt = clients.reduce((sum, c) => sum + (c.totalDebt || 0), 0);
  const totalPayments = 0; // Note: Global payments require a new backend endpoint
  const recentLogs = [...activityLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  console.log(clients);
  function formatDate(date?: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" description="Overview of your payment tracking system" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Clients" value={clients.length} icon={<Users className="w-5 h-5" />} variant="primary" />
        <StatCard title="Total Debt" value={`EGP ${totalDebt.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="destructive" />
        {/* <StatCard title="Total Payments" value={`EGP ${totalPayments.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} variant="success" /> */}
        <StatCard title="Activities" value={activityLogs.length} icon={<Activity className="w-5 h-5" />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Debtors */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Debtors</h2>
          <div className="space-y-3">
            {clients
              .filter(c => c.totalDebt > 0)
              .sort((a, b) => b.totalDebt - a.totalDebt)
              .slice(0, 5)
              .map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  </div>
                  <span className="text-sm font-semibold text-destructive">EGP {client.totalDebt.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentLogs
              .slice(-10) // ياخد آخر 10 عناصر
              .reverse() // لو عايز الأحدث يظهر فوق
              .map(log => {
                const user = getUserById(log.userId);
                return (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{user?.name}</span> {log.action}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{formatDate(log.date)}</span>
                        {log.amount && <span>• EGP {log.amount.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
