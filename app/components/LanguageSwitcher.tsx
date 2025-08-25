export default function LanguageSwitcher() {
  return (
    <nav className="flex gap-3 text-sm opacity-80 my-3">
      <a href="/it" className="underline-offset-4 hover:underline">IT</a>
      <span>•</span>
      <a href="/en" className="underline-offset-4 hover:underline">EN</a>
      <span>•</span>
      <a href="/ar" className="underline-offset-4 hover:underline">AR</a>
    </nav>
  );
}
