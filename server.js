
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

function buildDemoAnswer(question) {
  const q = question.toLocaleLowerCase("tr-TR");

  if (q.includes("kemik") || q.includes("ctx") || q.includes("osteokalsin")) {
    return `🦴 KEMİK SAĞLIĞI

Uzaydaki mikro yerçekimi kemik yoğunluğunda azalmaya neden olabilir.

• CTX: Kemik yıkımıyla ilişkili belirteç.
• Osteokalsin: Kemik oluşumuyla ilişkili belirteç.
• QUS: Kemik özelliklerini değerlendiren ultrason yöntemi.

Bu göstergeler tek başına tanı koydurmaz.`;
  }

  if (q.includes("böbrek") || q.includes("taş") || q.includes("kalsiyum")) {
    return `🧪 BÖBREK SAĞLIĞI

Uzay görevlerinde sıvı dengesi ve kemik metabolizması böbrek taşı riskini etkileyebilir.

Takip başlıkları:
• İdrar kalsiyumu
• İdrar hacmi
• İdrar fosfat ve sitrat
• Sıvı tüketimi

Bu değerler uzmanlar tarafından birlikte değerlendirilmelidir.`;
  }

  if (q.includes("göz") || q.includes("sans") || q.includes("görme")) {
    return `👁️ GÖZ SAĞLIĞI

SANS, bazı astronotlarda uzay uçuşuyla ilişkili görülebilen nöro-oküler değişiklikleri ifade eder.

Takip yöntemleri:
• OCT görüntüleme
• Göz dibi muayenesi
• Görme değerlendirmesi`;
  }

  if (q.includes("radyasyon") || q.includes("ışınım")) {
    return `☢️ UZAY RADYASYONU

Uzay ortamında astronotlar farklı radyasyon kaynaklarına maruz kalabilir.

Takip başlıkları:
• Toplam radyasyon maruziyeti
• Görev süresi
• Güneş kaynaklı parçacık olayları
• Dozimetre kayıtları`;
  }

  if (q.includes("uyku") || q.includes("stres")) {
    return `🧠 UYKU VE STRES

Uzun süreli uzay görevleri uyku düzenini ve psikolojik durumu etkileyebilir.

Takip başlıkları:
• Uyku süresi
• Uyku kalitesi
• Stres değerlendirmesi
• Günlük aktivite`;
  }

  if (q.includes("kalp") || q.includes("nabız") || q.includes("oksijen") || q.includes("spo2")) {
    return `❤️ KALP VE DOLAŞIM

Astronotların kardiyovasküler sistemi görev boyunca izlenebilir.

Takip göstergeleri:
• Kalp atım hızı
• SpO₂
• Solunum hızı
• Kan basıncı`;
  }

  return `🚀 ASTRO AI DEMO

Sorunu aldım: "${question}"

Astronot sağlığı; kemik metabolizması, böbrek fonksiyonları, göz sağlığı, radyasyon, uyku ve kalp sağlığı gibi başlıklarla takip edilir.

Daha ayrıntılı bilgi için sorunu bu konulardan biriyle ilişkilendirerek sor.

Bu yanıt yerel demo bilgi havuzundan oluşturulmuştur. Gerçek NASA verisi veya tıbbi değerlendirme değildir.`;
}

app.post("/api/astro-ai", (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({
      error: "Lütfen bir soru yaz."
    });
  }

  return res.json({
    answer: buildDemoAnswer(question),
    mode: "demo"
  });
});

app.listen(3001, () => {
  console.log("ASTROGUARD sunucusu: http://localhost:3001");
  console.log("ASTRO AI MODU: DEMO");
});
