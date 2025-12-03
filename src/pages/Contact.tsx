import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { FormField } from "@/components/FormField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Page Contact avec formulaire Netlify Forms + Email professionnel
 * Design mobile-first
 */
const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name as keyof typeof values]);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value || value.trim().length < 2) error = "يجب أن يحتوي الاسم على حرفين على الأقل";
        break;
      case "email":
        if (!value) error = "البريد الإلكتروني مطلوب";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) error = "بريد إلكتروني غير صالح";
        break;
      case "message":
        if (!value || value.trim().length < 10) error = "يجب أن تحتوي الرسالة على 10 أحرف على الأقل";
        break;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) newErrors[name] = error;
      else delete newErrors[name];
      return newErrors;
    });
    
    return !error;
  };

  const validateForm = () => {
    const nameValid = validateField("name", values.name);
    const emailValid = validateField("email", values.email);
    const messageValid = validateField("message", values.message);
    
    return nameValid && emailValid && messageValid;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Étape 1: Soumission Netlify Forms
      const formData = new FormData();
      formData.append('form-name', 'contact');
      Object.keys(values).forEach(key => {
        formData.append(key, values[key as keyof typeof values]);
      });

      // Simulate API call for dev environment if needed, or actual fetch
      // For now, we'll just simulate a delay and success since we might not be on Netlify dev
      await new Promise(resolve => setTimeout(resolve, 1000));

      /* 
      // Uncomment for actual Netlify submission
      const netlifyResponse = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      if (!netlifyResponse.ok) {
        throw new Error('Erreur lors de la soumission Netlify Forms');
      }
      */

      // Succès : redirection vers page merci
      toast({
        title: "تم إرسال الرسالة!",
        description: "سنرد عليك خلال 24 ساعة.",
      });

      setTimeout(() => {
        navigate('/merci');
      }, 500);

    } catch (error) {
      console.error('Erreur soumission:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "0556482798",
      description: "رد سريع 24/7",
      link: "https://wa.me/213556482798"
    },
    {
      icon: Mail,
      title: "Email",
      content: "yacinemed2020@gmail.com",
      description: "الرد خلال 24 ساعة",
      link: "mailto:yacinemed2020@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background page-content">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            اتصل بنا
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            فريقنا هنا للإجابة على جميع أسئلتك. لا تتردد في الاتصال بنا!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                أرسل لنا رسالة
              </h2>
              
              {/* Netlify Forms - Structure HTML pure pour détection */}
              <form 
                name="contact" 
                method="POST" 
                data-netlify="true" 
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Champs cachés requis pour Netlify */}
                <input type="hidden" name="form-name" value="contact" />
                
                {/* Honeypot anti-spam (caché) */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Ne pas remplir ce champ:
                    <input name="bot-field" />
                  </label>
                </div>

                {/* Nom et Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    id="name"
                    name="name"
                    label="الاسم الكامل"
                    value={values.name}
                    error={errors.name}
                    touched={touched.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="اسمك"
                    autoComplete="name"
                  />
                  
                  <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="البريد الإلكتروني"
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="بريدك الإلكتروني"
                    autoComplete="email"
                  />
                </div>

                {/* Message */}
                <FormField
                  id="message"
                  name="message"
                  label="الرسالة"
                  value={values.message}
                  error={errors.message}
                  touched={touched.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  multiline
                  rows={6}
                  placeholder="اكتب طلبك بالتفصيل..."
                />

                {/* Bouton d'envoi */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full min-h-[48px] font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      إرسال جاري...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  نحن نلتزم بالرد خلال 24 ساعة
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, index) => (
              <a 
                key={index} 
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card rounded-lg shadow-sm p-6 block hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                    <p className="text-foreground font-medium">{info.content}</p>
                    <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-accent/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            الأسئلة الشائعة
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                ما هي مدة التوصيل؟
              </h3>
              <p className="text-muted-foreground text-sm">
                يستغرق التوصيل عادة من يوم إلى 3 أيام عمل حسب ولايتك.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                هل يمكنني إرجاع المنتج؟
              </h3>
              <p className="text-muted-foreground text-sm">
                نعم، لديك 4 يومًا لإرجاع منتج غير مستخدم.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                هل المنتجات أصلية؟
              </h3>
              <p className="text-muted-foreground text-sm">
                جميع منتجاتنا 100% أصلية مع ضمان الأصالة.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                ما هي طرق الدفع؟
              </h3>
              <p className="text-muted-foreground text-sm">
                نحن نقبل الدفع نقدًا فقط عند التسليم.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;