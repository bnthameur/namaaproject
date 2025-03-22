
import React from 'react';
import logo from "@/assets/logo.png";
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, DollarSign, GraduationCap, Settings, Users } from 'lucide-react';
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
    name: 'لوحة التحكم', 
    path: '/', 
    icon: BarChart3 
  },
  { 
    name: 'المالية', 
    path: '/finance', 
    icon: DollarSign 
  },
  { 
    name: 'الطلاب', 
    path: '/students', 
    icon: GraduationCap 
  },
  { 
    name: 'المعلمات', 
    path: '/staff', 
    icon: Users 
  },
  { 
    name: 'الإعدادات', 
    path: '/settings', 
    icon: Settings 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarComponent side="right">
      <SidebarHeader className="flex items-center justify-center">
        <div className="flex items-center gap-2 p-2">
        <img src={logo} alt="Logo" className="p-5" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
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
       مركز نماء - الإصدار 1.0
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
