# Ses Lab — öğretmen ses kayıtları

Ses Lab varsayılan olarak tarayıcının Türkçe sesli okumasını (Web Speech API) kullanır.
Konuşma motorları tek bir ünsüzü harf adıyla okuyabilir (örneğin “t” → “te”).
Sesin doğru duyulması için öğretmen kaydı eklenebilir.

## En kolay yol: Ses Kaydedici

`ses-kaydedici.html` sayfasını açın (Ses Lab ana ekranında “🎙️ Öğretmen: Sesleri kaydet”).

1. **Mikrofonu aç** → her ses için **Kaydet**'e (ya da Boşluk tuşuna) basıp sesi söyleyin.
   Baştaki/sondaki sessizlik otomatik kırpılır, ses seviyesi eşitlenir, MP3'e çevrilir.
2. Kayıtlar o tarayıcıda saklanır; **aynı cihazdaki Ses Lab onları hemen kullanır**.
3. Herkesin duyması için **Hepsini indir (.zip)** → ZIP'teki `sesler/` içeriğini bu klasöre
   kopyalayın (`liste.json` dahil) → GitHub'da commit edin.

Hece veya kelime de kaydedilebilir (ör. `ta`, `tane`) — sayfadaki “Ekle” kutusunu kullanın.

## Elle ekleme

1. Kaydı bu klasöre `<metin>.mp3` adıyla koyun — örnekler: `t.mp3`, `ta.mp3`, `tane.mp3`.
2. Adını `liste.json` dizisine ekleyin. Uzantı yazılmazsa `.mp3` kabul edilir;
   başka biçimler için uzantıyı yazın (`"n.wav"`).

```json
["t", "ta", "tane", "n.wav"]
```

Çalma sırası: bu cihazdaki kayıt → bu klasördeki dosya → tarayıcının sesli okuması.
(Sayfa `file://` ile açıldığında bu klasördeki dosyalar kullanılamaz; GitHub Pages ya da yerel sunucu kullanın.)
