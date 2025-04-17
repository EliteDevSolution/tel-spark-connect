
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Phone, MessageSquare, UserCircle2, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const [expanded, setExpanded] = React.useState(true);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const menuItems = [
    { path: '/', icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/calls', icon: <Phone className="h-5 w-5" />, label: 'Calls' },
    { path: '/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
    { path: '/contacts', icon: <UserCircle2 className="h-5 w-5" />, label: 'Contacts' },
    { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  if (isMobile && !expanded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={cn(
      "bg-sidebar relative flex flex-col border-r border-border transition-all duration-300",
      expanded ? "w-64" : "w-16",
      isMobile && expanded ? "fixed inset-y-0 left-0 z-50" : ""
    )}>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
      
      <div className="p-4 flex justify-center items-center h-16 border-b border-border">
        <div className={cn("flex items-center", expanded ? "justify-start" : "justify-center")}>
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-telynx-500 text-white rounded-md p-1">
              <Phone className="h-6 w-6" />
            </div>
            {expanded && (
              <span className="ml-2 text-xl font-semibold text-telynx-700">Telynx</span>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-telynx-100 text-telynx-700"
                    : "text-gray-700 hover:bg-telynx-50 hover:text-telynx-700",
                  !expanded && "justify-center"
                )}
              >
                {item.icon}
                {expanded && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center",
          expanded ? "justify-start" : "justify-center"
        )}>
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-telynx-200 flex items-center justify-center text-telynx-700 font-medium">
              TU
            </div>
            <span className="status-indicator status-online absolute bottom-0 right-0 border-2 border-white"></span>
          </div>
          {expanded && (
            <div className="ml-3">
              <p className="text-sm font-medium">Telynx User</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
