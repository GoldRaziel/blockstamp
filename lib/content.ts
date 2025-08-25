export type Locale = 'it' | 'en' | 'ar';

type Content = {
  nav: { procedura: string; guida: string; prezzo: string; faq: string; contatti: string };
  hero: { title: string; subtitle: string; notice: string; cta_procedura: string; cta_prezzo: string; cta_faq: string };
};

export const CONTENT: Record<Locale, Content> = {
  it: {
    nav: { procedura: 'PROCEDURA', guida: 'GUIDA', prezzo: 'PREZZO', faq: 'FAQ', contatti: 'CONTATTI' },
    hero: {
      title: 'Protezione su Bitcoin',
      subtitle: 'Timbro temporale immutabile del tuo file',
      notice: 'Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo.',
      cta_procedura: 'Vai alla procedura',
      cta_prezzo: 'Listino prezzi',
      cta_faq: 'FAQ'
    }
  },
  en: {
    nav: { procedura: 'PROCEDURE', guida: 'GUIDE', prezzo: 'PRICING', faq: 'FAQ', contatti: 'CONTACT' },
    hero: {
      title: 'Protection on Bitcoin',
      subtitle: 'Immutable timestamp of your file',
      notice: 'Hashing happens in your browser. Your file never leaves your device.',
      cta_procedura: 'Go to procedure',
      cta_prezzo: 'Price list',
      cta_faq: 'FAQ'
    }
  },
  ar: {
    nav: { procedura: 'الإجراءات', guida: 'الدليل', prezzo: 'الأسعار', faq: 'الأسئلة الشائعة', contatti: 'اتصل بنا' },
    hero: {
      title: 'حماية على شبكة بيتكوين',
      subtitle: 'ختم زمني غير قابل للتغيير لملفك',
      notice: 'تتم عملية التجزئة داخل متصفحك. لن يغادر ملفك جهازك أبدًا.',
      cta_procedura: 'اذهب إلى الإجراءات',
      cta_prezzo: 'قائمة الأسعار',
      cta_faq: 'الأسئلة الشائعة'
    }
  }
};

// Helper: deduce locale da pathname (prima parte dell’URL)
export function getLocaleFromPath(pathname: string): Locale {
  const seg = (pathname.split('/')[1] || 'it') as Locale;
  return (['it','en','ar'] as const).includes(seg) ? seg : 'it';
}
