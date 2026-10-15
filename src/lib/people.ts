import people from "@/data/people.json";
import type { Person } from "@/types";

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