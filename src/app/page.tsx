import Link from "next/link";

export default function Home() {
   return (
    <main>
    <h1>KLİP DERGİ</h1>
    <p>Viral olan girişimcilerin podcast kliplerini ve hikâyelerini bir araya getiren dergi. </p>
    <Link href="/kisiler">Kişiler</Link>
    </main>
   );
}