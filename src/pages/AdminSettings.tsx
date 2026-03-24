import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlugZap } from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabaseHealth";

export const AdminSettings = () => {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; error?: string } | null>(null);

  const runCheck = async () => {
    setChecking(true);
    const res = await checkSupabaseConnection();
    setStatus(res);
    setChecking(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">الإعدادات</h1>
        <p className="text-sm text-muted-foreground">
          فحص اتصال Supabase وبيانات البيئة.
        </p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <PlugZap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Supabase Connection Test</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={runCheck} disabled={checking}>
            {checking && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
            إعادة الفحص
          </Button>
        </div>

        {!status ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : status.ok ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm text-emerald-800">✅ الاتصال بـ Supabase يعمل بشكل صحيح.</p>
          </div>
        ) : (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">
              ❌ فشل الاتصال بـ Supabase: {status.error}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminSettings;

