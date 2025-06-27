
import { Card } from '@/components/ui/card';
import { Key, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PublicKeys {
  owner: string;
  active: string;
  posting: string;
  memo: string;
}

interface AccountData {
  public_keys: PublicKeys;
}

interface AccountPublicKeysProps {
  accountData: AccountData;
}

const AccountPublicKeys = ({ accountData }: AccountPublicKeysProps) => {
  const copyToClipboard = (key: string, keyType: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast.success(`${keyType} key copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy key');
    });
  };

  const truncateKey = (key: string) => {
    return `${key.slice(0, 10)}...${key.slice(-10)}`;
  };

  const keyTypes = [
    { name: 'Owner', key: accountData.public_keys.owner, color: 'text-red-500' },
    { name: 'Active', key: accountData.public_keys.active, color: 'text-orange-500' },
    { name: 'Posting', key: accountData.public_keys.posting, color: 'text-green-500' },
    { name: 'Memo', key: accountData.public_keys.memo, color: 'text-blue-500' }
  ];

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
        <Key className="w-5 h-5 mr-2" />
        Public Keys
      </h2>
      <div className="space-y-3">
        {keyTypes.map(({ name, key, color }) => (
          <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`font-medium ${color}`}>{name}</span>
              </div>
              <code className="text-sm text-muted-foreground font-mono">
                {truncateKey(key)}
              </code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(key, name)}
              className="ml-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AccountPublicKeys;
