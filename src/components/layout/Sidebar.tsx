
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, CreditCard, DollarSign, GraduationCap, Settings, Users } from 'lucide-react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navigationItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: BarChart3 
  },
  { 
    name: 'Finance', 
    path: '/finance', 
    icon: DollarSign 
  },
  { 
    name: 'Students', 
    path: '/students', 
    icon: GraduationCap 
  },
  { 
    name: 'Staff', 
    path: '/staff', 
    icon: Users 
  },
  { 
    name: 'Classes', 
    path: '/classes', 
    icon: BookOpen 
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-center">
        <div className="flex items-center gap-2 p-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg">SchoolFlow</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200",
                        {
                          "bg-primary text-primary-foreground": isActive,
                          "hover:bg-accent": !isActive
                        }
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-xs text-center text-muted-foreground">
        SchoolFlow Management v1.0
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
