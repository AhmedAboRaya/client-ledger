import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAYMENT_METHOD_LABELS, Payment } from '@/types';
import { toast } from 'sonner';

export default function AddPaymentPage() {
  const { addPayment, getAccessibleClients } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clients = getAccessibleClients();

  const [clientId, setClientId] = useState(searchParams.get('client') || '');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Payment['method']>('cash');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!clientId || !amt || amt <= 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }
    try {
      await addPayment({ clientId, amount: amt, method });
      toast.success('Payment recorded successfully');
      navigate(`/clients/${clientId}`);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <PageHeader title="Add Payment" description="Record a payment from a client" />
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name} (EGP {c.totalDebt.toLocaleString()})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (EGP)</Label>
            <Input 
              id="amount" 
              type="number" 
              min="0.01" 
              max={clients.find(c => c.id === clientId)?.totalDebt || undefined}
              step="0.01" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="0.00" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={v => setMethod(v as Payment['method'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Record Payment</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
