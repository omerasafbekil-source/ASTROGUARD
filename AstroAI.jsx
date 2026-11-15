
import { useState } from "react";

export default function AstroAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Merhaba! Ben ASTRO AI. Uzay görevleri, astronot sağlığı ve görev koşulları hakkında sorularını yanıtlayabilirim."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Uzayda astronotların kemik yoğunluğu neden azalır?",
    "Mikro yerçekimi böbrekleri nasıl etkiler?",
    "Uzayda kas kaybı nasıl önlenir?",
    "Astronotlarda radyasyonun etkileri nelerdir?",
    "Uzayda uyku düzeni nasıl korunur?",
    "Astronotlarda görme bozukluğu neden oluşur?",
    "12 saatlik idrar biyokimyası ölçümü neden yapılır?",
    "Uzun süreli uzay görevlerinde en önemli sağlık riskleri nelerdir?"
  ];

  async function sendMessage(e, customQuestion) {
    if (e) e.preventDefault();

    const userQuestion = (customQuestion || question).trim();

    if (!userQuestion || loading) return;

    setMessages(prev => [
      ...prev,
      { role: "user", text: userQuestion }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/astro-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: userQuestion
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.answer }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Bağlantı hatası: " + error.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: "rgba(5, 17, 38, 0.94)",
      border: "1px solid rgba(65, 190, 255, 0.3)",
      borderRadius: "18px",
      padding: "24px",
      color: "white",
      maxWidth: "900px",
      margin: "20px auto"
    }}>
      <h2 style={{ color: "#48caff" }}>
        ✦ ASTRO AI
      </h2>

      <p style={{ color: "#9bb8d5" }}>
        Astronot Danışma ve Tavsiye Merkezi
      </p>

      <div style={{
        marginBottom: "18px",
        padding: "15px",
        background: "rgba(14, 45, 75, 0.65)",
        borderRadius: "12px",
        border: "1px solid rgba(65, 190, 255, 0.2)"
      }}>
        <strong style={{ color: "#48caff" }}>
          ✦ ÖNERİLEN SORULAR
        </strong>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "9px",
          marginTop: "12px"
        }}>
          {suggestedQuestions.map((item, index) => (
            <button
              key={index}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(null, item)}
              style={{
                background: "#102d49",
                color: "#c5eaff",
                border: "1px solid #28618a",
                borderRadius: "9px",
                padding: "10px 12px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "12px",
                textAlign: "left"
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        height: "350px",
        overflowY: "auto",
        padding: "12px",
        background: "rgba(0, 0, 0, 0.2)",
        borderRadius: "12px"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            display: "flex",
            justifyContent:
              msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: "15px"
          }}>
            <div style={{
              maxWidth: "80%",
              padding: "13px 16px",
              borderRadius: "13px",
              background:
                msg.role === "user" ? "#075985" : "#142b46",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}>
              <strong>
                {msg.role === "user" ? "SEN" : "ASTRO AI"}
              </strong>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <p style={{ color: "#48caff" }}>
            ASTRO AI yanıt hazırlıyor...
          </p>
        )}
      </div>

      <form onSubmit={sendMessage} style={{
        display: "flex",
        gap: "10px",
        marginTop: "15px"
      }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="ASTRO AI'ya bir soru sor..."
          style={{
            flex: 1,
            minWidth: 0,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #285477",
            background: "#0b1c31",
            color: "white"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#0891b2",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Gönder
        </button>
      </form>

      <p style={{
        color: "#7793ad",
        fontSize: "11px",
        marginTop: "14px"
      }}>
        ASTRO AI bilgilendirme amaçlıdır. Tıbbi teşhis koymaz.
        Sağlık ölçümleri gerçek NASA telemetrisi değildir.
      </p>
    </div>
  );
}
