# BİL214 — kaynaklar ve lisanslar

## Ders materyalleri

PDF'ler ve örnek C/Bash/veri dosyaları çalışma klasöründe sağlanan TOBB ETÜ
BİL214 Sistem Programlama, 2026 Güz ders materyalleridir. Kaynak metinleri ve
dosya adları korunmuştur. Bunlar aşağıdaki yazılım lisansları kapsamında
yeniden lisanslanmaz. Soru özetleri, başlangıç kodları ve otomatik testler
bu çalışma sitesi için hazırlanmıştır; resmî notlandırma sistemi değildir.

## C çalışma ortamı

- [binji/wasm-clang](https://github.com/binji/wasm-clang), Apache-2.0.
- Sabit kaynak revizyonu: `648c4a89997a351eef75cdaec3ef5b89d4937dec`.
- Clang/LLD 8 ve WASI sistem kütüphaneleri upstream dağıtımından alınmıştır.
- Tam lisanslar: [Apache lisansı](vendor/clang/LICENSE) ve
  [LLVM bildirimleri](vendor/clang/LICENSE.llvm).
- `shared.js` değişiklikleri: çıktı dosya tanıtıcısının iletilmesi ve
  `App` / `ProcExit` sınıflarının bağdaştırıcıya açılması. Saat desteği ve
  C11 derleme/çalıştırma bağdaştırıcısı `src/c-worker.js` içindedir.

## Editör ve Bash ortamı

- [CodeMirror 6](https://codemirror.net/), MIT lisansı.
- [just-bash 3.6.0](https://github.com/vercel-labs/just-bash), Apache-2.0.
- Derleme aracı: [esbuild](https://github.com/evanw/esbuild), MIT lisansı.
- Üretim bağımlılıklarının lisans metinleri her derlemede
  `dist/THIRD_PARTY_LICENSES.txt` dosyasına eklenir. Sürümler
  `package-lock.json` içinde sabittir.
