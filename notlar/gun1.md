# Gün 1 – Kurulum ve canlı boş site (14 Ekim 2026, Çarşamba)

## Ne yaptım
- Node.js v24.21.0 (LTS) kurdum. Kurulumda "Tools for Native Modules" kutusunu boş bıraktım, gerek yoktu.
- `create-next-app` ile klip-dergi projesini oluşturdum. Seçtiğim ayarlar:
  - TypeScript: Evet
  - ESLint: Evet
  - React Compiler: Hayır
  - Tailwind: Evet
  - src klasörü: Evet
  - App Router: Evet
  - Cache Components: Hayır
  - import alias: Hayır (varsayılan `@/*` kaldı)
  - AGENTS.md: Evet
  - Anonim geri bildirim: Hayır
- `npm run dev` ile siteyi bilgisayarımda çalıştırdım ve localhost:3000'de açtım.
- GitHub'da public `klip-dergi` reposunu açtım, ilk commit'i main dalına push'ladım.
- Vercel'e GitHub hesabımla girdim, repoyu içe aktardım ve deploy ettim. Hobby (ücretsiz) planı kullanıyorum.
  Artık main dalına her push yaptığımda Vercel siteyi otomatik olarak yeniden yayınlıyor.
- Planda istendiği gibi `hafta1` dalını açtım. Bundan sonraki çalışmalarımı bu dalda yapıyorum.
- Ana sayfaya site adını, tek cümlelik açıklamayı ve "Kişiler" linkini ekledim.
- Canlı adres: https://klip-dergi.vercel.app
- Repo: https://github.com/symkllci/klip-dergi

## Öğrendiğim komutlar
- `node -v`: Node.js'in sürümünü gösterir, kurulu olup olmadığını kontrol eder.
- `npm -v`: npm'in (Node'un paket yükleyicisinin) sürümünü gösterir.
- `cd Desktop`: Terminalde masaüstü klasörüne geçer. Proje masaüstünde oluşsun diye önce bunu yazdım.
- `npx create-next-app@latest klip-dergi`: Masaüstünde klip-dergi adında bir klasör açar ve içine hazır bir Next.js projesi kurar.
- `cd klip-dergi`: Oluşturduğum proje klasörüne girer.
- `npm install`: Projenin ihtiyaç duyduğu paketleri indirir.
- `npm run dev`: Siteyi bilgisayarımda çalıştırır, tarayıcıda localhost:3000'de açarım. Kapatmak için Ctrl + C.
- `dir src`: src klasörünün oluşup oluşmadığını gösterir.
- `git status`: Projedeki dosyaların Git'teki durumunu gösterir.
- `git init`: Klasörde Git'i başlatır.
- `Test-Path .gitignore`: .gitignore dosyası var mı diye bakar. True yazdı. Bu dosya node_modules gibi gereksiz dosyaların GitHub'a gitmesini engelliyor.
- `git add .`: Tüm değişiklikleri commit'e hazırlar.
- `git commit -m "..."`: Değişiklikleri bir kayıt olarak kaydeder.
- `git branch -M main`: Ana dalın adını main yapar.
- `git remote add origin ...`: Bilgisayarımdaki projeyi GitHub reposuna bağlar.
- `git push -u origin main`: Dosyaları GitHub'a gönderir.
- `git checkout -b hafta1`: hafta1 adında yeni bir dal açar ve ona geçer.

## Öğrendiğim kavramlar
- **TypeScript:** Kodda yanlış ya da eksik bir şey yazdığımda beni site açılmadan önce uyarır.
- **Tailwind:** Tasarım (CSS) yazmanın kısa yolu. Sayfaya renk, boyut, boşluk gibi tasarımı kısa kodlarla hızlıca vermemi sağlar.
- **App Router:** Next.js'te sayfaların klasörlerle oluşturulması. Yeni bir klasör açtığımda sitede otomatik olarak yeni bir sayfa adresi oluşur. Örneğin `src/app/kisiler/page.tsx` dosyasını açarsam site otomatik olarak `/kisiler` adresini oluşturur.
- **src klasörü:** Benim yazdığım bütün kodlar tek bir klasörde düzenli durur.
- **Vercel:** GitHub'daki repomu izliyor. main dalına her push yaptığımda siteyi otomatik olarak build edip canlı adrese yayınlıyor.

## Nerede takıldım
- **OneDrive:** Masaüstü klasörüm OneDrive içindeydi, bu yüzden `cd Desktop` çalışmadı. Masaüstünü OneDrive yedeklemesinden çıkardım ("Yalnızca benim bilgisayarım" seçeneğiyle).
- **src klasörü:** İlk kurulumda yanlışlıkla önerilen ayarları seçtim, onlarda src klasörü yoktu. Kurulumu durdurdum, klasörü silip "customize settings" ile yeniden kurdum.
- **Uzun kurulum:** Paketlerin yüklenmesi çok uzun sürdü. Kurulumu durdurup `npm install` ile tamamladım (yaklaşık 9 dakika).
- **Git:** Kurulumu yarıda kestiğim için Git başlatılmamıştı. `git status` "not a git repository" dedi, `git init` ile başlattım.
- **AGENTS.md:** Kurulumda "Evet" dememe rağmen dosya oluşmamış. Kurulumu yarıda kestiğim için olabilir.
- **Vercel izni:** Vercel'de klip-dergi listede çıkmadı. GitHub uygulama izinlerinden klip-dergi'ye erişim verince çıktı.
- **Ana sayfa hataları:**
  - Paragrafı `<p1>` diye yazmışım. Böyle bir HTML etiketi yok, doğrusu `<p>`.
  - Linki küçük harfle `<link>` yazmışım. Küçük harfli `<link>` HTML'de CSS bağlamak için kullanılan başka bir etiket. Next.js'in link bileşeni büyük harfle `<Link>` yazılıyor. React'te küçük harfle başlayanlar HTML etiketi, büyük harfle başlayanlar bileşen sayılıyor.
- **Uyarılar (hata değil):**
  - Git'te "LF will be replaced by CRLF" uyarıları çıktı. Windows ile diğer sistemlerin satır sonlarını farklı yazmasından kaynaklanıyormuş.
  - Vercel build'inde 3 uyarı çıktı, site yine de yayınlandı.
  - Next.js anonim kullanım istatistiği (telemetry) topladığını bildirdi.

## Claude'un yazdığı neyi değiştirdim
- Kurulum adımlarını ve komutları Claude'a sorarak ilerledim, her komutun ne yaptığını not aldım.
- Ana sayfada Claude bana boş bir iskelet verdi. Başlığı, açıklama cümlesini ve link yazısını kendim yazdım.
  Açıklama cümlesini Claude'un önerilerinden birinden yola çıkarak kendime göre değiştirdim.
- Yazarken yaptığım `<p1>` ve `<link>` hatalarını Next.js'in hata ekranından görüp düzelttim.

## Sorularım
- Kurulumda 5 "high severity vulnerability" uyarısı çıktı. `npm audit fix --force` projeyi bozabileceği için çalıştırmadım. Ne yapmalıyım?
- ESLint 9.39.5 için "deprecated" (artık desteklenmiyor) uyarısı çıktı. Önemli mi?
- unrs-resolver paketi için "install-scripts" uyarısı çıktı (`npm install-scripts approve unrs-resolver`). İzin vermeli miyim?
- Vercel Hobby planı ticari olmayan kullanım için. İleride üyelik gelirse Pro plana mı geçeceğiz, yoksa siteyi sizin hesabınıza mı taşıyacağız?
- hafta1 dalında çalışıyorum. Canlı adres (klip-dergi.vercel.app) main dalını gösterdiği için ana sayfa değişikliğim orada görünmüyor, sadece Vercel'in önizleme adresinde görünüyor. hafta1'i main'e ne zaman birleştireceğiz?


