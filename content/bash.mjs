export const bashQuestions=[];
const H='/home/ogrenci';
function add(set,number,title,description,reference,options={}){
  const {cases=[{}],...rest}=options;
  bashQuestions.push({id:`b-${set.replaceAll(' ','').toLowerCase()}-${number}`,language:'bash',set,number:String(number),title,description,
    source:set.startsWith('Lab')?`Lab_${set.at(-1)}_Exercises.pdf`:`Exercises_0${set.at(-1)}.pdf`,page:1,mode:'script',starter:'#!/bin/bash\n# Çözümünü buraya yaz.\n',reference,
    note:'Her test temiz dosyalarla başlar. Çıktı, çıkış kodu ve /home altındaki dosya değişiklikleri karşılaştırılır. PDF’deki komut ve tek satır kısıtlarını ayrıca kontrol et.',
    hint:'Dosya ağacını incele. Standart girdi ile komut satırı argümanları ayrı alanlardır.',
    cases:cases.map((c,i)=>({name:`Test ${i+1}`,cwd:H,files:{},dirs:[H],stdin:'',args:[],env:{HOME:H,USER:'ogrenci',LC_ALL:'C'},...c})),...rest});
}
const labBase=n=>`mkdir -p Lab${n}/dir1/dir3 Lab${n}/dir2/dir4 Lab${n}/dir2/dir5/dir6\ntouch Lab${n}/file0 Lab${n}/dir1/file1 Lab${n}/dir2/file2 Lab${n}/dir1/dir3/file3 Lab${n}/dir2/dir4/file4 Lab${n}/dir2/dir5/file5 Lab${n}/dir2/dir5/dir6/file6`;
const lab1=[
 ['3a','Alt dizini listele','dir6 içindeki dosyaları listele.','ls dir6'],
 ['3b','Üst dizini listele','dir2 içindeki dosyaları ve dizinleri listele.','ls ..'],
 ['3c','Kardeş dizini listele','dir4 içindeki dosyaları listele.','ls ../dir4'],
 ['3d','Uzak dizini listele','dir3 içindeki dosyaları listele.','ls ../../dir1/dir3'],
 ['4','Dosya oluştur','Geçerli dizinde myFile oluştur.','touch myFile'],
 ['5','Dosyayı taşı','myFile dosyasını dir4 içine taşı.','mv myFile ../dir4/'],
 ['6','Dosyayı sil','dir4 içindeki myFile dosyasını sil.','rm ../dir4/myFile'],
 ['7','Üst konumda dosya oluştur','Lab1 içinde myFile oluştur.','touch ../../myFile'],
 ['8','Taşı ve yeniden adlandır','Lab1 içindeki myFile dosyasını dir1 içine myFile1 adıyla taşı.','mv ../../myFile ../../dir1/myFile1'],
 ['9','Dosyayı yeniden adlandır','dir1 içindeki myFile1 adını myFile yap.','mv ../../dir1/myFile1 ../../dir1/myFile'],
 ['10','Alt klasör oluştur','dir6 içinde myDir oluştur.','mkdir dir6/myDir'],
 ['11','Yeni adla kopyala','dir1 içindeki myFile dosyasını myDir içine myFile1 adıyla kopyala.','cp ../../dir1/myFile dir6/myDir/myFile1'],
 ['12','Dolu dizini kaldır','myDir dizinini içeriğiyle birlikte kaldır.','rm -r dir6/myDir'],
 ['13','Üst dizine kopyala','dir1 içindeki myFile dosyasını geçerli dizinin üst dizinine kopyala.','cp ../../dir1/myFile ..'],
 ['14','Geçerli dizine taşı','Üst dizindeki myFile dosyasını geçerli dizine taşı.','mv ../myFile .']
];
let previous='';
for(const[n,t,d,r]of lab1){add('Lab 1',n,t,d+' Konum: Lab1/dir2/dir5. cd kullanmadan göreli yollarla çalış.',r,{page:Number(n)>=8?2:1,cases:[{setup:labBase(1)+`\ncd ${H}/Lab1/dir2/dir5\n`+previous,cwd:H+'/Lab1/dir2/dir5'}],orderIndependent:true});previous+='\n'+r;}
const lab2setup=labBase(2)+'\ntouch Lab2/file1 Lab2/dir1/file2 Lab2/dir2/dir4/file1 Lab2/dir2/dir5/dir6/file1\ncd Lab2/dir2/dir5\necho bil214 > text1.txt\necho "system programming" > text2.txt\necho "Have fun" > text3.txt\ncat text1.txt text2.txt text3.txt > text4.txt\necho 123456789 >> text4.txt\nsort < text4.txt > text5.txt';
const lab2=[
 ['5','Dosya yollarını bul','Lab2 altındaki file1 yollarını file_paths.txt içine yaz.','find ../.. -name file1 > file_paths.txt'],
 ['6','Bulunan dosyaları sil','Lab2 altındaki file1 dosyalarını kaldır.','find ../.. -name file1 | xargs rm'],
 ['7','Listeden dosya oluştur','file_paths.txt içindeki dosyaları yeniden oluştur.','cat file_paths.txt | xargs touch'],
 ['8','Kelime sayısını ekle','text1.txt ve text2.txt toplam kelime sayısını text4.txt sonuna ekle.','cat text1.txt text2.txt | wc -w >> text4.txt'],
 ['9','İçeriği sırala','text4.txt içeriğini sıralayıp text6.txt içine yaz.','sort text4.txt > text6.txt'],
 ['10','Dosya adlarını kaydet','Geçerli dizindeki adları sıralayıp dir4/file_names.txt içine yaz.','ls | sort > ../dir4/file_names.txt'],
 ['11','İçerikleri birleştir','Geçerli dizindeki tüm normal dosyaların içeriğini dir1/contents.txt içine kaydet.','cat $(find . -maxdepth 1 -type f | sort) > ../../dir1/contents.txt'],
 ['12','Toplam kelime sayısı','Geçerli dizindeki tüm normal dosyaların kelime sayısını dir1/contents.txt sonuna ekle.','cat $(find . -maxdepth 1 -type f | sort) | wc -w >> ../../dir1/contents.txt']
];
previous='';
for(const[n,t,d,r]of lab2){add('Lab 2',n,t,d+' Konum: Lab2/dir2/dir5. Önceki görevlerin doğru sonuçları başlangıçta hazırlanmıştır.',r,{page:2,cases:[{setup:lab2setup+'\n'+previous,cwd:H+'/Lab2/dir2/dir5'}]});previous+='\n'+r;}
const lab3=[
 ['1','Çift rakamla biten dosyalar','Dir1 içinden son karakteri çift rakam olanları Dir3 içine kopyala.','cp Dir/Dir1/*[02468] Dir/Dir3/'],
 ['2','Dosya adıyla silme','Dir3 içinden rakamla başlamayan, adı en az 6 karakter olan dosyaları sil.','rm Dir/Dir3/[!0-9]?????*'],
 ['3','En az iki rakam','Dir1 içinden adında en az iki rakam olanları Dir3 içine kopyala.','cp Dir/Dir1/*[0-9]*[0-9]* Dir/Dir3/'],
 ['4','Harf ve rakam içerenler','Dir1 içinden adında en az bir harf ve bir rakam bulunan dosyaları listele.',"ls Dir/Dir1 | grep -E '[A-Za-z].*[0-9]|[0-9].*[A-Za-z]'"],
 ['5','Sonu iki rakam olmayanlar','Dir3 içinden adı iki rakamla bitmeyenleri listele.',"ls Dir/Dir3 | grep -Ev '[0-9]{2}$'"],
 ['6','Tekrarlanan A harfleri','Dir2 içinden en az üç A içeren ve en az iki A yan yana bulunan adları Texts/names.txt içine yaz.',"ls Dir/Dir2 | grep -E 'A.*A.*A' | grep AA > Dir/Texts/names.txt"],
 ['7','Tek başına duran A','Dir2 içinden en az bir komşusuz A içeren adları Texts/names.txt içine yaz.',"ls Dir/Dir2 | grep -E '(^|[^A])A([^A]|$)' > Dir/Texts/names.txt"],
 ['8','En çok üç ayrı A','Dir2 içinden en çok üç A içeren ve A harfleri yan yana olmayan adları büyük harfe çevirerek Texts/names.txt sonuna ekle.',"ls Dir/Dir2 | grep -Ev 'A.*A.*A.*A|AA' | tr 'a-z' 'A-Z' >> Dir/Texts/names.txt"]
];
for(const[n,t,d,r]of lab3)add('Lab 3',n,t,d,r,{initScript:true,orderIndependent:true,cases:[{setup:(['2','5'].includes(n)?'cp Dir/Dir1/* Dir/Dir3/\n':'')+(n==='8'?'echo onceki > Dir/Texts/names.txt':'')}],note:'init.sh başlangıcı kurar. 2 ve 5. sorularda anlamlı bir test için Dir3, Dir1 dosyalarıyla doldurulur. Liste sırası dikkate alınmaz.'});
const sample='Highway High\nHighland HIGHER\na_b_c one_two plain\nabc12x end6 end7\nabcde9 ABCDef\na1b a1z Z2a\nabc 1a 12\nxy xmiddley 1hello2\na_b__c a_b_c\nA1b2c3 x1234\nHello, World! 123\n';
const rootFiles={[H+'/work/Text.txt']:sample,[H+'/Dir1/Text.txt']:'Komsu dosya\n',[H+'/work/files.txt']:'onceki\n',[H+'/work/archive/File']:'A\n',[H+'/work/archive/sub/File']:'B\n',[H+'/work/archive/sub/Other']:'C\n'};
for(const n of ['testfile','ft','t_f','plain','abc12','abc!?','abcd9','Te_one','Tae_two','Ta_other','Te','Tee','12','a.b'])rootFiles[H+'/work/'+n]='data '+n+'\n';
const baseCases=[0,1].map(v=>({name:v?'Ek dosyalar ve farklı içerik':'Temel dosya yapısı',cwd:H+'/work',files:{...rootFiles,...(v?{[H+'/work/new_tf_file']:'yeni\n',[H+'/work/A12!?']:'sil\n',[H+'/work/Text.txt']:sample+'New! text, 789.\n'}:{})},env:{HOME:H,File:H+'/work/Text.txt',Dir:H+'/work/archive',filePath:H+'/work/Text.txt'}}));
const e1a=[
 ['a','Adına göre dosya bul','Dir altında adı tam olarak File olan dosyaların yollarını paths.txt içine yaz.','find "$Dir" -name File > paths.txt'],
 ['b','Kardeş dizinden kopyala','Kardeş dizin Dir1 içindeki Text.txt dosyasını geçerli dizine kopyala.','cp ../Dir1/Text.txt .'],
 ['c','İki harfi de içerenler','Adında hem t hem f bulunan dosya adlarını files.txt sonuna ekle.','ls | grep t | grep f >> files.txt'],
 ['d','Son iki karakter harf değil','En az beş karakterli ve son iki karakteri harf olmayan adlara sahip dosyaları sil.','rm ???*[!a-zA-Z][!a-zA-Z]'],
 ['e','İkinci veya üçüncü harf','T ile başlayan, ikinci veya üçüncü karakteri e olan dosyaları sil.',"ls | grep -E '^T(e|.e)' | xargs rm"],
 ['f','Noktalama işaretlerini kaldır','File değişkeninin gösterdiği dosyayı noktalama işaretlerini kaldırarak File1 içine yaz.',"tr -d '[:punct:]' < \"$File\" > File1"],
 ['g','Büyük ve küçük harfleri değiştir','File içeriğinde küçük harfleri büyük, büyük harfleri küçük yap ve File2 içine yaz.',"tr 'a-zA-Z' 'A-Za-z' < \"$File\" > File2"]
];
for(const[n,t,d,r]of e1a)add('Exercises 1','1'+n,t,d,r,{cases:baseCases,orderIndependent:n==='a'||n==='c'});
const patterns=[
 ['a','High ile başlayan kelimeler','En az altı karakterli ve High ile başlayan kelimeli satırlar.','High[A-Za-z0-9_]{2,}'],
 ['b','En az iki alt çizgi','Bir kelimesinde en az iki alt çizgi bulunan satırlar.','[A-Za-z0-9_]*_[A-Za-z0-9_]*_[A-Za-z0-9_]*'],
 ['c','Belli karakterlerle bitmeyenler','2, 3, 4, 5, 6 veya x ile bitmeyen kelimeli satırlar.','[A-Za-z0-9_]*[A-Za-wyz01789_]'],
 ['d','Altı karakter ve uygun son','En az altı karakterli; iki küçük harf veya bir rakamla biten kelimeli satırlar.','([A-Za-z0-9_]{4,}[a-z]{2}|[A-Za-z0-9_]{5,}[0-9])'],
 ['e','Ortada rakam','Z/z içermeyen ve ilk/son karakter dışında rakam içeren kelimeli satırlar.','[A-Ya-y0-9_]+[0-9][A-Ya-y0-9_]+'],
 ['f','En çok bir rakam','En fazla bir rakam içeren kelimeli satırlar.','([A-Za-z_]+|[A-Za-z_]*[0-9][A-Za-z_]*)']
];
for(const[n,t,d,p]of patterns)add('Exercises 1','2'+n,t,d+' Dosya yolu filePath içindedir. Kelime, harf/rakam/alt çizgi dizisidir.',`grep -Ew '${p}' "$filePath"`,{page:2,cases:baseCases});
const treePaths=['Dir1a/Dir2a/Dir3a/File4a','Dir1a/Dir2a/File3a','Dir1a/Dir2a/File3b','Dir1a/Dir2b/File5a','Dir1a/File2a','Dir1a/File2b','Dir1b/Dir6a/Dir7a/File8a','Dir1b/Dir6a/Dir7a/File8b','Dir1b/Dir6a/File7a','Dir1b/Dir6b/Dir9a/File10a','Dir1b/Dir6b/Dir9a/File10b','Dir1b/Dir6b/Dir9b/Dir11a/Dir12a/File13a','Dir1b/Dir6b/Dir9b/Dir11a/Dir12a/File13b','Dir1b/Dir6b/Dir9b/Dir11a/File12a','Dir1b/Dir6b/Dir9b/Dir11a/File12b','Dir1b/Dir6b/Dir9b/Dir11b/File14a','Dir1b/Dir6b/Dir9b/File11a','Dir1b/Dir6b/Dir9c/File15a','Dir1b/Dir6b/Dir9c/File15b','Dir1b/Dir6b/File9a','Dir1b/Dir6b/File9b','Dir1b/Dir6c/File16a','Dir1b/Dir6c/File16b','Dir1b/File6a','Dir1b/File6b','File1a','File1b'];
const treeFiles=Object.fromEntries(treePaths.map(p=>[H+'/Dir/'+p,'icerik '+p.split('/').at(-1)+'\n']));
Object.assign(treeFiles,{[H+'/Dir/File1a']:sample,[H+'/Dir/Dir1a/File2a']:'A'.repeat(45)+'\nBil'+'b'.repeat(43)+'\nBi'+'c'.repeat(39)+'\n',[H+'/metin.txt']:sample,[H+'/sonuc.txt']:'onceki\n',[H+'/aranacak/a1.txt']:'1\n',[H+'/aranacak/x.txt']:'2\n',[H+'/aranacak/abc2.txt']:'3\n',[H+'/aranacak/no']:'4\n'});
const treeCase={cwd:H+'/Dir/Dir1b/Dir6b',files:treeFiles,env:{HOME:H,dirPath:H+'/aranacak',filePath:H+'/sonuc.txt',textPath:H+'/metin.txt'}};
const e13=[
 ['a','Uzak dizine kopyala','File12a dosyasını Dir7a içine newName adıyla kopyala.','cp Dir9b/Dir11a/File12a ../Dir6a/Dir7a/newName'],
 ['b','İki rakam içerenleri sil','Dir11a içindeki adında en az iki rakam olan normal dosyaları kaldır.',"find Dir9b/Dir11a -maxdepth 1 -type f -name '*[0-9]*[0-9]*' | xargs rm"],
 ['c','Yolları dosyaya ekle','dirPath altında adı en az üç karakterli ve en az bir rakam içeren dosya yollarını File15a sonuna ekle.',`find "$dirPath" -type f | grep -E '/([^/]*[0-9][^/]{2,}|[^/]+[0-9][^/]+|[^/]{2,}[0-9])$' >> Dir9c/File15a`],
 ['d','Rakamları sil, harfleri küçült','textPath rakamlarını silip harfleri küçült; Dir içine newText adıyla kaydet.',`tr -d '[:digit:]' < "$textPath" | tr 'A-Z' 'a-z' > ../../newText`],
 ['e','Noktasız adları ekle','Geçerli dizindeki nokta içermeyen adları filePath sonuna ekle.',`ls | grep -v '\\.' >> "$filePath"`],
 ['f','Kelimenin iç karakterleri','File1a içindeki, en az iki karakterli ve ilk/son karakter dışında rakam veya x/y/z içermeyen kelimeli satırları File5a sonuna ekle.',`grep -Ew '[A-Za-z0-9_][A-Za-w_]*[A-Za-z0-9_]' ../../File1a >> ../../Dir1a/Dir2b/File5a`],
 ['g','En çok iki alt çizgi','textPath içindeki en az iki karakterli ve en çok iki alt çizgi içeren kelimeli satırları lines dosyasına yaz.',`grep -Ew '([A-Za-z0-9]{2,}|[A-Za-z0-9]+_[A-Za-z0-9]*|_[A-Za-z0-9]+|[A-Za-z0-9]*_[A-Za-z0-9]*_[A-Za-z0-9]*)' "$textPath" > lines`]
];
const e14=[
 ['a','Konumu koruyarak yeniden adlandır','File3b adını bulunduğu yerde newName yap.','mv ../../Dir1a/Dir2a/File3b ../../Dir1a/Dir2a/newName'],
 ['b','Son üç karakterde rakam','Dir6c içindeki en az beş karakterli ve son üç karakterinden en az biri rakam olan dosyaları sil.',`ls ../Dir6c | grep -E '^.{5,}$' | grep -E '[0-9].{0,2}$' | while read f; do rm "../Dir6c/$f"; done`],
 ['c','Uzun txt adları','dirPath altında adı .txt ile biten ve toplam en az altı karakter olan dosya yollarını Dir6c/files.txt içine yaz.',`find "$dirPath" -name '??*.txt' > ../Dir6c/files.txt`],
 ['d','Noktalama yerine boşluk','textPath noktalama işaretlerini boşluk yap ve File13b sonuna ekle.',`tr '[:punct:]' ' ' < "$textPath" >> Dir9b/Dir11a/Dir12a/File13b`],
 ['e','Üç dosyayı birleştir','File6a, File9a, File11a içeriklerini bu sırayla filePath sonuna ekle.',`cat ../File6a File9a Dir9b/File11a >> "$filePath"`],
 ['f','Uzun kelimeleri seç','File2a içinden Bil ile başlamayan, 40–60 karakterli kelimeli satırları File10b sonuna ekle.',`grep -Ew '([^B][A-Za-z0-9_]{39,59}|B[^i][A-Za-z0-9_]{38,58}|Bi[^l][A-Za-z0-9_]{37,57})' ../../Dir1a/File2a >> Dir9a/File10b`],
 ['g','Tam üç rakam','textPath içinden tam üç rakam içeren kelimeli satırları lines dosyasına yaz.',`grep -Ew '[A-Za-z_]*[0-9][A-Za-z_]*[0-9][A-Za-z_]*[0-9][A-Za-z_]*' "$textPath" > lines`]
];
for(const[g,rows]of [['3',e13],['4',e14]])for(const[n,t,d,r]of rows)add('Exercises 1',g+n,t,d+' Başlangıç konumu Dir6b; ağaç PDF’nin 3. sayfasıyla aynıdır.',r,{page:g==='3'?4:5,cases:[treeCase],orderIndependent:['c','e'].includes(n)});
const base={dirs:[H+'/input',H+'/output'],files:{[H+'/input/alpha.txt']:'Hello, World! 123\nBIL214 99\nonly WORDS\n',[H+'/input/beta']:'bir iki uc\n',[H+'/input/names.txt']:'alpha.txt\nbeta\nmissing\n'}};
const normal=(extra={})=>({...base,...extra});
add('Exercises 2','1','99 dosya oluştur','Dizini ve öneki argümanlardan al. Önek_001’den Önek_099’a kadar 99 dosya oluştur.',`for ((i=1;i<=99;i++)); do printf -v n '%03d' "$i"; touch "$1/\${2}_$n"; done`,{cases:[normal({args:[H+'/output','File']}),normal({args:[H+'/output','Deneme']})]});
add('Exercises 2','2','Beşlik tabanda dosya adları','Dizin yolunu oku. Dizin varsa 000–444 arası üç basamaklı beşlik taban adlarıyla 125 dosya oluştur.',`read d; if [ -d "$d" ]; then for a in {0..4}; do for b in {0..4}; do for c in {0..4}; do touch "$d/$a$b$c"; done; done; done; fi`,{cases:[normal({stdin:H+'/output\n'}),normal({stdin:H+'/missing\n'})]});
add('Exercises 2','3','Verilen dizinleri listele','Argümanlardaki mevcut dizinleri listele. Olmayan her dizin için “There is no directory with the path /verilen/yol” yaz.',`for d in "$@"; do if [ -d "$d" ]; then ls "$d"; else echo "There is no directory with the path $d"; fi; done`,{cases:[normal({args:[H+'/input',H+'/none']}),normal({args:[H+'/output',H+'/input']})]});
add('Exercises 2','4','Ortalama kelime uzunluğu','Bir satır oku, ortalama kelime uzunluğunu yaz. Bu testlerde ortalama tamsayıdır; yalnız sayısal sonucu yaz.',`read -r line; sum=0; n=0; for w in $line; do sum=$((sum+\${#w})); n=$((n+1)); done; echo $((sum/n))`,{compare:'numeric',cases:[{stdin:'bir iki\n'},{stdin:'abcd efgh ijkl\n'},{stdin:'a bb ccc\n'}]});
add('Exercises 2','5','Kelimeleri uzunluklarıyla kaydet','Dosyayı ilk argümandan al. Okunan satırdaki kelimeleri “kelime uzunluk” biçiminde ayrı satırlar olarak dosyaya yaz.',`read -r line; : > "$1"; for w in $line; do echo "$w \${#w}" >> "$1"; done`,{cases:[normal({stdin:'bir iki uc\n',args:[H+'/output/words.txt']}),normal({stdin:'hello BIL214 x\n',args:[H+'/output/result']})]});
add('Exercises 2','6','Dosya adlarını büyüt','İlk argümandaki dizinin normal dosya adlarında küçük harfleri büyük yap.',`for f in "$1"/*; do [ -f "$f" ] || continue; n=\${f##*/}; upper=$(echo "$n" | tr 'a-z' 'A-Z'); [ "$n" = "$upper" ] || mv "$f" "$1/$upper"; done`,{cases:[normal({args:[H+'/input']}),{dirs:[H+'/d'],files:{[H+'/d/a file.txt']:'data',[H+'/d/MIXed']:'x'},args:[H+'/d']}]});
add('Exercises 2','7','Copy ekiyle kopyala','İki dizini argümanlardan al. İlk dizindeki normal dosyaları adlarına Copy ekleyerek ikinci dizine kopyala.',`for f in "$1"/*; do [ -f "$f" ] && cp "$f" "$2/\${f##*/}Copy"; done`,{cases:[normal({args:[H+'/input',H+'/output']}),{dirs:[H+'/a',H+'/b'],files:{[H+'/a/space name']:'test'},args:[H+'/a',H+'/b']}]});
add('Exercises 2','8','Dosyadaki harfleri say','Dosya yolunu oku. Dosyadaki İngilizce alfabe harflerinin toplam sayısını yaz.',`read f; tr -cd '[:alpha:]' < "$f" | wc -c`,{cases:[normal({stdin:H+'/input/alpha.txt\n'}),normal({stdin:H+'/input/beta\n'})]});
add('Exercises 2','9','Harf kelimelerini seç','Dosya yolunu oku. Yalnız harflerden oluşan kelimeli satırları seç, harfleri küçült ve dosya_adı_Lower_Case adına kaydet.',`read f; grep -Ew '[A-Za-z]+' "$f" | tr 'A-Z' 'a-z' > "\${f}_Lower_Case"`,{cases:[normal({stdin:H+'/input/alpha.txt\n'}),normal({stdin:H+'/input/beta\n'})]});
const stats=`sum=0; max=0; for n in "$@"; do sum=$((sum+n)); [ "$n" -le "$max" ] || max=$n; done; echo "$max $((sum/$#))"`;
add('Exercises 2','10','Argümanların maksimumu ve ortalaması','Pozitif tamsayı argümanlarından “maksimum aşağı_yuvarlanmış_ortalama” yaz.',stats,{cases:[{args:['3','8','10']},{args:['5']},{args:['99','1','50','2']}]});
add('Exercises 2','11','Satırdaki sayıların istatistiği','Bir satırdaki pozitif tamsayılardan “maksimum aşağı_yuvarlanmış_ortalama” yaz.',`read -r line; set -- $line; \${stats}`,{cases:[{stdin:'3 8 10\n'},{stdin:'5\n'},{stdin:'99 1 50 2\n'}]});
add('Exercises 2','12','Sayı üçgeni','n değerini ilk argümandan al. 1’den başlayarak her satırda bir fazla sayı yaz. Her satırı noktayla bitir.',`v=1; for ((i=1;i<=$1;i++)); do line=''; for ((j=1;j<=i;j++)); do line="$line$v "; v=$((v+1)); done; echo "\${line% }."; done`,{page:2,cases:[{args:['5']},{args:['4']},{args:['1']}]});
add('Exercises 2','13','İndisteki değer ve büyükleri','0’a kadar birer pozitif sayı oku. Sonra 0’dan başlayan bir indis oku. O değeri ve ondan büyük sayı adedini “değer adet” biçiminde yaz.',`a=(); while read n && [ "$n" -ne 0 ]; do a+=("$n"); done; read idx; count=0; for n in "\${a[@]}"; do [ "$n" -le "\${a[idx]}" ] || count=$((count+1)); done; echo "\${a[idx]} $count"`,{page:2,cases:[{stdin:'5\n10\n3\n8\n0\n0\n'},{stdin:'9\n1\n9\n0\n1\n'}]});
add('Exercises 2','14','Sıfırdan öncesini ters yaz','Bir satırda bir veya daha fazla sayı oku. İlk 0’dan öncekileri ters sırayla tek satırda yaz; 0’dan sonrasını yok say.',`a=(); stop=0; while read -r line; do for n in $line; do if [ "$n" -eq 0 ]; then stop=1; break; fi; a+=("$n"); done; [ "$stop" -eq 0 ] || break; done; for ((i=\${#a[@]}-1;i>=0;i--)); do printf '%s ' "\${a[i]}"; done; echo`,{page:2,cases:[{stdin:'1 2 3\n4 0 99\n'},{stdin:'8\n9 10\n0\n'},{stdin:'1 0\n'}]});
add('Exercises 2','15','Etikete göre filtrele','Etiketi argümandan al. “metin sayı etiket” satırlarını ilk alan Done olana kadar oku. Eşleşenlerin ilk iki alanını yaz. Son satıra eşleşen sayıların tamsayı ortalamasını yaz.',`sum=0; count=0; while read name n tag; do [ "$name" != Done ] || break; if [ "$tag" = "$1" ]; then echo "$name $n"; sum=$((sum+n)); count=$((count+1)); fi; done; echo $((sum/count))`,{page:2,cases:[{args:['C'],stdin:'Ali 10 C\nEce 20 Bash\nCan 30 C\nDone\n'},{args:['x'],stdin:'one 7 x\ntwo 9 x\nDone\n'}]});
const outputScript='x=1\ny=100\nfunction func() {\n x=$(($1 * $3))\n local y=$(($2 + $#))\n false\n echo "$x $y $?"\n echo $((y = $4))\n x=$0\n echo "$x $y $?"\n return 5\n true\n echo "$x $y $?"\n}\nfunc 10 20 30 40 50\necho "$x $y $?"';
add('Exercises 2','16','Betiğin çıktısını tahmin et','Soru16.sh çıktısını satır satır yaz. Betik “bash Soru16.sh” olarak çağrılmıştır. Boş satır varsa --blank-- yaz.',outputScript,{page:2,mode:'prediction',script:outputScript,starter:'',tests:[{name:'Çıktı tahmini',expected:'300 25 1\n40\nSoru16.sh 40 0\nSoru16.sh 100 5\n',stdin:'',args:[]}],cases:[]});
add('Exercises 2','17','İsim listesinden kopyala','Kaynak dizini argümandan al. Mevcut bir dosya yolu girilene kadar oku. Bu dosyadaki adlardan kaynak dizinde bulunanları geçerli dizinin üstüne Copy ekiyle kopyala. Kopya sayısını yaz.',`while read f; do [ -f "$f" ] && break; done; count=0; while read n; do if [ -f "$1/$n" ]; then cp "$1/$n" "../\${n}Copy"; count=$((count+1)); fi; done < "$f"; echo "$count"`,{page:2,cases:[normal({args:[H+'/input'],stdin:H+'/none\n'+H+'/input/names.txt\n'}),normal({args:[H+'/input'],stdin:H+'/input/names.txt\n'})]});
add('Exercises 2','18','Her kelimeyi ayrı satıra yaz','Dizini argümandan al. Geçerli dosya adı girilene kadar oku. Kelimelerini ayrı satırlara yazarak aynı dizinde adına Words ekli dosya oluştur. Kelime sayısını yaz.',`while read n; do [ -f "$1/$n" ] && break; done; count=0; : > "$1/\${n}Words"; for w in $(cat "$1/$n"); do echo "$w" >> "$1/\${n}Words"; count=$((count+1)); done; echo "$count"`,{page:3,cases:[normal({args:[H+'/input'],stdin:'missing\nbeta\n'}),normal({args:[H+'/input'],stdin:'alpha.txt\n'})]});
add('Exercises 2','19','Aralıktaki değerleri seç','0’a kadar birer sayı, sonra alt ve üst sınırları oku. Sınırların kesin arasındakileri “Index: i Value: n” biçiminde yaz. Son satır “Average is n” olsun. İndisler 0’dan başlar.',`a=(); while read n && [ "$n" -ne 0 ]; do a+=("$n"); done; read lo; read hi; sum=0; count=0; for ((i=0;i<\${#a[@]};i++)); do n=\${a[i]}; if [ "$n" -gt "$lo" ] && [ "$n" -lt "$hi" ]; then echo "Index: $i Value: $n"; sum=$((sum+n)); count=$((count+1)); fi; done; echo "Average is $((sum/count))"`,{page:3,cases:[{stdin:'10\n20\n1\n3\n5\n7\n9\n11\n13\n15\n17\n0\n5\n17\n'},{stdin:'1\n4\n6\n9\n0\n3\n7\n'}]});
add('Exercises 2','20','Palindrom ve çıkış kodu','0’a kadar birer pozitif sayı oku. Palindromsa exit 1, değilse exit 2 ile bitir. Yalnızca çıkış kodu değerlendirilir.',`a=(); while read n && [ "$n" -ne 0 ]; do a+=("$n"); done; for ((i=0;i<\${#a[@]}/2;i++)); do j=$((\${#a[@]}-1-i)); [ "\${a[i]}" = "\${a[j]}" ] || exit 2; done; exit 1`,{page:3,ignoreStdout:true,cases:[{stdin:'10\n15\n50\n88\n50\n15\n10\n0\n'},{stdin:'10\n15\n50\n25\n10\n0\n'},{stdin:'7\n0\n'}]});
