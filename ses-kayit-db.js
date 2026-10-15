/* ═══════════════════════════════════════════════════════════════════════
   Ses Lab — bu cihazdaki öğretmen kayıtları (IndexedDB)
   ses-kaydedici.html kayıtları buraya yazar, ses-lab.html buradan okur.
   Kayıt: { text: 't', blob: Blob(audio/mpeg), duration: 0.42, peaks: [..], created: 1700000000000 }
   ═══════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const DB = 'gl-seslab-kayit', STORE = 'takes';

  function open() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) return reject(new Error('IndexedDB yok'));
      const req = root.indexedDB.open(DB, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'text' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function run(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      let out;
      if (req) req.onsuccess = () => { out = req.result; };
      tx.oncomplete = () => { db.close(); resolve(out); };
      tx.onerror = tx.onabort = () => { db.close(); reject(tx.error); };
    });
  }

  root.SesKayit = {
    getAll: () => run('readonly', s => s.getAll()).then(r => r || []),
    put: rec => run('readwrite', s => s.put(rec)),
    del: text => run('readwrite', s => s.delete(text)),
    clear: () => run('readwrite', s => s.clear())
  };
})(typeof window !== 'undefined' ? window : globalThis);
