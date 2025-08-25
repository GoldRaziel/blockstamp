import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Page() {
  return (
    <>
      <LanguageSwitcher />
      <main style={{padding:16, direction:'rtl'}}>
        <h1 style={{fontSize:24, marginBottom:8}}>بلوكسـتامب — إثبات الوجود</h1>
        <p style={{opacity:0.8, marginBottom:12}}>
          النسخة العربية قيد الإعداد. حالياً، الصفحة الإيطالية هي المرجع الكامل.
        </p>
        <p>انتقل إلى الصفحة الإيطالية للاطّلاع على كل شيء.</p>
      </main>
    </>
  );
}
