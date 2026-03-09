import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AddClientPage() {
  const { addClient } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await addClient({ name: name.trim(), phone: phone.trim() });
      toast.success('Client added successfully');
      navigate('/clients');
    } catch (err) {
      // Error is already shown in AppContext
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <PageHeader title="Add Client" description="Register a new client in the system" />
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter client name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+20 100 123 4567" required />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/clients')} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Client</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
