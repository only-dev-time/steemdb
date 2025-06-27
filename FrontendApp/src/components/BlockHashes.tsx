
import { Card } from '@/components/ui/card';

interface BlockHashesProps {
  blockId: string;
  previous: string;
}

const BlockHashes = ({ blockId, previous }: BlockHashesProps) => {
  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Block Hashes</h2>
      <div className="space-y-4">
        <div>
          <span className="text-muted-foreground block mb-1">Block ID:</span>
          <span className="text-foreground font-mono text-sm break-all">{blockId}</span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Previous Hash:</span>
          <span className="text-foreground font-mono text-sm break-all">{previous}</span>
        </div>
      </div>
    </Card>
  );
};

export default BlockHashes;
