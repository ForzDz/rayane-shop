import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, MessageSquare, Trash2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContacts(data as Contact[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkReplied = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from("contacts")
      .update({ status: 'replied' })
      .eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ تم التحديث", description: "تم تحديد الرسالة كمقروءة/مُجاب عليها" });
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'replied' } : c)));
    }
    setActionLoading(null);
  };

  const handleMarkPending = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from("contacts")
      .update({ status: 'pending' })
      .eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تحديث", description: "تم تحديد الرسالة قيد الانتظار" });
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'pending' } : c)));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "🗑️ تم الحذف", description: "تم حذف الرسالة" });
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
    setActionLoading(null);
  };

  const filteredContacts = contacts.filter((c) => {
    if (filter === "pending") return c.status === "pending";
    if (filter === "replied") return c.status === "replied";
    return true;
  });

  const pendingCount = contacts.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">الرسائل (اتصل بنا)</h1>
          <p className="text-muted-foreground text-sm">
            إدارة الرسائل الواردة من العملاء عبر صفحة اتصل بنا.
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {pendingCount} رسالة جديدة
          </Badge>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "replied"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" && `الكل (${contacts.length})`}
            {tab === "pending" && `في الانتظار (${pendingCount})`}
            {tab === "replied" && `تم الرد (${contacts.filter((c) => c.status === "replied").length})`}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-24 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredContacts.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد رسائل في هذا القسم.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className={`p-4 transition-colors ${
                contact.status === "pending" ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm">{contact.name}</span>
                    <a href={`mailto:${contact.email}`} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="hidden sm:inline">{contact.email}</span>
                    </a>
                    <Badge variant={contact.status === "replied" ? "default" : "outline"} className="text-xs mr-auto">
                      {contact.status === "replied" ? "تم الرد" : "في الانتظار"}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-4 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(contact.created_at).toLocaleDateString("ar-DZ")} {new Date(contact.created_at).toLocaleTimeString("ar-DZ")}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-2 shrink-0 sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                  {contact.status === "pending" ? (
                    <Button
                      size="sm"
                      variant="default"
                      disabled={actionLoading === contact.id}
                      onClick={() => handleMarkReplied(contact.id)}
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      title="تحديد كتم الرد"
                    >
                      {actionLoading === contact.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 ml-2" />
                      )}
                      <span className="sm:hidden">تم الرد</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === contact.id}
                      onClick={() => handleMarkPending(contact.id)}
                      title="إعادة كقيد الانتظار"
                      className="w-full sm:w-auto"
                    >
                      {actionLoading === contact.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 ml-2" />
                      )}
                      <span className="sm:hidden">استرجاع</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={actionLoading === contact.id}
                    onClick={() => handleDelete(contact.id)}
                    title="حذف الرسالة"
                    className="w-full sm:w-auto"
                  >
                    {actionLoading === contact.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 ml-2" />
                    )}
                    <span className="sm:hidden">حذف</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
