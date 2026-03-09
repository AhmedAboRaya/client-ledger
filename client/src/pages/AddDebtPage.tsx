import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AddDebtPage() {
  const { addDebt, getAccessibleClients } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clients = getAccessibleClients();

  const [clientId, setClientId] = useState(searchParams.get('client') || '');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!clientId || !amt || amt <= 0 || !reason.trim()) {
      toast.error('Please fill in all fields with valid values');
      return;
    }
    try {
      await addDebt({ clientId, amount: amt, reason: reason.trim() });
      toast.success('Debt added successfully');
      navigate(`/clients/${clientId}`);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <PageHeader title="Add Debt" description="Record a new debt for a client" />
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (EGP)</Label>
            <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the debt reason" required />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Debt</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
