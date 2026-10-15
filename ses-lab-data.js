/* ═══════════════════════════════════════════════════════════════════════
   Ses Lab — ders içeriği üretici
   1. sınıf ilk okuma-yazma: ses grupları (Türkiye Yüzyılı Maarif Modeli)
   Bir sesin etkinliklerinde yalnızca o sese kadar öğrenilmiş sesler kullanılır.
   Hem tarayıcıda (window.SesData) hem Node'da (module.exports) çalışır.
   ═══════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  const GROUPS = [
    ['a', 'n', 'e', 't', 'i', 'l'],
    ['o', 'k', 'u', 'r', 'ı', 'm'],
    ['ü', 's', 'ö', 'y', 'd', 'z'],
    ['ç', 'b', 'g', 'c', 'ş'],
    ['p', 'h', 'v', 'ğ', 'f', 'j']
  ];
  const ORDER = GROUPS.flat();
  const VOWELS = new Set(['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü']);
  const isVowel = ch => VOWELS.has(ch);

  // Üretilen hece/kelimelerde asla çıkmaması gerekenler (uygunsuz ya da çocuklar için seçilmeyecek)
  const BLOCK = new Set([
    'am', 'amı', 'ame', 'sik', 'sık', 'siki', 'göt', 'bok', 'piç', 'sıç', 'kıç', 'çiş', 'döl', 'öl', 'oç',
    'it', 'mal', 'ibne', 'yarak', 'taşak', 'daşak', 'amk', 'sok', 'öle', 'ölü', 'kan', 'bun', 'pis'
  ]);

  // Çocukların tanıdığı basit kelimeler (küçük harf). Her ses için süzgeçten geçirilir.
  const WORDS = `
    ana anne ata at et en an ne ete nane nene nine tane tente ten net ant tat ani ilan inat inan alet
    lale tel ile tatil anlat anla elle ilet etli atla atlet lila ela al el il in anten nal alt alan aile elli
    okul kutu kale kalem kek kum kumru kurt koku kol kalın korku oku okur mama mum mor kim ılık ırmak ırk
    rakam renk un ok on kar kartal kart ekmek elma emek tekne ekim kural mutlu tatlı tamam tarla armut umut
    mart nar kır kırk tırtıl tren limon okumak koru kirli makarna karton koltuk kamera korna kanal marul
    orman kuru kırık kalk otur tamir makine kemer tarak ekran metro oto motor ilk mini minik kare karne
    kertenkele kulak kanat tilki nokta iki altı atkı arı inek kalemlik mutluluk
    süt söz sel ses su sır saat sarı sıra simit soru dans ders ayı ayna yemek yumurta uyku uzun köy süslü
    düz kedi dede dayı teyze kız kuzu zil zor zeytin toz tuz muz kaz deniz yüzük yol yel yaz yüz yıl dut
    dün düdük ördek öykü oyun ödül masa sinema sandal dost dünya durak dolu duman dondurma domates dikkat
    dinle yatak yastık yıldız yeni yürü yüzme serin sayı sokak salı sandık döner özel örtü zaman kiraz kazak
    kuyruk kayık kaya kumsal kırmızı mısır masal maske uzay ayak dere yüksek sözlük müze müzik ütü üzüm
    ülke üst örnek kömür dört yedi dokuz sekiz otuz diz dil dümen ateş
    çay çiçek çanta çocuk çorba çam baba balık bebek bal boya bulut gece göl gemi güneş göz gül cam cep
    ceket şeker kuş taş iş aş kaş diş beş bacak böcek bıçak bisiklet gömlek güzel gelin ışık boş çok genç
    cuma can ceylan bilgi şişe çubuk çizgi biber bulgur kabak sabun kibrit bayrak oyuncak karınca incir
    ince üç çilek çatı çatal çadır çizme çöl çene bardak balon boncuk bulmaca börek burun bina beyaz baş
    buz bez gök gümüş gitar geyik gazete cüce cami cümle şemsiye şarkı şimşek şelale bulaşık kardeş
    arkadaş aşçı kaşık tabak balina keçi baykuş kelebek örümcek ilaç bir
    para pasta pil top kitap kapı sepet kapak ip hava hala halı hediye horoz ev av ova vazo havuç tavuk
    vapur ağaç dağ yağ sağ soğuk doğa yoğurt öğretmen ağız kağıt fil fare fener fındık kafa harf futbol
    jilet jeton jöle plaj garaj bej aferin telefon kahve sahil hafif pembe pamuk patates peynir pide
    portakal penguen papağan pencere pazar posta pul kirpi köpek kurbağa kaplumbağa şapka sincap dolap
    kitaplık mektup çorap tepe hayvan hamur hırka hemşire hastane havlu sabah öğlen deve ceviz cetvel
    civciv tavşan meyve sevgi ödev vagon voleybol yağmur ağabey fırın fırça fincan fasulye kafes sofra
    sınıf zürafa fotoğraf jimnastik jüri pijama bagaj masaj mesaj
  `.split(/\s+/).filter(Boolean);

  // ─────────────────────────── yardımcılar ───────────────────────────
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const uniq = arr => [...new Set(arr)];
  const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

  function knownSet(letter) {
    const i = ORDER.indexOf(letter);
    return new Set(ORDER.slice(0, i + 1));
  }
  function usesOnly(word, set) {
    for (const ch of word) if (!set.has(ch)) return false;
    return true;
  }
  // Türkçe heceleme: iki ünlü arasındaki ünsüzlerden yalnızca sonuncusu sonraki heceye geçer.
  function syllabify(word) {
    const v = [];
    for (let i = 0; i < word.length; i++) if (isVowel(word[i])) v.push(i);
    if (v.length < 2) return [word];
    const out = [];
    let start = 0;
    for (let k = 0; k < v.length - 1; k++) {
      const a = v[k], b = v[k + 1];
      const cut = (b - a - 1 === 0) ? b : b - 1;
      out.push(word.slice(start, cut));
      start = cut;
    }
    out.push(word.slice(start));
    return out;
  }
  // Ğ hiçbir zaman hece başında kullanılmaz (Türkçede kelime/hece ğ ile başlamaz).
  const okItem = s => !BLOCK.has(s) && !/^ğ/.test(s);

  /** Hedef sesi aynı türden (ünlü/ünsüz) başka bir sesle değiştirerek “benzer ama yanlış” çeldirici üretir. */
  function minimalPair(item, L, known, exclude, rnd) {
    const sameType = [...known].filter(c => c !== L && isVowel(c) === isVowel(L) && c !== 'ğ');
    const cands = [];
    for (let i = 0; i < item.length; i++) {
      if (item[i] !== L) continue;
      for (const c of sameType) {
        const s = item.slice(0, i) + c + item.slice(i + 1);
        if (!exclude.has(s) && okItem(s)) cands.push(s);
      }
    }
    if (!cands.length) {
      // hedef sesin türünde başka ses yoksa diğer harflerden birini değiştir
      for (let i = 0; i < item.length; i++) {
        if (item[i] === L) continue;
        const pool = [...known].filter(c => c !== item[i] && isVowel(c) === isVowel(item[i]) && c !== 'ğ');
        for (const c of pool) {
          const s = item.slice(0, i) + c + item.slice(i + 1);
          if (!exclude.has(s) && okItem(s)) cands.push(s);
        }
      }
    }
    return cands.length ? pick(cands, rnd) : null;
  }

  /**
   * Hızlı okuma basamakları (çalışma kağıdındaki gibi):
   *  kısa öğeler harf harf: t → ta → tat
   *  kelimeler hece hece:   ta → tan → tane,  kar → karton
   */
  function ladderFor(item) {
    if (item.length <= 3) {
      const cells = [];
      for (let n = 1; n <= item.length; n++) cells.push(item.slice(0, n));
      return cells;
    }
    const syl = syllabify(item);
    const cells = [];
    let acc = '';
    for (let i = 0; i < syl.length - 1; i++) {
      acc += syl[i];
      cells.push(acc);
      const next = syl[i + 1][0];
      // açık heceden sonra bir sonraki ünsüzü de ekle: ta → tan
      if (isVowel(acc[acc.length - 1]) && next && !isVowel(next)) cells.push(acc + next);
    }
    cells.push(item);
    return uniq(cells).slice(-4);
  }

  function chunk(arr, n) {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  }

  // ─────────────────────────── ders üretici ───────────────────────────
  /**
   * Bir ses için etaplar üretir.
   * Etap türleri: 'drag' (baloncuk → yuva) ve 'reading' (hızlı okuma kartları).
   * drag etabında her tur: { slots: [...], extras: [...], word?: 'tane' }
   */
  function buildLesson(L, rnd = Math.random) {
    if (!ORDER.includes(L)) throw new Error('Bilinmeyen ses: ' + L);
    const known = knownSet(L);
    const knownV = [...known].filter(isVowel);
    const knownC = [...known].filter(c => !isVowel(c));
    const others = [...known].filter(c => c !== L);
    const words = uniq(WORDS.filter(w => w.includes(L) && usesOnly(w, known) && !BLOCK.has(w)));
    const allKnownWords = uniq(WORDS.filter(w => usesOnly(w, known) && !BLOCK.has(w)));
    const stages = [];

    // ── Etap 1: Tek ses — aynı baloncuktan en az 2 tane ──
    {
      const rounds = [{ slots: [L, L, L], extras: [] }];
      const sameType = shuffle(others.filter(c => isVowel(c) === isVowel(L)), rnd);
      const diffType = shuffle(others.filter(c => isVowel(c) !== isVowel(L)), rnd);
      const extras = uniq([...sameType, ...diffType]).slice(0, 2);
      rounds.push({ slots: [L, L], extras });
      stages.push({
        key: 'single', type: 'drag', name: 'Tek Ses', short: 'Ses',
        intro: { kind: 'single', letter: L },
        rounds
      });
    }

    // ── Etap 2: İki ses — hece (ta, te, at, et …) ──
    let syl2 = [];
    if (isVowel(L)) {
      knownC.forEach(c => { if (c !== 'ğ') syl2.push(c + L); syl2.push(L + c); });
    } else {
      knownV.forEach(v => { if (L !== 'ğ') syl2.push(L + v); syl2.push(v + L); });
    }
    syl2 = uniq(syl2).filter(okItem);
    if (syl2.length) {
      const open = shuffle(syl2.filter(s => !isVowel(s[0])), rnd);   // ta, te
      const closed = shuffle(syl2.filter(s => isVowel(s[0])), rnd);  // at, et
      const chosen = [];
      while (chosen.length < 4 && (open.length || closed.length)) {
        if (open.length) chosen.push(open.shift());
        if (chosen.length < 4 && closed.length) chosen.push(closed.shift());
      }
      const rounds = chunk(chosen, 2).map(pair => {
        const slots = shuffle([...pair, ...pair], rnd);
        const ex = minimalPair(pick(pair, rnd), L, known, new Set(pair), rnd);
        return { slots, extras: ex ? [ex] : [] };
      });
      stages.push({ key: 'syl2', type: 'drag', name: 'İki Ses · Hece', short: 'Hece', intro: { kind: 'syl2' }, rounds });
    }

    // ── Etap 3: Üç ses (tat, ten, net, ete …) ──
    const real3 = shuffle(words.filter(w => w.length === 3), rnd);
    let gen3 = [];
    const consNoG = knownC.filter(c => c !== 'ğ');
    for (const c1 of consNoG) for (const v of knownV) for (const c2 of knownC) {
      const s = c1 + v + c2;
      if (s.includes(L)) gen3.push(s);
    }
    for (const v1 of knownV) for (const c of knownC) for (const v2 of knownV) {
      const s = v1 + c + v2;
      if (s.includes(L) && v1 === v2) gen3.push(s);    // ana, ete gibi
    }
    gen3 = shuffle(uniq(gen3).filter(okItem).filter(s => !real3.includes(s)), rnd);
    const pool3 = uniq([...real3.slice(0, 4), ...gen3]).slice(0, 6);
    if (pool3.length) {
      const rounds = chunk(pool3, 3).filter(g => g.length).map(g => {
        const slots = g.length === 1 ? [g[0], g[0]] : shuffle(g, rnd);
        const ex = minimalPair(pick(g, rnd), L, known, new Set(g), rnd);
        return { slots, extras: ex ? [ex] : [] };
      });
      // son tur tek kalırsa öncekine birleştir
      if (rounds.length > 1 && rounds[rounds.length - 1].slots.length < 2) rounds.pop();
      stages.push({ key: 'syl3', type: 'drag', name: 'Üç Ses', short: '3 Ses', intro: { kind: 'syl3' }, rounds });
    }

    // ── Etap 4: Kelimeler ──
    let long = shuffle(words.filter(w => w.length >= 4 && w.length <= 8), rnd);
    if (long.length < 2) long = uniq([...long, ...real3.filter(w => !pool3.includes(w))]);
    const pool4 = long.slice(0, 6);
    if (pool4.length) {
      const groups = chunk(pool4, 3);
      if (groups.length > 1 && groups[groups.length - 1].length === 1) groups[groups.length - 2].push(groups.pop()[0]);
      const rounds = groups.map(g => {
        const slots = g.length === 1 ? [g[0], g[0]] : shuffle(g, rnd);
        const others4 = shuffle(allKnownWords.filter(w => !g.includes(w) && w.length >= 2 && w.length <= 7), rnd);
        const ex = others4[0] || minimalPair(pick(g, rnd), L, known, new Set(g), rnd);
        return { slots, extras: ex ? [ex] : [] };
      });
      stages.push({ key: 'words', type: 'drag', name: 'Kelimeler', short: 'Kelime', intro: { kind: 'words' }, rounds });
    }

    // ── Etap 5: Kelime kur (heceleri sırayla yerleştir) ──
    const buildable = words
      .filter(w => w.length <= 9)
      .map(w => ({ w, s: syllabify(w) }))
      .filter(o => o.s.length >= 2 && o.s.length <= 4);
    const prefer = buildable.filter(o => pool4.includes(o.w));
    const rest = shuffle(buildable.filter(o => !pool4.includes(o.w)), rnd);
    const chosen5 = uniq([...shuffle(prefer, rnd), ...rest].map(o => o.w)).slice(0, 3);
    if (chosen5.length) {
      const sylPool = uniq([...syl2, ...WORDS.filter(w => usesOnly(w, known)).flatMap(syllabify)]);
      const rounds = chosen5.map(w => {
        const s = syllabify(w);
        const exclude = new Set(s);
        const extras = [];
        const mp = minimalPair(pick(s.filter(x => x.includes(L)).concat(s), rnd), L, known, exclude, rnd);
        if (mp) { extras.push(mp); exclude.add(mp); }
        const alt = shuffle(sylPool.filter(x => !exclude.has(x) && okItem(x) && x.length <= 3), rnd)[0];
        if (alt) extras.push(alt);
        return { slots: s, extras, word: w, ordered: true };
      });
      stages.push({ key: 'build', type: 'drag', name: 'Kelime Kur', short: 'Kur', intro: { kind: 'build' }, rounds });
    }

    // ── Etap 6: Hızlı okuma (t → ta → tat) ──
    const ladderItems = uniq([
      ...syl2.slice(0, 2),
      ...pool3.slice(0, 2),
      ...pool4.filter(w => w.length <= 6).slice(0, 3)
    ]);
    const ladders = ladderItems.map(item => ladderFor(item).filter(okItem)).filter(c => c.length);
    if (ladders.length >= 2) {
      stages.push({ key: 'reading', type: 'reading', name: 'Hızlı Okuma', short: 'Oku', intro: { kind: 'reading' }, ladders: [[L], ...ladders] });
    }

    return { letter: L, known: [...known], stages };
  }

  const api = { GROUPS, ORDER, VOWELS, WORDS, BLOCK, isVowel, syllabify, buildLesson, knownSet };
  root.SesData = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
