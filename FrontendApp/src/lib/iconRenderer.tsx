
import { BarChart3, Eye, MessageCircle, Map, Users, Globe, Gamepad2 } from 'lucide-react';
import React from 'react';

export const renderIcon = (iconString: string): React.ReactNode => {
  // Extract the icon name from the string like "<BarChart3 className=\"w-6 h-6\" />"
  const iconMatch = iconString.match(/<(\w+)/);
  if (!iconMatch) return <Globe className="w-6 h-6" />;

  const iconName = iconMatch[1];
  
  switch (iconName) {
    case 'BarChart3':
      return <BarChart3 className="w-6 h-6" />;
    case 'Eye':
      return <Eye className="w-6 h-6" />;
    case 'MessageCircle':
      return <MessageCircle className="w-6 h-6" />;
    case 'Map':
      return <Map className="w-6 h-6" />;
    case 'Users':
      return <Users className="w-6 h-6" />;
    case 'Globe':
      return <Globe className="w-6 h-6" />;
    case 'Gamepad2':
      return <Gamepad2 className="w-6 h-6" />;
    default:
      return <Globe className="w-6 h-6" />;
  }
};
