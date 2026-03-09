import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, Plus, ChevronRight } from 'lucide-react';

export default function ClientsPage() {
  const { getAccessibleClients, hasPermission } = useApp();
  const [search, setSearch] = useState('');
  const clients = getAccessibleClients();

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Clients"
        description={`${clients.length} total clients`}
        actions={
          hasPermission('manage_clients') ? (
            <Link to="/clients/new">
              <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Client</Button>
            </Link>
          ) : undefined
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clients by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No clients found" description="Try a different search or add a new client." icon={<Users className="w-6 h-6 text-muted-foreground" />} />
      ) : (
        <div className="grid gap-3">
          {filtered.map(client => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${client.totalDebt > 0 ? 'text-destructive' : 'text-success'}`}>
                  EGP {client.totalDebt.toLocaleString()}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
