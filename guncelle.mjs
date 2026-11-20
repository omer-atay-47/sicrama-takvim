// plan.json'u üretir. Kullanım: node guncelle.mjs  (aşağıdaki PLAN'ı düzenle, sonra git add/commit/push)
// Açıklamalar _yukleme/<ad>.txt dosyalarından okunur (yoksa caption boş kalır).
import fs from "node:fs";
const UP = "C:/Users/USER/Desktop/insta video denemesi/_yukleme";
// [tarih, merak dosyası, merak başlığı, tahmin dosyası, ya dosyası]
const PLAN = [
  ["2026-11-20", null, "Üç kalbi, mavi kanı olan hayvan kim?", "t-en-cok-adali-ulke", "y-yercekimi35"],
  ["2026-11-21", "yapraklar-sararir", "Yapraklar neden sararır?", "t-ayakta-uyuyan-hayvan", "y-uyumasak"],
  ["2026-11-22", "kediler-dort-ayak-ustune-duser", null, "t-kare-bayrak", "y-buzullar"],
  ["2026-11-23", "bebeklerde-diz-kapagi-kemik-degil", null, "t-piyano-tus", "y-ucabilseydik"],
  ["2026-11-24", "hapsirinca-gozler-kapanir-mi", null, "t-en-yuksek-selale", "y-donmese"],
];
const oku = (ad) => { try { return fs.readFileSync(`${UP}/${ad}.txt`, "utf8").trim(); } catch { return ""; } };
const items = [];
for (const [d, m, mb, t, y] of PLAN) {
  const mc = m ? oku(m) : "";
  items.push({ date: d, time: "12:30", series: "merak", title: mb || mc.split("\n")[0] || m, caption: mc });
  const tc = oku(t); items.push({ date: d, time: "18:00", series: "tahmin", title: tc.split("\n")[0] || t, caption: tc });
  const yc = oku(y); items.push({ date: d, time: "21:00", series: "ya", title: yc.split("\n")[0] || y, caption: yc });
}
fs.writeFileSync(new URL("./plan.json", import.meta.url), JSON.stringify({ updated: new Date().toISOString(), account: "merak.kutusu_", items }, null, 1));
console.log(items.length, "gönderi yazıldı");
