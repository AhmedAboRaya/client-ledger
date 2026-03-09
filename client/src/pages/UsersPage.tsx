import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ROLE_LABELS, UserRole } from '@/types';
import { Plus, Trash2, Shield, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const { users, currentUser, addUser, deleteUser, hasPermission } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');

  const canCreateAdmin = hasPermission('create_admin');
  const availableRoles: UserRole[] = canCreateAdmin
    ? ['super_admin', 'admin', 'accounts', 'collector', 'viewer']
    : ['accounts', 'collector', 'viewer'];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await addUser({ name: name.trim(), email: email.trim(), password, role, clientAccess: 'all' });
      toast.success('User added successfully');
      setOpen(false);
      setName(''); setEmail(''); setPassword(''); setRole('viewer');
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Users Management"
        description={`${users.length} registered users`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Create User</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-3">
        {users.map(user => (
          <div key={user.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                <Shield className="w-3 h-3" />
                {ROLE_LABELS[user.role]}
              </span>

              {/* Copy Button */}

              <Copy
                onClick={() => {
                  const text = `name: ${user.name}\nemail: ${user.email}\npassword: ${user.password || ''}\nrole: ${user.role}`;
                  navigator.clipboard.writeText(text)
                    .then(() => toast.success('User data copied!'))
                    .catch(() => toast.error('Failed to copy'));
                }} className="w-4 h-4 mr-1 cursor-pointer hover:text-primary " />

              {user.id !== currentUser?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      await deleteUser(user.id);
                      toast.success('User deleted');
                    } catch (err) { }
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
