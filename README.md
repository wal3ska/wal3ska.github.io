# BİL214 çalışma atölyesi

Hocanın sorularını görüp C veya Bash çözümünü yazabileceğin, çalıştırıp
çıktısını ve test sonucunu inceleyebileceğin Türkçe çalışma sitesi.
Tamamen statiktir; GitHub Pages üzerinde sunucu veya API anahtarı olmadan çalışır.

## İçerik

- **100 görev, 223 test:** Lab 1–3, Exercises 1–5. Bunların 99'u kod çalıştırır;
  bir görevde betiğin çıktısı tahmin edilir.
- **25 PDF / 414 sayfa ve 189 kaynak dosyası:** bütün ders notları,
  alıştırmalar ve C/Bash/veri örnekleri içerikleriyle aranabilir.
- **C editörü:** tarayıcıda gerçek Clang derlemesi, stdin, argv, derleme
  hataları, stdout, stderr ve çıkış kodu. Fonksiyon sorularına hazır test
  programı eklenir; yalnızca istenen fonksiyon yazılır.
- **Bash editörü ve terminal:** bağımsız sanal dosya sistemi, yan tarafta
  dosya ağacı, `mkdir`, `touch`, `cd`, `mv`, `cp`, `rm`, `cat`, yönlendirme,
  borular, değişkenler, diziler ve fonksiyonlar.
- **Doğru/yanlış değerlendirmesi:** test başına beklenen ve oluşan çıktı;
  dosya sorularında eksik, fazla veya farklı dosyalar.
- **Kalıcı çalışma alanı:** taslaklar ve ilerleme localStorage'da, Bash
  dosyaları IndexedDB'de tutulur. JSON yedek dışa/içe aktarma vardır.
- Masaüstü ve mobil düzen, CodeMirror editörü, Ctrl+Enter çalıştırma,
  Ctrl+S kaydetme, terminalde ok tuşlarıyla geçmiş.

## Yerelde açma

Node.js 24 ve npm ile proje dizininde:

```sh
npm ci
npm run build
npm run dev
```

Adres: <http://127.0.0.1:4173/bil214/>. Sunucu `dist/` klasörünü sunar.
Kaynakları değiştirdikten sonra yeniden `npm run build` çalıştır.
`index.html` dosyasını çift tıklamak yerine HTTP sunucusunu kullan.
Derleyici dosyaları `vendor/clang/` içinde hazırdır; normal derlemede indirilmez.

## GitHub Pages yayını

Hedef depo: [wal3ska/wal3ska.github.io](https://github.com/wal3ska/wal3ska.github.io).
Bu depo BİL214 sitesine ayrılmıştır. Ana yayın adresi
[wal3ska.github.io](https://wal3ska.github.io/); yayın durumu deponun
Actions sekmesindeki **BIL214 GitHub Pages** iş akışından izlenebilir.

### Mevcut ana sayfayı koruyarak `/bil214/` altında yayın

`output/bil214-pages.zip` içinde hazır **bil214/** klasörü bulunur.
ZIP'i açıp bu klasörü mevcut Pages sitesinin yayınlanan köküne ekle.
Hedef adres `https://wal3ska.github.io/bil214/` olur. Linkler, worker'lar,
PDF'ler ve derleyici dosyaları bu alt dizini destekler.

Depo bir dalın kökünden yayınlanıyorsa `bil214/` o köke eklenir. `docs/`
klasöründen yayınlanıyorsa `docs/bil214/` kullanılır. Mevcut bir Actions
iş akışı varsa klasörün o iş akışının **yayın çıktısına** kopyalanması gerekir.
Sadece kaynak deposuna eklenmesi, üretilen çıktıya otomatik olarak eklemez.
Bu yöntemde mevcut Pages iş akışını bu projenin iş akışıyla değiştirme.

### Depoyu bu siteye ayırarak kökten yayın

Kaynak paketindeki dosyaları depo köküne ekle. `Settings → Pages → Build and
deployment → Source` altında **GitHub Actions** seç. Eklenen
`.github/workflows/pages.yml`, `main` dalına gönderimde testleri çalıştırır,
`dist/` üretir ve kök site olarak yayınlar. Farklı bir varsayılan dal
kullanılıyorsa iş akışındaki dal adını güncelle.

Bu iş akışı yalnızca bu atölyeyi yayınlar. Depoda başka bir site varsa
üstteki alt dizin yöntemini kullan. GitHub Actions'ın oluşturduğu canlı URL
başarılı deployment kaydında görünür.

Derleyicinin `clang` dosyası yaklaşık 31 MB olduğundan kaynakları veya
hazır klasörü Git istemcisiyle gönder. `node_modules/`, `tmp/`, `.tools/`
ve `output/` klasörlerini commit etme. `dist/` kaynak depoda yeniden üretilir.

Resmî yönerge: [GitHub Pages özel iş akışları](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Kullanım

**Sorular:** dil veya metin ile soruyu seç. **Çalıştır** ile kendi girdini dene;
**Kontrol et** bütün testleri bağımsız başlangıç dosyalarıyla çalıştırır.
Yanlış sonuçta beklenen ve oluşan değerleri karşılaştır. Kaynak PDF'nin
sayfasına ve hocanın metnine soru panelinden ulaşılır.

**Serbest laboratuvar:** Bash terminalinde örneğin:

```bash
mkdir -p projeler/notlar
echo 'BIL214' > projeler/notlar/ders.txt
mv projeler/notlar/ders.txt projeler/notlar/hafta1.txt
cd projeler/notlar
pwd
ls -l
cat hafta1.txt
```

Dosya ağacından dosyayı açıp düzenle. **Kaydet** veya Ctrl+S sanal dosyaya
yazar; **Çalıştır** da önce dosyayı kaydeder. Kaydedilmemiş editör taslağı
ayrıca korunur. Ders örnekleri `~/ders`, Lab 3 kurulumu `~/init.sh` içindedir.
Dil seçicisinden C'ye geçip bağımsız C programları da çalıştırabilirsin.

**Yedekle:** ilerleme, taslaklar ve sanal dosyaları indirir. Yardım menüsündeki
**Yedekten geri yükle** bu kaydı içe aktarır. Kayıtlar cihazlar arasında
eşitlenmez; tarayıcı verileri silinirse indirilen yedek kullanılabilir.

## Çalıştırma sınırları

- C ortamı Clang/LLD 8 ve WASI tabanlıdır; C11 / wasm32 kullanır. İlk C
  çalıştırmada yaklaşık 60 MB yüklenir. Service worker destekleniyorsa
  derleyici önbelleğe alınır; tam çevrimdışı site garantisi verilmez.
  `fork`, ağ ve Linux süreç API'leri yoktur.
- Bash, **just-bash** uyumlu yorumlayıcısıdır. Gerçek Linux veya eksiksiz GNU
  Bash değildir; süreç/job control, ağ, Python/JavaScript komutları ve gzip
  bu sitede desteklenmez. Dosya/betik alıştırmaları sanal alanda çalışır.
- C laboratuvarı tek C dosyasını derler. Arşivden açılan örneğin aynı
  klasördeki başlıkları eklenir. Birden fazla `.c` dosyası isteyen projeleri
  birleştirmek veya yerel derleyici kullanmak gerekir.
- Testler çıktı, çıkış kodu ve gerekiyorsa dosyaları kontrol eder.
  Süre karmaşıklığı, değişken sayısı veya yalnızca belirli komutları kullanma
  gibi sınav koşulları otomatik doğrulanmaz. Kaynak PDF koşulları geçerlidir.
- **Durdur** ve yürütme sınırları vardır: C için 7 saniye; Bash için 5 saniye,
  20.000 döngü, 30.000 komut. Kod/çıktı yaklaşık 200 KB; sanal dosya sistemi
  8 MB ile sınırlıdır.

## Geliştirme ve doğrulama

```sh
npm test
npm run content
npm run build
npm run package
```

`npm test`, envanteri, Bash referanslarını, dosya karşılaştırmasını, bütün
C çözümlerini gerçek WebAssembly derleyicisinde ve yanlış çözümlerin
reddedilmesini kontrol eder. `npm run content`, `content/` tanımlarından
soruları/testleri üretir. Referans çözümler `tests/` içindedir; siteye
kopyalanmaz. İstemcideki test verileri gizli değildir.

Tarayıcı kontrolü için Playwright kurulu bir ortamda sunucu açıkken
`npm run test:browser` çalıştırılır. `PLAYWRIGHT_ENTRY` kurulu Playwright'ın
modül yolunu, `TEST_BROWSER` Chromium/Chrome yolunu, `TEST_URL` site adresini
değiştirir. Test boş bir headless profil kullanır. Görüntüler: `tmp/qa/`.
`node tests/workspace.browser.mjs` ayrıca yedekleme, sıfırlama, içe aktarma,
C sonsuz döngü sınırı ve sonrasında yeniden çalıştırmayı doğrular.

Son doğrulama: 99 çalıştırılabilir görevin 222 testi tarayıcıda geçti;
çıktı tahminiyle 223 kontrol vardır. Doğru/yanlış ekranları, Türkçe stdin/
çıktı, C hataları, dosya işlemleri, değişken/dizi/fonksiyon devamlılığı,
yenileme sonrası kayıtlar, kaynak araması ve 390 px mobil düzen kontrol edildi.

Kısıtlı Windows ortamında esbuild üst dizinleri okuyamıyorsa PowerShell'de
`$env:BIL214_SANDBOX_BUILD='1'` proje içi modül çözücüsünü etkinleştirir.
Normal yerel/CI derlemesinde gerekli değildir.

Materyalleri yeniden indekslemek için Python + PyMuPDF ile
`python scripts/extract-content.py` kullanılabilir. Hazır JSON normal
kullanıma yeterlidir. Derleyiciyi aynı sabit revizyondan geri indirmek için
`node scripts/download-runtime.mjs` vardır.

## Dosyalar

| Konum | İçerik |
| --- | --- |
| `src/app.js`, `styles.css` | Türkçe arayüz ve editör |
| `src/c-worker.js`, `vendor/clang/` | C derleyicisi ve WASI çalıştırma |
| `src/bash-worker.js`, `src/shell-core.mjs` | Bash ve sanal dosyalar |
| `src/grading.js` | Çıktı ve dosya sistemi karşılaştırması |
| `content/`, `data/` | Sorular, testler, materyal envanteri |
| `tests/` | Referans çözümler ve testler |
| `dist/` | Yayınlanacak statik site |
| `output/` | Hazır Pages ve kaynak ZIP dosyaları |

Ders materyalleri kendi kaynaklarına aittir. Yazılım lisansları
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) dosyasındadır.
