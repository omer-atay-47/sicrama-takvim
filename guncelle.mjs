// plan.json'u üretir. Kullanım: node guncelle.mjs, sonra git add -A; git commit; git push
// Sıra: Tahmin Et! zinciri (SORU 1..24), Ya olsaydı (15), Merak Kutusu (38); her seri günde 1 video, 20 Kas'tan başlar.
// META_SON: Meta Planlayıcı'ya eklenmiş son gün (bundan sonrası "Meta'ya eklenmedi"). Her yeni günü Meta'ya ekleyince güncelle.
import fs from "node:fs";
const UP = "C:/Users/USER/Desktop/insta video denemesi/_yukleme";
const VS = "C:/Users/USER/Desktop/video-studio";
const META_SON = "2026-11-27";
const BASLA = new Date("2026-11-20T12:00:00+03:00");
const j = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const oku = (ad) => { try { return fs.readFileSync(`${UP}/${ad}.txt`, "utf8").trim(); } catch { return ""; } };
const tahmin = [...j(`${VS}/bilgi/tahmin/_sira.json`), ...j(`${VS}/bilgi/tahmin/_sira2.json`)].map((i) => "t-" + i).filter((a) => fs.existsSync(`${UP}/${a}.mp4`));
const ya = [...j(`${VS}/ya-olsaydi-sinema/ornek/_sira.json`), ...j(`${VS}/ya-olsaydi-sinema/ornek/_sira2.json`)].map((i) => "y-" + i).filter((a) => fs.existsSync(`${UP}/${a}.mp4`));
const ilk = ["ahtapot-diyalog", "yapraklar-sararir", "kediler-dort-ayak-ustune-duser", "bebeklerde-diz-kapagi-kemik-degil", "hapsirinca-gozler-kapanir-mi",
  "altin-yenir-mi", "kutuplarda-gunes-batmaz", "kutup-ayisi-derisi-siyah", "uzayda-ses-duyulur-mu", "insan-beyni-yuzde-on-mu", "yarasalar-nasil-yon-bulur", "muzun-ici-neden-cekirdeksiz", "ay-her-yil-uzaklasiyor-mu"];
const hepsi = fs.readdirSync(UP).filter((f) => f.endsWith(".mp4") && !/^[ty]-/.test(f)).map((f) => f.slice(0, -4));
const merak = [...ilk.filter((a) => hepsi.includes(a)), ...hepsi.filter((a) => !ilk.includes(a))];
const ad = (a) => { try { return j(`${VS}/bilgi/bolumler/${a}/meta.json`).name; } catch { return a; } };
const tarih = (n) => new Date(BASLA.getTime() + n * 864e5).toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
const items = [];
const ekle = (liste, series, time, baslik) => liste.forEach((a, n) => {
  const date = tarih(n), cap = oku(a);
  items.push({ date, time, series, title: baslik(a, cap), caption: cap, file: a + ".mp4", meta: date <= META_SON });
});
ekle(merak, "merak", "12:30", (a) => ad(a));
ekle(tahmin, "tahmin", "18:00", (a, c) => c.split("\n")[0] || a);
ekle(ya, "ya", "21:00", (a, c) => c.split("\n")[0] || a);
items.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
fs.writeFileSync(new URL("./plan.json", import.meta.url), JSON.stringify({ updated: new Date().toISOString(), account: "merak.kutusu_", metaSon: META_SON, items }, null, 1));
console.log(items.length, "gönderi:", { merak: merak.length, tahmin: tahmin.length, ya: ya.length }, "son gün", items.at(-1).date);
