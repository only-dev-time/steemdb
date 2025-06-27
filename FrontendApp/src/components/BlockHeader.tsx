
interface BlockHeaderProps {
  blockNumber: number;
}

const BlockHeader = ({ blockNumber }: BlockHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Block #{blockNumber.toLocaleString()}</h1>
      <p className="text-muted-foreground">Detailed information about this block on the STEEM blockchain</p>
    </div>
  );
};

export default BlockHeader;
