import { Link } from "react-router-dom";
import { Phone, LogIn, User, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export const Header = () => {
  const { user, loading, signOut, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-900 text-slate-100">
        <div className="container mx-auto px-4 py-1.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:+213556482798" className="flex items-center gap-2 hover:text-[#0ea5e9] transition-colors" aria-label="Call us at 0556482798">
                <Phone className="h-3.5 w-3.5" />
                <span>0556482798</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm font-medium">🚚 التوصيل في 58 ولاية</span>
              <span className="hidden md:inline text-xs font-medium text-green-400">✓ الدفع عند الاستلام</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Desktop Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-[#0ea5e9] transition-colors">
              الرئيسية
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-[#0ea5e9] transition-colors">
              اتصل بنا
            </Link>
            {!loading && (
              user ? (
                <>
                  <Link to="/account" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#0ea5e9] transition-colors">
                    <User className="h-4 w-4" />
                    حسابي
                  </Link>
                  <Link to="/orders" className="text-sm font-medium text-gray-700 hover:text-[#0ea5e9] transition-colors">
                    طلباتي
                  </Link>
                  {(role === "admin" || role === "staff") && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#0ea5e9] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0ea5e9] transition-colors"
                    aria-label="تسجيل الخروج"
                  >
                    <LogOut className="h-4 w-4" />
                    خروج
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#0ea5e9] transition-colors">
                  <LogIn className="h-4 w-4" />
                  تسجيل الدخول
                </Link>
              )
            )}
          </div>

          {/* Mobile Actions (Visible on Mobile) */}
          <div className="flex md:hidden items-center">
             <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle Menu</span>
                   </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] max-w-[300px] bg-white pt-10 border-r-0 shadow-2xl" dir="rtl">
                   <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
                   <div className="flex flex-col gap-6 mt-6">
                     <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:text-[#0ea5e9] transition-colors">
                       الرئيسية
                     </Link>
                     <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:text-[#0ea5e9] transition-colors">
                       اتصل بنا
                     </Link>
                     <div className="h-px w-full bg-gray-100 my-2"></div>
                     {!loading && (
                       user ? (
                         <>
                           <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-gray-800 hover:text-[#0ea5e9] transition-colors">
                             <User className="h-5 w-5" />
                             حسابي
                           </Link>
                           <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-gray-800 hover:text-[#0ea5e9] transition-colors">
                             طلباتي
                           </Link>
                           {(role === "admin" || role === "staff") && (
                             <Link
                               to="/admin"
                               onClick={() => setIsOpen(false)}
                               className="flex items-center gap-3 text-lg font-medium text-[#0ea5e9] bg-blue-50 p-2 rounded-lg transition-colors mt-2"
                             >
                               <LayoutDashboard className="h-5 w-5" />
                               لوحة التحكم
                             </Link>
                           )}
                           <button
                             type="button"
                             onClick={() => { signOut(); setIsOpen(false); }}
                             className="flex items-center gap-3 text-lg font-medium text-red-500 hover:text-red-600 transition-colors pt-4 mt-auto border-t justify-start"
                           >
                             <LogOut className="h-5 w-5" />
                             تسجيل الخروج
                           </button>
                         </>
                       ) : (
                         <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-[#0ea5e9] bg-blue-50 p-3 rounded-lg mt-2">
                           <LogIn className="h-5 w-5" />
                           تسجيل الدخول
                         </Link>
                       )
                     )}
                   </div>
                </SheetContent>
             </Sheet>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Rayan Shop Home">
            <div className="text-2xl font-black text-[#0ea5e9] tracking-tight">
              Rayan<span className="text-gray-900">shop</span>
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
};