# Ses Lab — öğretmen ses kayıtları

Ses Lab varsayılan olarak tarayıcının Türkçe sesli okumasını (Web Speech API) kullanır.
Konuşma motorları tek bir ünsüzü harf adıyla okuyabilir (örneğin “t” → “te”).
Sesin doğru duyulması için öğretmen kaydı eklenebilir.

## En kolay yol: Ses Kaydedici

`ses-kaydedici.html` sayfasını açın (Ses Lab ana ekranında “🎙️ Öğretmen: Sesleri kaydet”).

1. Bir ses seçin (Aa, Nn, Tt…): o sesin dersinde okunan her şey — tek ses, heceler, üç sesliler,
   kelimeler, kelime kurma ve hızlı okuma kartları — etkinliklere göre listelenir (29 seste toplam 605 öğe).
   Her öğe bir kez kaydedilir ve bütün derslerde kullanılır.
2. **Mikrofonu aç** → her öğe için **Kaydet**'e (ya da Boşluk tuşuna) basıp söyleyin.
   Baştaki/sondaki sessizlik otomatik kırpılır, ses seviyesi eşitlenir, MP3'e çevrilir.
3. Kayıtlar o tarayıcıda saklanır; **aynı cihazdaki Ses Lab onları hemen kullanır**.
4. Herkesin duyması için **Hepsini indir (.zip)** → ZIP'teki `sesler/` içeriğini bu klasöre
   kopyalayın (`liste.json` dahil) → GitHub'da commit edin.

Derslerde olmayan bir hece/kelime de “Ekle” kutusuyla kaydedilebilir.
Not: Her sesin ders içeriği sabittir (kaydedici bu listeyi bilir); oyunda yalnızca sıralama karışır.

## Elle ekleme

1. Kaydı bu klasöre `<metin>.mp3` adıyla koyun — örnekler: `t.mp3`, `ta.mp3`, `tane.mp3`.
2. Adını `liste.json` dizisine ekleyin. Uzantı yazılmazsa `.mp3` kabul edilir;
   başka biçimler için uzantıyı yazın (`"n.wav"`).

```json
["t", "ta", "tane", "n.wav"]
```

Çalma sırası: bu cihazdaki kayıt → bu klasördeki dosya → tarayıcının sesli okuması.
(Sayfa `file://` ile açıldığında bu klasördeki dosyalar kullanılamaz; GitHub Pages ya da yerel sunucu kullanın.)
