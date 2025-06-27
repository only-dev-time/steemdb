
import { Globe, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Blaze Scanner</h1>
                <p className="text-xs text-muted-foreground">STEEM Blockchain Explorer</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              A modern, fast, and feature-rich explorer for the STEEM blockchain.
            </p>
          </div>

          {/* Our Apps */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Our Apps</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blaze Scanner</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blazer Hub</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/blazeapps007" target="_blank" rel="noopener noreferrer" aria-label="Github" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-6 h-6" /></a>
              <a href="https://steemit.com/@blaze.apps" target="_blank" rel="noopener noreferrer" aria-label="Steemit" className="text-muted-foreground hover:text-primary transition-colors">
                <img src="/steemit.svg" alt="Steemit" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Blaze Scanner. All rights reserved. Built for the STEEM community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
