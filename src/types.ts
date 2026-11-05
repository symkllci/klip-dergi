export type Clip = {
    platform :"instagram" | "youtube";  // platforma string vermesim çünkü  sosyal medya platformlarını da kabul eder  diye  | veya  sembolünü kullandım ödevde ınstagram ve youtube istendiği için
    url :string;
    title :string;
    topic:string;
    publishedAt :string;

};


export type Person = {
    slug : string; //adresteki ad, ör. seyma-kelleci 
    name :string; // kişinin adı
    bio :string;  // biyografi, kendi cümlelerimle
    links:string[];  //kişinin sosyal medya adresleri, birden fazla olabildiği için liste
    clips : Clip[]; //her klip 5 bilgi içerdiği için string değil, Clip kalıbını kullandık
};