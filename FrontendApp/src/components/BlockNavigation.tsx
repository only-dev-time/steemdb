
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockNavigationProps {
  blockNumber: number;
  onPrevious: () => void;
  onNext: () => void;
}

const BlockNavigation = ({ blockNumber, onPrevious, onNext }: BlockNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link to="/blocks">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blocks
        </Button>
      </Link>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={blockNumber <= 1}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default BlockNavigation;
