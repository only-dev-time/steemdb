
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface WitnessInfoProps {
  witness: string;
  witnessSignature: string;
}

const WitnessInfo = ({ witness, witnessSignature }: WitnessInfoProps) => {
  return (
    <Card className="glass-card p-6 mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Witness Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-muted-foreground block mb-1">Witness:</span>
          <Link to={`/account/${witness}`} className="text-steem-accent-blue hover:text-steem-purple-blue transition-colors">
            @{witness}
          </Link>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Witness Signature:</span>
          <span className="text-foreground font-mono text-sm break-all">{witnessSignature}</span>
        </div>
      </div>
    </Card>
  );
};

export default WitnessInfo;
