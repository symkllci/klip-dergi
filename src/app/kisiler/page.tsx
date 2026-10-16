import { getAllPeople } from "@/lib/people"


export default function KisilerSayfasi() {
    const kisiler = getAllPeople();
    return(
    <main>
    <h1>Kişiler</h1>
    <p>Podcast kliplerinde konuşan girişimcilerin biyografileri, sosyal medya hesapları ve viral klipleri.</p>
    <p>Toplam {kisiler.length} kişi</p>
    </main>
    )
}

