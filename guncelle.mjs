// plan.json'u üretir ve eksik küçük video sürümlerini (videolar/, 540x960) hazırlar.
// Kullanım: node guncelle.mjs   sonra  git add -A; git commit; git push
// 30 Kasım'a kadarki kayıtlar mevcut plan.json'dan korunur; 1 Aralık'tan sonrası aşağıdaki GUNLER listesidir.
// Meta'da zamanlanan her gönderi meta-planli.json'a "YYYY-AA-GG SS:DD" olarak eklenir.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const UP = "C:/Users/USER/Desktop/insta video denemesi/_yukleme";
const VS = "C:/Users/USER/Desktop/video-studio";
const yol = (a) => new URL(a, import.meta.url);
const j = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const oku = (ad) => { try { return fs.readFileSync(`${UP}/${ad}.txt`, "utf8").replace(/\r/g, "").trim(); } catch { return ""; } };

const merak = ["muzun-ici-neden-cekirdeksiz", "ay-her-yil-uzaklasiyor-mu", "parmak-izi-ikizlerde-ayni-mi", "ari-petegi-altigen", "everest-mariana",
  "neden-esner-bulasici", "deve-horgic-yag", "bulut-kac-ton", "sogan-aglatir", "yildizlar-neden-parildar"];
const tahmin = ["en-hizli-ruzgar", "en-hizli-kara-hayvani", "en-derin-nokta", "kemik-sayisi", "en-kalabalik-ulke",
  "en-kucuk-kemik", "isik-gunes-dunya", "yenilenen-organ", "en-buyuk-col", "vucutta-su"];
const ya = j(`${VS}/ya-olsaydi-anim/ornek/_sira-aralik.json`);
const GUNLER = merak.map((m, i) => ({ date: `2026-12-${String(i + 1).padStart(2, "0")}`, merak: m, tahmin: "t-" + tahmin[i], ya: ya[i] }));

const eski = j(yol("./plan.json")).items.filter((i) => i.date <= "2026-11-30");
const yeni = [];
for (const g of GUNLER) {
  const bolum = j(`${VS}/ya-olsaydi-anim/ornek/${g.ya}.json`);
  yeni.push(
    { date: g.date, time: "12:30", series: "merak", title: j(`${VS}/bilgi/bolumler/${g.merak}/meta.json`).name, caption: oku(g.merak), file: g.merak + ".mp4" },
    { date: g.date, time: "18:00", series: "tahmin", title: oku(g.tahmin).split("\n")[0], caption: oku(g.tahmin), file: g.tahmin + ".mp4" },
    { date: g.date, time: "21:00", series: "ya", title: bolum.baslik, caption: oku("y-" + g.ya) || bolum.aciklama, file: `y-${g.ya}.mp4` },
  );
}
const metaListe = new Set(fs.existsSync(yol("./meta-planli.json")) ? j(yol("./meta-planli.json")) : []);
const items = [...eski.map((i) => ({ ...i, meta: true })), ...yeni.map((i) => ({ ...i, meta: metaListe.has(`${i.date} ${i.time}`) }))];

// küçük video sürümleri: yoksa veya kaynak daha yeniyse üret
let uretilen = 0;
for (const i of items) {
  if (!i.file) continue;
  const kaynak = `${UP}/${i.file}`, hedef = fileURLToPath(yol("./videolar/" + i.file));
  const var_ = fs.existsSync(hedef);
  if (i.date > "2026-11-30" && fs.existsSync(kaynak) && (!var_ || fs.statSync(kaynak).mtimeMs > fs.statSync(hedef).mtimeMs)) {
    const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", kaynak, "-vf", "scale=540:960", "-c:v", "libx264", "-crf", "30", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", hedef]);
    if (r.status !== 0) throw new Error("ffmpeg " + i.file);
    uretilen++;
  } else if (!var_) delete i.file; // video henüz üretilmedi
}
const metaSon = items.filter((i) => i.meta).at(-1)?.date;
fs.writeFileSync(yol("./plan.json"), JSON.stringify({ updated: new Date().toISOString(), account: "merak.kutusu_", metaSon, items }, null, 1));
console.log(items.length, "gönderi, son gün", items.at(-1).date, "| Meta son", metaSon, "| yeni küçük video", uretilen);
