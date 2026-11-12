export type Clip = {
    platform: "instagram" | "youtube"; // string verseydim her platformu kabul ederdi. | = veya: ödevde sadece instagram ve youtube istendi
    url: string;
    title: string;
    topic: string;
    publishedAt: string;
    cover: string;
};

export type Person = {
    slug: string; // adresteki ad, ör. seyma-kelleci
    name: string; // kişinin adı
    bio: string; // biyografi, kendi cümlelerimle
    dek: string; // kanca: başlığın altındaki tek cümlelik tanıtım
    photo?: Photo; // fotoğraf (Wikipedia/Commons). ? = olmayabilir, 6 kişide yok
    links: string[]; // kişinin sosyal medya adresleri, birden fazla olabildiği için liste
    clips: Clip[]; // her klip 6 bilgi içerdiği için string değil, Clip kalıbını kullandık
};

// Fotoğrafın kimlik kartı (Wikipedia/Commons'tan)
export type Photo = {
    src: string; // görselin sitedeki adresi
    width: number; // genişlik (piksel)
    height: number; // yükseklik (piksel)
    author: string; // fotoğrafçı
    license: string; // lisans adı (CC BY 4.0 gibi)
    licenseUrl?: string; // lisansın bağlantısı. ? = olmayabilir (kamu malında yok)
    sourceUrl: string; // görselin Commons sayfası
};