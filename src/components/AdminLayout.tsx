import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  ChevronLeft,
  MessageSquare,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { title: "لوحة التحكم", icon: LayoutDashboard, href: "/admin" },
    { title: "الطلبات", icon: ShoppingBag, href: "/admin/orders" },
    { title: "المنتجات", icon: Package, href: "/admin/products" },
    { title: "التقييمات", icon: MessageSquare, href: "/admin/reviews" },
    { title: "الرسائل", icon: Mail, href: "/admin/contacts" },
    { title: "الإعدادات", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-card rounded-2xl border p-6 min-h-[600px] shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
