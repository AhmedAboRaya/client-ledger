import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PAYMENT_METHOD_LABELS, Debt, Payment } from '@/types';
import { DollarSign, CreditCard, ArrowLeft, Phone, Loader2 } from 'lucide-react';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getClientById, getClientDebts, getClientPayments, getUserById, hasPermission } = useApp();

  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const client = getClientById(id || '');
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
  useEffect(() => {
    if (client) {
      Promise.all([
        getClientDebts(client.id),
        getClientPayments(client.id)
      ]).then(([d, p]) => {
        setDebts(d);
        setPayments(p);
      }).catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [client?.id, getClientDebts, getClientPayments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <p>Loading client details...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Client not found</p>
        <Link to="/clients"><Button variant="outline" className="mt-4">Back to Clients</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to clients
      </Link>

      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className={`text-2xl font-bold ${client.totalDebt > 0 ? 'text-destructive' : 'text-success'}`}>
              EGP {client.totalDebt.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {hasPermission('add_debt') && (
            <Link to={`/debts/new?client=${client.id}`}><Button size="sm" variant="outline"><DollarSign className="w-4 h-4 mr-1" />Add Debt</Button></Link>
          )}
          {hasPermission('add_payment') && (
            <Link to={`/payments/new?client=${client.id}`}><Button size="sm"><CreditCard className="w-4 h-4 mr-1" />Add Payment</Button></Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debts */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-destructive" /> Debt History
          </h2>
          {debts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No debts recorded</p>
          ) : (
            <div className="space-y-3">
              {debts.map(debt => (
                <div key={debt.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-foreground">{debt.reason}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {debt.addedBy.name} • {formatDate(debt.date)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-destructive">+EGP {debt.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-success" /> Payment History
          </h2>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No payments recorded</p>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-foreground">{PAYMENT_METHOD_LABELS[payment.method]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {payment.receivedBy.name} • {formatDate(payment.date)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-success">-EGP {payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
