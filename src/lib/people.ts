import people from "@/data/people.json";
import type { Person } from "@/types";
import type { AramaKisisi } from "@/components/AramaKutusu"; // Öneri listesinin kişi kalıbı (sadece tip)

export function getAllPeople(): Person[] {   //person listesi getireceğim
    return people as Person[];               // gerçek kişiler o liste
}
// Slug ile tek bir kişiyi bulan tarif.
// Kişi sayfası kullanacak, ör. /kisiler/acun-ilicali
// slug: string → tarife adresteki slug verilir (bir yazı)
// Person | undefined → bulursa o kişiyi, bulamazsa undefined (boş) getirir
export function getPersonBySlug(slug: string): Person | undefined { 
    // getAllPeople() → önce herkesi al
    // .find(...) → listede ara, şartı tutan ilk kişiyi getir
    // person.slug === slug → kişinin slug'ı aranan slug'a eşit mi?
    return getAllPeople().find((person) => person.slug === slug);  
}

// Arama öneri listesi için kişiler: ad, slug, konular, klip başlıkları.
// Biyografi gibi uzun bilgiler YOK → tarayıcıya az veri gider.
// Üst menüdeki arama (layout.tsx) ve Kişiler sayfasındaki arama aynı listeyi kullanır.
export function getAramaKisileri(): AramaKisisi[] {
    return getAllPeople().map((kisi) => ({
        ad: kisi.name,
        slug: kisi.slug,
        // new Set: aynı konu iki klipte varsa bir kez yaz · [...] = tekrar listeye çevir
        konular: [...new Set(kisi.clips.map((klip) => klip.topic))],
        basliklar: kisi.clips.map((klip) => klip.title),
    }));
}