# Ses Lab — öğretmen ses kayıtları (isteğe bağlı)

Ses Lab varsayılan olarak tarayıcının Türkçe sesli okumasını (Web Speech API) kullanır.
Konuşma motorları tek bir ünsüzü harf adıyla okuyabilir (örneğin “t” → “te”).
Sesi tam doğru duyurmak için öğretmen kaydı ekleyebilirsiniz:

1. Kaydı bu klasöre `<metin>.mp3` adıyla koyun — örnekler: `t.mp3`, `ta.mp3`, `tane.mp3`.
2. Dosya adını `liste.json` dizisine ekleyin:

```json
["t", "ta", "tane"]
```

Listede olan her ses, hece veya kelime için kayıt çalınır; olmayanlar için sesli okuma kullanılır.
(Sayfa `file://` ile açıldığında kayıtlar devre dışıdır; GitHub Pages ya da yerel sunucu kullanın.)
