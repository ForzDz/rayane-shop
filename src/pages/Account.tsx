/**
 * Account dashboard: shows current user email and a logout button.
 * Protected by ProtectedRoute in App.
 */
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const Account = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-lg mx-auto rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">حسابي</h1>
            <p className="text-sm text-muted-foreground">لوحة التحكم</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">البريد الإلكتروني</p>
            <p className="text-foreground font-medium">{user?.email ?? "—"}</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
};

export default Account;
