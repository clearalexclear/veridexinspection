import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/inspectra-icon.png';
import {
  ArrowLeft, Loader2, Shield, Users, Crown, User,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type UserRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, roleLoading } = useRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (!authLoading && !roleLoading && user && !isAdmin) navigate('/dashboard');
  }, [user, authLoading, roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchUsers();
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('admin_list_users');
    if (error) {
      console.error('Failed to fetch users:', error);
      toast({ title: 'Error', description: 'Could not load users.', variant: 'destructive' });
    }
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  };

  const toggleRole = async (targetUserId: string, currentRole: string) => {
    if (targetUserId === user?.id) {
      toast({ title: 'Cannot change own role', variant: 'destructive' });
      return;
    }

    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    setUpdating(targetUserId);

    try {
      const { data, error } = await supabase.functions.invoke('admin-update-role', {
        body: { targetUserId, newRole },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Role updated', description: `User is now ${newRole}.` });
      await fetchUsers();
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Inspectra" className="w-7 h-7" />
            <span className="font-semibold text-foreground text-sm">Inspectra</span>
            <Badge className="bg-primary/10 text-primary text-[10px]">Admin</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => {
              const isSelf = u.user_id === user?.id;
              return (
                <Card key={u.user_id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${u.role === 'admin' ? 'bg-primary/10' : 'bg-muted'}`}>
                        {u.role === 'admin' ? (
                          <Crown className="w-4 h-4 text-primary" />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {u.full_name || u.email}
                          {isSelf && <span className="text-muted-foreground ml-1">(you)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          u.role === 'admin'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }
                        variant="secondary"
                      >
                        {u.role}
                      </Badge>
                      {!isSelf && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updating === u.user_id}
                          onClick={() => toggleRole(u.user_id, u.role)}
                        >
                          {updating === u.user_id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : u.role === 'admin' ? (
                            'Demote to Client'
                          ) : (
                            'Promote to Admin'
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
