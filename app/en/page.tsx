import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Page() {
  return (
    <>
      <LanguageSwitcher />
      <main style={{padding:16}}>
        <h1 style={{fontSize:24, marginBottom:8}}>BLOCKSTAMP — Proof of Existence</h1>
        <p style={{opacity:0.8, marginBottom:12}}>
          English version coming online. Italian content is currently the reference version.
        </p>
        <p>Go to the Italian page to see the full flow.</p>
      </main>
    </>
  );
}
