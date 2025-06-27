
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Edit, PenTool } from 'lucide-react';

interface AccountAuth {
  account: string;
  weight: number;
}

interface AccountAuths {
  owner: AccountAuth[];
  active: AccountAuth[];
  posting: AccountAuth[];
}

interface AccountData {
  account_auths: AccountAuths;
}

interface AccountAuthsProps {
  accountData: AccountData;
}

const AccountAuths = ({ accountData }: AccountAuthsProps) => {
  const { owner, active, posting } = accountData.account_auths;

  // Check if there are any authorities to display
  const hasAuthorities = owner.length > 0 || active.length > 0 || posting.length > 0;

  if (!hasAuthorities) {
    return null;
  }

  const authTypes = [
    { 
      name: 'Owner', 
      auths: owner, 
      icon: <Shield className="w-4 h-4" />, 
      color: 'text-red-500',
      description: 'Complete account control'
    },
    { 
      name: 'Active', 
      auths: active, 
      icon: <Edit className="w-4 h-4" />, 
      color: 'text-orange-500',
      description: 'Transfer and power operations'
    },
    { 
      name: 'Posting', 
      auths: posting, 
      icon: <PenTool className="w-4 h-4" />, 
      color: 'text-green-500',
      description: 'Content and social operations'
    }
  ];

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Account Authorities
      </h2>
      <div className="space-y-4">
        {authTypes.map(({ name, auths, icon, color, description }) => (
          auths.length > 0 && (
            <div key={name} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`${color}`}>{icon}</div>
                <span className={`font-medium ${color}`}>{name}</span>
                <span className="text-xs text-muted-foreground">({description})</span>
              </div>
              <div className="pl-6 space-y-2">
                {auths.map((auth, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono text-foreground">
                        @{auth.account}
                      </code>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Weight: {auth.weight}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </Card>
  );
};

export default AccountAuths;
