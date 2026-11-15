"use client"; // Tarayıcıda çalışır: düğmeler, ses, zamanlayıcı (useState, useRef) burada

import { useEffect, useRef, useState } from "react";

// Kelime zamanı: hangi kelime, kaçıncı saniyede başlıyor ve bitiyor
export type KelimeZamani = {
  kelime: string; // okunan kelime, ör. "Hamdi"
  baslangic: number; // başlangıç saniyesi, ör. 0.4
  bitis: number; // bitiş saniyesi, ör. 1.1
};

type Props = {
  metin: string; // ekranda yazan metin (biyografi)
  ses: string; // ses dosyasının adresi, ör. "/ses/deneme.mp3"
  kelimeler: KelimeZamani[]; // json'dan gelen kelime zamanları (sırası metindeki kelimelerle aynı)
  zamaniGoster?: boolean; // ? = olmayabilir. Deneme sayfasında saniyeyi göstermek için (json'ı elle yazarken lazım)
};

const HIZLAR = [1, 1.25, 1.5, 2]; // plandaki hız seçenekleri

// 75 saniye → "1:15" (dakika:saniye)
function sureYaz(saniye: number): string {
  if (!Number.isFinite(saniye)) return "0:00"; // süre henüz bilinmiyorsa
  const dk = Math.floor(saniye / 60);
  const sn = Math.floor(saniye % 60);
  return `${dk}:${sn.toString().padStart(2, "0")}`; // padStart: 5 → "05"
}

export default function SesliBiyografi({ metin, ses, kelimeler, zamaniGoster }: Props) {
  const sesRef = useRef<HTMLAudioElement>(null); // <audio> etiketine uzaktan kumanda
  const [oynuyor, setOynuyor] = useState(false); // ses çalıyor mu
  const [simdi, setSimdi] = useState(0); // şu an kaçıncı saniye (currentTime)
  const [sure, setSure] = useState(0); // sesin toplam süresi (duration)
  const [hiz, setHiz] = useState(1); // çalma hızı (playbackRate)

  // Ses çalarken saniyeyi saniyede ~60 kez oku (requestAnimationFrame).
  // timeupdate olayı saniyede sadece ~4 kez gelir, vurgu kelime atlardı.
  useEffect(() => {
    if (!oynuyor) return; // çalmıyorsa döngüye gerek yok
    let kare = 0;
    const dongu = () => {
      if (sesRef.current) setSimdi(sesRef.current.currentTime);
      kare = requestAnimationFrame(dongu); // bir sonraki ekran karesinde tekrar
    };
    kare = requestAnimationFrame(dongu);
    return () => cancelAnimationFrame(kare); // durunca döngüyü kapat
  }, [oynuyor]);

  // Oynat / duraklat
  function oynatDuraklat() {
    const s = sesRef.current;
    if (!s) return;
    if (s.paused) s.play();
    else s.pause();
  }

  // 10 sn geri (-10) ya da ileri (+10). Math.min/max: 0'ın altına, sürenin üstüne çıkmasın
  function atla(fark: number) {
    const s = sesRef.current;
    if (!s) return;
    s.currentTime = Math.max(0, Math.min(s.duration || 0, s.currentTime + fark));
    setSimdi(s.currentTime);
  }

  // Hız değiştir. currentTime sesin kendi saniyesi olduğu için vurgu hızdan etkilenmez
  function hizSec(yeni: number) {
    if (sesRef.current) sesRef.current.playbackRate = yeni;
    setHiz(yeni);
  }

  // ⭐ KELİME VURGUSU: şu ana kadar başlamış son kelimenin sırası (-1 = henüz hiçbiri)
  // findLastIndex: sondan bakar, baslangic <= simdi olan ilk kelimeyi bulur
  const okunanSira = kelimeler.findLastIndex((k) => k.baslangic <= simdi);
  // O kelime hâlâ okunuyor mu? (bitiş saniyesi geçmediyse sarı olsun)
  const okunuyor = okunanSira >= 0 && simdi < kelimeler[okunanSira].bitis;
  const basladi = simdi > 0; // hiç oynatılmadıysa metin normal renkte dursun

  // Metni boşluklardan kelimelere böl. "Hamdi Ulukaya," → ["Hamdi", "Ulukaya,"]
  const metinKelimeleri = metin.split(" ");

  return (
    <div>
      {/* OYNATICI: krem zemin, üstte ve altta ince çizgi */}
      <div className="flex flex-wrap items-center gap-3 border-y border-stone-300 py-3">
        {/* Görünmez ses etiketi: düğmelerimiz bunu yönetir */}
        <audio
          ref={sesRef}
          src={ses}
          preload="metadata" // önce sadece süreyi indir, sesin tamamını değil
          onLoadedMetadata={(e) => setSure(e.currentTarget.duration)} // süre öğrenilince yaz
          onPlay={() => setOynuyor(true)}
          onPause={() => setOynuyor(false)}
          onEnded={() => setOynuyor(false)}
        />

        {/* Bordo yuvarlak oynat/duraklat düğmesi */}
        <button
          type="button"
          onClick={oynatDuraklat}
          aria-label={oynuyor ? "Duraklat" : "Biyografiyi dinle"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-800 text-white transition-colors hover:bg-rose-900"
        >
          {oynuyor ? "❚❚" : "▶"}
        </button>

        {/* 10 sn geri / ileri */}
        <button type="button" onClick={() => atla(-10)} aria-label="10 saniye geri" className="rounded-full px-2 py-1 text-sm text-stone-600 hover:text-rose-800">
          −10
        </button>
        <button type="button" onClick={() => atla(10)} aria-label="10 saniye ileri" className="rounded-full px-2 py-1 text-sm text-stone-600 hover:text-rose-800">
          +10
        </button>

        {/* İlerleme çizgisi: range = sürüklenebilir çubuk, klavyede ok tuşlarıyla da çalışır. min-w-0 + flex-1: telefonda taşmasın */}
        <input
          type="range"
          min={0}
          max={sure || 0}
          step={0.1}
          value={simdi}
          onChange={(e) => {
            const yeni = Number(e.target.value);
            if (sesRef.current) sesRef.current.currentTime = yeni;
            setSimdi(yeni);
          }}
          aria-label="İlerleme"
          className="min-w-0 flex-1 accent-rose-800"
        />

        {/* Süre: geçen / toplam */}
        <span className="text-xs tabular-nums text-stone-500">
          {sureYaz(simdi)} / {sureYaz(sure)}
        </span>

        {/* Hız düğmeleri: seçili olan bordo */}
        <div className="flex gap-1" role="group" aria-label="Çalma hızı">
          {HIZLAR.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => hizSec(h)}
              aria-label={`${h} kat hız`}
              aria-pressed={hiz === h} // ekran okuyucuya "seçili" der
              className={`rounded-full px-2 py-1 text-xs ${hiz === h ? "bg-rose-800 text-white" : "text-stone-600 hover:text-rose-800"}`}
            >
              {h.toString().replace(".", ",")}×
            </button>
          ))}
        </div>
      </div>

      {/* Yapay zekâ etiketi (plan kuralı) */}
      <p className="mt-2 text-xs uppercase tracking-widest text-stone-500">Yapay zekâ ile seslendirildi</p>

      {/* Deneme sayfasında: şu anki saniye (json'ı elle yazarken bakmak için) */}
      {zamaniGoster && <p className="mt-1 font-mono text-sm text-rose-800">Şu an: {simdi.toFixed(2)} sn</p>}

      {/* METİN: her kelime ayrı span. Okunan sarı, okunmuşlar koyu, sıradakiler gri */}
      <p className="mt-6 font-serif text-xl leading-loose">
        {metinKelimeleri.map((kelime, sira) => {
          let renk = "text-stone-700"; // oynatılmadan önce: normal
          if (basladi) {
            if (sira === okunanSira && okunuyor) renk = "bg-yellow-200 text-stone-900"; // şimdi okunan
            else if (sira <= okunanSira) renk = "text-stone-900"; // okunmuş: koyu
            else renk = "text-stone-400"; // sıradaki: gri
          }
          return (
            // key: sıra numarası (aynı kelime iki kez geçebilir). Sonundaki " " kelimeler arası boşluk
            <span key={sira}>
              <span className={`rounded px-0.5 transition-colors ${renk}`}>{kelime}</span>{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}