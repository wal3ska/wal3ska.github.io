const lit=JSON.stringify;
const arr=a=>`{${a.join(',')}}`;
const out=a=>a.join(' ')+'\n';
export const cQuestions=[];
function fn(set,n,title,description,signature,cases,solution,hint){
  const name=`soru${String(n).padStart(2,'0')}`;
  const declaration=signature.replace('FN',name);
  const prefix='#include <stdio.h>\n#include <stddef.h>\n#include <string.h>\n#ifdef SIZE_MAX\n#undef SIZE_MAX\n#endif\n#define SIZE_MAX 10\n';
  const harness='\nvoid bil_print(int *a,int n){for(int i=0;i<n;i++)printf("%s%d",i?" ":"",a[i]);puts("");}\n'+
    'int main(void){int test=0;scanf("%d",&test);switch(test){'+
    cases.map((c,i)=>`case ${i}: {${c.body.replaceAll('FN',name)} break;}`).join('\n')+'}return 0;}';
  cQuestions.push({id:`c${set}-${n}`,language:'c',set:`Exercises ${set}`,number:name,title,description,
    source:`Exercises_0${set}.pdf`,page:1,mode:'function',compare:'exact',prefix,harness,
    starter:`${set===3?'// Diziler ve karakter dizileri':'// İşaretçiler'}\n${declaration} {\n    // Çözümünü buraya yaz.\n${/^int |^char\*/.test(declaration)?'    return 0;\n':''}}\n`,
    tests:cases.map((c,i)=>({name:c.name,stdin:String(i)+'\n',args:[],expected:c.expected,display:c.display||c.name})),
    solution:solution.replaceAll('FN',name),hint,
    note:set===4?'PDF’deki değişken tanımlama sınırlarına dikkat et. Otomatik kontrol, çıktı ve dönüş değerini sınar; değişken sayısını ve algoritma kısıtlarını notlandırmaz.':'Yalnızca verilen fonksiyonu tamamla. main test sistemi tarafından eklenir. O(n) ve izin verilen fonksiyon koşullarını PDF’den kontrol et.'});
}
fn(3,1,'Bir karakteri sil','s dizisindeki c karakterinin tüm tekrarlarını kaldır ve silinen karakter sayısını döndür. Tek geçişli O(n) bir çözüm hedefle.',
  'int FN(char s[], char c)',
  [['Computer Engineering','e'],['banana','a'],['aaaa','a'],['BIL214','x'],['','z']].map(([s,c])=>({name:s?`${s} → ${c}`:'Boş dizi',display:`s = ${lit(s)}, c = '${c}'`,body:`char s[128]=${lit(s)};int n=FN(s,'${c}');printf("%s\\n%d\\n",s,n);`,expected:s.split(c).join('')+'\n'+(s.length-s.split(c).join('').length)+'\n'})),
  `int FN(char s[],char c){int r=0,w=0;for(;s[r];r++)if(s[r]!=c)s[w++]=s[r];s[w]=0;return r-w;}`,
  'Okuma ve yazma için iki indis kullan. Sonlandırıcıyı (\\0) yeni sona taşımayı unutma.');
fn(3,2,'Harf frekansları','Büyük ve küçük harfleri birlikte sayarak 26 İngilizce harfin frekansını frequencies dizisine yaz.',
  'void FN(char s[], int frequencies[26])',
  ['System Programming','AaBbZz! 123','aaaa','', 'xyz XYZ'].map(s=>{const f=Array(26).fill(0);for(const c of s.toLowerCase())if(c>='a'&&c<='z')f[c.charCodeAt(0)-97]++;return{name:lit(s),body:`char s[]=${lit(s)};int f[26];for(int i=0;i<26;i++)f[i]=77;FN(s,f);bil_print(f,26);`,expected:out(f)};}),
  `void FN(char s[],int f[26]){for(int i=0;i<26;i++)f[i]=0;for(int i=0;s[i];i++){char c=s[i];if(c>='A'&&c<='Z')c+='a'-'A';if(c>='a'&&c<='z')f[c-'a']++;}}`,
  'Frekans dizisinin başlangıç değerlerini sıfırla. Harfin alfabedeki konumu dizi indisini verir.');
fn(3,3,'Tekleri ve çiftleri ayır','A dizisindeki çift ve tek sayıları sıralarını koruyarak evens ve odds dizilerine yaz. Çift sayı adedini döndür.',
  'int FN(int A[], int size, int evens[], int odds[])',
  [[-3,-1,0,1,99,2,22,34,3],[-4,-2,0,8],[1,3,5],[42],[-7,-8]].map(a=>({name:out(a).trim(),body:`int a[]=${arr(a)},e[100]={0},o[100]={0};int n=FN(a,${a.length},e,o);if(n<0||n>${a.length}){puts("Gecersiz adet");break;}printf("%d\\n",n);bil_print(e,n);bil_print(o,${a.length}-n);`,expected:[a.filter(x=>x%2===0).length,a.filter(x=>x%2===0).join(' '),a.filter(x=>x%2!==0).join(' ')].join('\n')+'\n'})),
  `int FN(int A[],int size,int e[],int o[]){int n=0,m=0;for(int i=0;i<size;i++)if(A[i]%2==0)e[n++]=A[i];else o[m++]=A[i];return n;}`,
  'Negatif tek sayılarda % 2 işlemi -1 dönebilir. Çiftlik için sıfıra eşitliği kontrol et.');
fn(3,4,'Sıralı dizileri birleştir','Artan sıralı A1 ve A2 dizilerini, tekrarları koruyarak artan sıralı B dizisinde birleştir. Karmaşıklık O(n) olmalı.',
  'void FN(int A1[], int size1, int A2[], int size2, int B[])',
  [[[-5,0,2,2,8],[-3,0,2,7]],[[1],[2]],[[3,4],[1,2]],[[1,1],[1,1]],[[-8,-2],[0,9,10]]].map(([a,b])=>({name:`${a.join(', ')} + ${b.join(', ')}`,body:`int a[]=${arr(a)},b[]=${arr(b)},r[100]={0};FN(a,${a.length},b,${b.length},r);bil_print(r,${a.length+b.length});`,expected:out([...a,...b].sort((x,y)=>x-y))})),
  `void FN(int a[],int n,int b[],int m,int r[]){int i=0,j=0,k=0;while(i<n&&j<m)r[k++]=a[i]<b[j]?a[i++]:b[j++];while(i<n)r[k++]=a[i++];while(j<m)r[k++]=b[j++];}`,
  'İki dizinin başındaki küçük elemanı seç. Dizilerden biri bitince diğerinin kalanını ekle.');
fn(3,5,'Karakter dizisini ters çevir','s dizisini yerinde ters çevir. Karmaşıklık O(n) olmalı.',
  'void FN(char s[])',
  ['System Programming','abcde','ab','x',''].map(s=>({name:lit(s),body:`char s[128]=${lit(s)};FN(s);puts(s);`,expected:[...s].reverse().join('')+'\n'})),
  `void FN(char s[]){int n=0;while(s[n])n++;for(int i=0;i<n/2;i++){char c=s[i];s[i]=s[n-i-1];s[n-i-1]=c;}}`,
  'Baştaki ve sondaki karakterleri yer değiştirerek ortaya doğru ilerle.');
fn(3,6,'Sayı tabanını dönüştür','Pozitif ondalık x sayısını base tabanına çevir ve s dizisine yaz. 10–35 basamakları için A–Z kullan.',
  'void FN(int x, char s[], int base)',
  [[211791583,5],[211791583,16],[745121879,36],[17,2],[35,36],[1,2]].map(([x,b])=>({name:`${x}, taban ${b}`,body:`char s[128]={0};FN(${x},s,${b});puts(s);`,expected:x.toString(b).toUpperCase()+'\n'})),
  `void FN(int x,char s[],int base){int n=0;do{int d=x%base;s[n++]=d<10?'0'+d:'A'+d-10;x/=base;}while(x);s[n]=0;for(int i=0;i<n/2;i++){char t=s[i];s[i]=s[n-i-1];s[n-i-1]=t;}}`,
  'Kalanlar basamakları sondan başa üretir. PDF 1–36 diyor; konumsal sayı sistemi için bu atölye 2–36 aralığını test eder.');
fn(3,7,'Son alt dizinin indisi','s2 metninin s1 içindeki son geçtiği yerin başlangıç indisini döndür. Bulunamazsa -1 döndür.',
  'int FN(char s1[], char s2[])',
  [['Data Structure','ta S'],['Computer Engineering','in'],['aaaa','aa'],['abc','x'],['abc','abc']].map(([s,t])=>({name:`${lit(s)} / ${lit(t)}`,body:`char s[]=${lit(s)},t[]=${lit(t)};printf("%d\\n",FN(s,t));`,expected:s.lastIndexOf(t)+'\n'})),
  `int FN(char s[],char t[]){int last=-1;for(int i=0;s[i];i++){int j=0;while(t[j]&&s[i+j]&&s[i+j]==t[j])j++;if(!t[j])last=i;}return last;}`,
  'İlk eşleşmede durma; yeni eşleşme buldukça son konumu güncelle.');
fn(3,8,'Satır ve sütun toplamları','A matrisinin satır toplamlarını rowSums, sütun toplamlarını colSums dizisine yaz. Satır genişliği SIZE_MAX = 10.',
  'void FN(int A[][SIZE_MAX], int rowSize, int colSize, int rowSums[], int colSums[])',
  [[[1,2,3],[4,5,6]],[[10]],[[0,-5,10],[7,8,-2],[3,0,1]],[[1,2,3,4,5,6,7,8,9,10]]].map(a=>({name:`${a.length} × ${a[0].length} matris`,body:`int a[][SIZE_MAX]={${a.map(arr).join(',')}},r[10]={0},c[10]={0};FN(a,${a.length},${a[0].length},r,c);bil_print(r,${a.length});bil_print(c,${a[0].length});`,expected:out(a.map(row=>row.reduce((s,x)=>s+x,0)))+out(a[0].map((_,i)=>a.reduce((s,row)=>s+row[i],0)))})),
  `void FN(int a[][SIZE_MAX],int n,int m,int r[],int c[]){for(int i=0;i<n;i++)r[i]=0;for(int j=0;j<m;j++)c[j]=0;for(int i=0;i<n;i++)for(int j=0;j<m;j++){r[i]+=a[i][j];c[j]+=a[i][j];}}`,
  'Fiziksel satır genişliği ile kullanılan sütun sayısı farklı olabilir.');
fn(4,1,'Harflerin boyutunu değiştir','Büyük harfleri küçük, küçük harfleri büyük yap. Yeni değişken tanımlama.',
  'void FN(char* s)',
  ['Linear Algebra','@gmail','BIL 214','aAzZ09!',''].map(s=>({name:lit(s),body:`char s[]=${lit(s)};FN(s);puts(s);`,expected:[...s].map(c=>c>='a'&&c<='z'?c.toUpperCase():c>='A'&&c<='Z'?c.toLowerCase():c).join('')+'\n'})),
  `void FN(char*s){for(;*s;s++)if(*s>='a'&&*s<='z')*s+='A'-'a';else if(*s>='A'&&*s<='Z')*s+='a'-'A';}`,
  'İşaretçiyi doğrudan ilerletebilir ve işaret edilen karakteri değiştirebilirsin.');
for(const n of [2,3,4,5]){
  const titles={2:'İlk karakterin adresi',3:'Son karakterin adresi',4:'İşaretçiyle tekrar sayısı',5:'İşaretçiyle karakter silme'};
  const sig={2:'char* FN(char* s, const char c)',3:'void FN(char* s, const char c, char** p)',4:'void FN(char* s, const char c, int* count)',5:'void FN(char* s, const char c, int* cnt)'};
  const descriptions={2:'c karakterinin ilk bulunduğu adresi döndür; yoksa NULL. Yeni değişken tanımlama.',3:'c karakterinin son bulunduğu adresi *p içine yaz; yoksa NULL. Yeni değişken tanımlama.',4:'c karakterinin tekrar sayısını *count içine yaz. Yeni değişken tanımlama.',5:'c karakterinin tüm tekrarlarını s içinden sil ve silme sayısını *cnt içine yaz. Yeni değişken tanımlama.'};
  const sols={2:`char* FN(char*s,const char c){while(*s&&*s!=c)s++;return *s?s:NULL;}`,
    3:`void FN(char*s,const char c,char**p){*p=NULL;while(*s){if(*s==c)*p=s;s++;}}`,
    4:`void FN(char*s,const char c,int*count){*count=0;while(*s){if(*s==c)(*count)++;s++;}}`,
    5:`void FN(char*s,const char c,int*cnt){*cnt=0;while(*s){if(*s==c)(*cnt)++;else *(s-*cnt)=*s;s++;}*(s-*cnt)=0;}`};
  fn(4,n,titles[n],descriptions[n],sig[n],
    [['Computer Engineering','e'],['banana','a'],['---Linux---','-'],['abc','x'],['','x']].map(([s,c])=>({name:`${lit(s)} / '${c}'`,body:`char s[128]=${lit(s)};`+(n===2?`char*p=FN(s,'${c}');printf("%d\\n",p?(int)(p-s):-1);`:n===3?`char*p=NULL;FN(s,'${c}',&p);printf("%d\\n",p?(int)(p-s):-1);`:n===4?`int count=99;FN(s,'${c}',&count);printf("%d\\n",count);`:`int count=99;FN(s,'${c}',&count);printf("%s\\n%d\\n",s,count);`),expected:(n===2?s.indexOf(c):n===3?s.lastIndexOf(c):n===4?s.length-s.split(c).join('').length:s.split(c).join('')+'\n'+(s.length-s.split(c).join('').length))+'\n'})),sols[n],
    'Adres ile o adreste saklanan değer farklıdır. Fonksiyonun dönüş türünü ve işaretçi seviyesini kontrol et.');
}
fn(4,6,'ASCII sırasıyla karşılaştır','İki dizi eşitse 0, s1 önce geliyorsa -1, s2 önce geliyorsa 1 döndür. Yeni değişken tanımlama.',
  'int FN(char* s1, char* s2)',
  [['Data Science','Deep Learning'],['abc','ab'],['A','a'],['same','same'],['','x'],['x','']].map(([s,t])=>({name:`${lit(s)} / ${lit(t)}`,body:`char a[]=${lit(s)},b[]=${lit(t)};printf("%d\\n",FN(a,b));`,expected:(s===t?0:s<t?-1:1)+'\n'})),
  `int FN(char*a,char*b){while(*a&&*a==*b){a++;b++;}return *a==*b?0:(*a<*b?-1:1);}`,
  'Ortak önek bittiğinde ilk farklı karakteri karşılaştır. Sonlandırıcı da karşılaştırmaya katılır.');
fn(4,7,'Palindrom kontrolü','Dizi iki yönden aynı okunuyorsa 1, değilse 0 döndür. Yalnızca bir işaretçi tanımlayabilirsin.',
  'int FN(char* s)',
  ['ABCDEEDCBA','A _.5._ A','123 .4 321','12a__-P-__a21','x',''].map(s=>({name:lit(s),body:`char s[]=${lit(s)};printf("%d\\n",FN(s));`,expected:(s===[...s].reverse().join('')?1:0)+'\n'})),
  `int FN(char*s){char*p=s;while(*p)p++;if(p==s)return 1;for(p--;s<p;s++,p--)if(*s!=*p)return 0;return 1;}`,
  'Boşluklar ve noktalama işaretleri de karakterdir; karşılaştırmadan çıkarmamalısın.');
fn(4,8,'En büyük elemanın adresi','A dizisinin en büyük elemanının adresini *addr içine yaz. Bir işaretçi dışında değişken tanımlama.',
  'void FN(int* A, const int size, int** addr)',
  [[-3,99,5,8],[-8,-2,-4],[7],[1,2,30,4]].map(a=>({name:out(a).trim(),body:`int a[]=${arr(a)};int*p=NULL;FN(a,${a.length},&p);printf("%d\\n",p?*p:-99999);printf("%d\\n",p>=a&&p<a+${a.length});`,expected:Math.max(...a)+'\n1\n'})),
  `void FN(int*A,const int size,int**addr){int*p=A;*addr=A;for(;p<A+size;p++)if(*p>**addr)*addr=p;}`,
  'Sonuç, dizinin içindeki gerçek bir elemanın adresi olmalı.');
fn(4,9,'Matrisin en küçük değeri','A matrisinin en küçük değerini *minPtr içine yaz. Bir işaretçi dışında değişken tanımlama.',
  'void FN(int A[][SIZE_MAX], const int rowSize, const int colSize, int* minPtr)',
  [[[5,8,2],[9,-11,7]],[[8,6,4]],[[42]],[[-2,-8],[-5,-1],[-9,-3]]].map(a=>({name:`${a.length} × ${a[0].length}`,body:`int a[][SIZE_MAX]={${a.map(arr).join(',')}},n=999;FN(a,${a.length},${a[0].length},&n);printf("%d\\n",n);`,expected:Math.min(...a.flat())+'\n'})),
  `void FN(int A[][SIZE_MAX],const int rows,const int cols,int*minPtr){int*p=&A[0][0];*minPtr=*p;for(;p<&A[0][0]+rows*SIZE_MAX;p++)if((p-&A[0][0])%SIZE_MAX<cols&&*p<*minPtr)*minPtr=*p;}`,
  'Her satır bellekte SIZE_MAX eleman kaplar. Kullanılmayan sütunları hesaba katma.');
fn(4,10,'Metin dizisinin uzunlukları','s dizisindeki her metnin uzunluğunu A dizisine yaz. Bir tamsayı ve bir işaretçi tanımlayabilirsin.',
  'void FN(char* s[], const int size, int* A)',
  [['System Programming','Deep Learning','@gmail'],['','a','abc'],['BIL214'],['one two','!','12345']].map(a=>({name:a.map(lit).join(', '),body:`char*s[]={${a.map(lit).join(',')}};int a[20]={0};FN(s,${a.length},a);bil_print(a,${a.length});`,expected:out(a.map(s=>s.length))})),
  `void FN(char*s[],const int size,int*A){int i;char*p;for(i=0;i<size;i++){A[i]=0;for(p=s[i];*p;p++)A[i]++;}}`,
  'Her metin için sayacı sıfırla; her dizinin kendi sonlandırıcısına kadar ilerle.');

function program(n,title,description,starter,tests,solution,page){
  cQuestions.push({id:`c5-${n}`,language:'c',set:'Exercises 5',number:`Soru ${n}`,title,description,source:'Exercises_05.pdf',page,mode:'program',starter,tests,solution,
    note:'main dahil tüm programı yaz. Çıktıda yalnızca sonuçları yaz; ek giriş istemi yazma. PDF’deki yardımcı fonksiyon, döngü ve değişken sınırları ayrıca uygulanmalıdır. Otomatik kontrol yalnızca davranışı sınar.',hint:'Önce yardımcı fonksiyonları ayrı ayrı düşün, sonra main akışını kur.'});
}
program(1,'İşaretçilerle seçmeli sıralama','0 girilene kadar pozitif sayıları oku. swap, isSorted ve indexOfMin fonksiyonlarını kullanarak artan sıraya koy. Sonuçta durdurucu 0 değerini yazdırma.',
  '#include <stdio.h>\n#define MAX_SIZE 500\n\nvoid swap(int *x, int *y) {\n}\nvoid isSorted(int *A, int *p) {\n}\nvoid indexOfMin(int *A, int *p) {\n}\nint main(void) {\n    // Girdiyi oku, sırala ve yazdır.\n    return 0;\n}\n',
  [[7,5,8,9,2,8,2,4,6,1,3,2,5,7],[1,2,3],[9],[4,4,1,4],[5,4,3,2,1]].map(a=>({name:a.join(', '),stdin:[...a,0].join('\n')+'\n',args:[],expected:out([...a].sort((a,b)=>a-b))})),
  '#include <stdio.h>\nint main(){int a[500],n=0,x;while(scanf("%d",&x)==1&&x)a[n++]=x;for(int i=0;i<n;i++)for(int j=i+1;j<n;j++)if(a[j]<a[i]){int t=a[i];a[i]=a[j];a[j]=t;}for(int i=0;i<n;i++)printf("%d ",a[i]);puts("");return 0;}',1);
program(2,'Metni parçalara ayır','Küçük harflerden oluşan bir metin ve ayırıcı karakter oku. Geçersiz girişleri tekrar iste. Her parçayı “uzunluk metin” biçiminde yaz; boş parçalar için 0 yaz.',
  '#include <stdio.h>\n#define MAX_SIZE 500\n\nvoid findLength(char *s, int *p) {\n}\nvoid isAllLowerChars(char *s, int *p) {\n}\nvoid findCharFirstLoc(char *s, char c, char **p) {\n}\nint main(void) {\n    return 0;\n}\n',
  [['quizeprogramealleaeanenoteepiclike','e'],['abaca','a'],['hello','x'],['aaa','a']].map(([s,c])=>({name:`${s} / ${c}`,stdin:`${s} ${c}\n`,args:[],expected:s.split(c).map(t=>`${t.length}${t?' '+t:''}`).join('\n')+'\n'})).concat([{name:'Geçersiz girdiyi tekrar oku',stdin:'HELLO e\nabaca a\n',args:[],expected:'0\n1 b\n1 c\n0\n'}]),
  '#include <stdio.h>\nint main(){char s[500],c;int ok;do{if(scanf("%499s %c",s,&c)!=2)return 1;ok=c>=\'a\'&&c<=\'z\';for(int i=0;s[i];i++)if(s[i]<\'a\'||s[i]>\'z\')ok=0;}while(!ok);int start=0;for(int i=0;;i++)if(s[i]==c||!s[i]){int end=!s[i];s[i]=0;printf("%d %s\\n",i-start,s+start);start=i+1;if(end)break;}return 0;}',2);
program(3,'Karakterin en uzak son konumu','Komut satırındaki metinlerden, okunan karakterin son görülme indisi en büyük olanı seç. Eşitlikte ilk metni seç. “metin indis” yazdır.',
  '#include <stdio.h>\n\nvoid charLastLoc(char **s, const char c, char **ptr) {\n}\nvoid stringWithLargestLastLoc(char **s, const int N, const char c, int *idx, char ***addr) {\n}\nint main(int argc, char *argv[]) {\n    return 0;\n}\n',
  [[['Emel','Nisa','Kemal','Zeliha','Aleyna'],'a'],[['banana','alpha','data'],'a'],[['ax','bx','c'],'x'],[['a','ba','caa'],'a']].map(([a,c])=>{const best=a.reduce((r,s)=>s.lastIndexOf(c)>r.lastIndexOf(c)?s:r,a[0]);return{name:a.join(' '),args:a,stdin:c+'\n',expected:`${best} ${best.lastIndexOf(c)}\n`};}),
  '#include <stdio.h>\nint main(int argc,char**argv){char c;scanf(" %c",&c);int best=-1,k=1;for(int i=1;i<argc;i++)for(int j=0;argv[i][j];j++)if(argv[i][j]==c&&j>best){best=j;k=i;}printf("%s %d\\n",argv[k],best);return 0;}',3);
program(4,'Dizileri en büyüklerine göre sırala','M ve N değerlerini standart girdiden oku. M×N komut satırı sayısından M dizi oluştur. Dizilerin iç sırasını koruyarak en büyük elemanlarına göre büyükten küçüğe sırala.',
  '#include <stdio.h>\n#include <stdlib.h>\n\n// PDF’deki swap, str2int, addressOfMax, indexOfMax,\n// arrayWithLargerMax1/2 ve sort fonksiyonlarını ekle.\nint main(int argc, char *argv[]) {\n    int M, N;\n    scanf("%d %d", &M, &N);\n    return 0;\n}\n',
  [[[1,2,4,6,8],[1,3,5,7,9],[10,15,20,25,30],[18,22,24,40,35]],[[1,8],[9,2],[3,7]],[[5,1],[5,2],[4,3]],[[42]]].map(a=>({name:`${a.length} × ${a[0].length}`,stdin:`${a.length}\n${a[0].length}\n`,args:a.flat().map(String),expected:[...a].sort((a,b)=>Math.max(...b)-Math.max(...a)).map(out).join('')})),
  '#include <stdio.h>\n#include <stdlib.h>\nint main(int argc,char**argv){int m,n;scanf("%d%d",&m,&n);int a[500][500],order[500],max[500];for(int i=0;i<m;i++){order[i]=i;max[i]=0;for(int j=0;j<n;j++){a[i][j]=atoi(argv[1+i*n+j]);if(a[i][j]>max[i])max[i]=a[i][j];}}for(int i=1;i<m;i++){int j=i;while(j>0&&max[order[j]]>max[order[j-1]]){int t=order[j];order[j]=order[j-1];order[j-1]=t;j--;}}for(int i=0;i<m;i++){for(int j=0;j<n;j++)printf("%d ",a[order[i]][j]);puts("");}return 0;}',4);
