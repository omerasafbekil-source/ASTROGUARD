
import React, { useEffect, useState } from "react";
import {
  Activity, Bone, Droplets, Radiation, Eye,
  Clock3, ShieldAlert, FlaskConical, RefreshCw,
  Dna, ScanEye
} from "lucide-react";

const initialData = {
  ctx: 420,
  osteocalcin: 18.6,
  bloodCalcium: 9.4,
  bloodPhosphorus: 3.5,
  urineCalcium: 180,
  urinePhosphorus: 620,
  qus: 92.4,
  radiation: 12.45,
  heartRate: 72,
  spo2: 98,
  temperature: 36.7,
  respiration: 16
};

function Metric({ icon: Icon, title, value, unit, detail }) {
  return (
    <div className="bio-card">
      <div className="bio-card-icon"><Icon size={22}/></div>
      <span>{title}</span>
      <strong>{value} <small>{unit}</small></strong>
      <p>{detail}</p>
    </div>
  );
}

export default function Biomedical() {
  const [data, setData] = useState(initialData);
  const [seconds, setSeconds] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

 
useEffect(() => {
  const timer = setInterval(() => {
    setSeconds(s => s + 1);

    setData(d => ({
      ...d,

      // Örnek simülasyon değerleri
      heartRate: Math.round(68 + Math.random() * 12),
      spo2: Math.round(96 + Math.random() * 3),
      temperature: Number((36.4 + Math.random() * 0.6).toFixed(1)),
      respiration: Math.round(14 + Math.random() * 5),

      ctx: Math.round(410 + Math.random() * 20),
      osteocalcin: Number((18 + Math.random() * 2).toFixed(1)),

      bloodCalcium: Number((9.2 + Math.random() * 0.4).toFixed(2)),
      bloodPhosphorus: Number((3.3 + Math.random() * 0.4).toFixed(2)),

      //urineCalcium: Math.round(170 + Math.random() * 30),
      //urinePhosphorus: Math.round(600 + Math.random() * 50),

      qus: Number((91 + Math.random() * 3).toFixed(1)),
      radiation: Number((d.radiation + 0.0001).toFixed(4))
    }));

    setLastUpdate(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const reset = () => {
    setData(initialData);
    setSeconds(0);
    setLastUpdate(new Date());
  };

  return (
    <div className="bio-page">
      <div className="bio-header">
        <div>
          <span>ASTROGUARD / BIOMEDICAL MONITORING</span>
          <h2>Biyomedikal Sağlık Analizi</h2>
          <p>Astronot sağlığı ve uzay uçuşu risk göstergeleri</p>
        </div>
        <div className="bio-live"><i/> SİMÜLASYON AKTİF</div>
      </div>

      <div className="bio-status">
        <div><Clock3 size={18}/> Ekran yenileme: {seconds} saniye</div>
        <div>Son güncelleme: {lastUpdate.toLocaleTimeString("tr-TR")}</div>
        <button onClick={reset}><RefreshCw size={15}/> Sıfırla</button>
      </div>

      <h3><Activity/> Genel Sağlık Göstergeleri</h3>
      <div className="bio-grid">
        <Metric icon={HeartIcon} title="Kalp Atış Hızı" value={data.heartRate} unit="BPM" detail="Örnek ölçüm"/>
        <Metric icon={Activity} title="SpO₂" value={data.spo2} unit="%" detail="Örnek oksijen satürasyonu"/>
        <Metric icon={Activity} title="Vücut Sıcaklığı" value={data.temperature} unit="°C" detail="Örnek ölçüm"/>
        <Metric icon={Activity} title="Solunum" value={data.respiration} unit="/dk" detail="Örnek solunum sayısı"/>
      </div>

      <h3><Bone/> Kemik Metabolizması ve Yoğunluğu</h3>
      <div className="bio-grid">
        <Metric icon={Bone} title="CTX" value={data.ctx} unit="ng/L" detail="Kemik yıkım belirteci, örnek değer"/>
        <Metric icon={FlaskConical} title="Osteokalsin" value={data.osteocalcin} unit="ng/mL" detail="Kemik yapım belirteci, örnek değer"/>
        <Metric icon={Bone} title="QUS" value={data.qus} unit="%" detail="Ultrasonik kemik değerlendirmesi, örnek"/>
      </div>

      <h3><Droplets/> Böbrek ve Mineral Takibi</h3>
      <div className="bio-grid">
        <Metric icon={Droplets} title="Kan Kalsiyum" value={data.bloodCalcium} unit="mg/dL" detail="Örnek laboratuvar değeri"/>
        <Metric icon={Droplets} title="Kan Fosfor" value={data.bloodPhosphorus} unit="mg/dL" detail="Örnek laboratuvar değeri"/>
        <Metric icon={Droplets} title="İdrar Kalsiyum" value={data.urineCalcium} unit="mg/24 saat" detail="Örnek laboratuvar değeri"/>
        <Metric icon={Droplets} title="İdrar Fosfor" value={data.urinePhosphorus} unit="mg/24 saat" detail="Örnek laboratuvar değeri"/>
      </div>
<div className="bio-foot">
  <Clock3 size={15} />
  İDRAR BİYOKİMYASI ÖLÇÜMÜ: 12 SAATTE BİR
  <br />
  Ölçüm aralarında son laboratuvar değerleri korunur.
  Yeni analiz tamamlandığında veriler güncellenir.
</div>
      <div className="bio-alert">
        <ShieldAlert/>
        <div>
          <strong>Böbrek taşı risk değerlendirmesi</strong>
          <p>İdrar kalsiyumu, idrar hacmi, sitrat, oksalat ve diğer laboratuvar ölçümleri birlikte değerlendirilmelidir. Bu örnek değerlerden gerçek risk veya tanı çıkarılamaz.</p>
        </div>
      </div>

      <h3><Radiation/> Radyasyon ve Dozimetrik Takip</h3>
      <div className="bio-radiation">
        <Radiation size={30}/>
        <div>
          <span>ÖRNEK KÜMÜLATİF DOZ GÖSTERGESİ</span>
          <strong>{data.radiation.toFixed(4)} <small>mSv</small></strong>
          <p>Bu sayaç yalnızca arayüz simülasyonudur. Gerçek doz ölçümü değildir.</p>
        </div>
      </div>

      <h3><Eye/> Göz Sağlığı ve SANS Kontrolleri</h3>
      <div className="bio-grid">
        <Metric icon={Eye} title="SANS" value="Takip bekliyor" unit="" detail="Uzay uçuşuyla ilişkili nöro-oküler değerlendirme"/>
        <Metric icon={Eye} title="Fundoskopi" value="Kayıt bekliyor" unit="" detail="Göz dibi muayenesi"/>
        <Metric icon={ScanEye} title="HR-pOCT / OCT" value="Kayıt bekliyor" unit="" detail="Retina ve optik sinir görüntülemesi"/>
      </div>

      <div className="bio-alert">
        <Dna/>
        <div>
          <strong>Genetik ve kalıtsal hastalık geçmişi</strong>
          <p>Genetik tarama, aile sağlık öyküsü ve klinik değerlendirme ayrı kaydedilmelidir. Genetik yatkınlık tek başına hastalık tanısı değildir.</p>
        </div>
      </div>

      <div className="bio-foot">
        ASTROGUARD NASA'nın resmî ürünü değildir. NASA'dan gerçek kişisel sağlık telemetrisi alınmamaktadır.
        Biyobelirteçler ve muayene kayıtları örnek veridir. Yalnızca radyasyon göstergesi saniyelik simülasyonla değişir.
        Bu ekran tıbbi teşhis amacı taşımaz.
      </div>

      <style>{`
        .bio-page { color:#eaf7ff; display:flex; flex-direction:column; gap:18px; }
        .bio-header { padding:25px; border-radius:17px; background:linear-gradient(120deg,#102e4c,#071626); border:1px solid #244b69; display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .bio-header span,.bio-radiation span { font-size:11px; color:#52cfff; letter-spacing:2px; }
        .bio-header h2 { margin:9px 0; font-size:25px; }
        .bio-header p,.bio-radiation p { color:#9db5c9; margin:0; }
        .bio-live { color:#79e3b0; font-size:11px; }
        .bio-live i { display:inline-block; width:8px; height:8px; background:#62e6a3; border-radius:50%; margin-right:5px; }
        .bio-status { display:flex; flex-wrap:wrap; gap:15px; align-items:center; justify-content:space-between; padding:13px; border:1px solid #203d57; border-radius:12px; background:#0b1b2c; color:#a9bfd1; font-size:12px; }
        .bio-status div { display:flex; align-items:center; gap:7px; }
        .bio-status button { display:flex; gap:6px; align-items:center; border:1px solid #315a76; background:#14314a; color:white; padding:8px 12px; border-radius:8px; cursor:pointer; }
        .bio-page h3 { display:flex; align-items:center; gap:9px; margin:10px 0 0; font-size:17px; }
        .bio-page h3 svg { color:#4dcfff; }
        .bio-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:13px; }
        .bio-card { background:#0d2033; border:1px solid #203d57; border-radius:14px; padding:17px; min-width:0; }
        .bio-card-icon { color:#50cfff; margin-bottom:12px; }
        .bio-card>span { display:block; color:#a8bfd2; font-size:12px; }
        .bio-card>strong { display:block; font-size:23px; margin-top:9px; overflow-wrap:anywhere; }
        .bio-card>strong small { color:#7f9ab0; font-size:12px; }
        .bio-card p { color:#809bb1; font-size:11px; line-height:1.5; }
        .bio-alert { display:flex; gap:13px; padding:17px; border:1px solid #65552c; border-radius:13px; background:#282518; color:#f3c96b; }
        .bio-alert p { color:#d4c8a7; font-size:12px; line-height:1.6; margin-bottom:0; }
        .bio-radiation { display:flex; gap:17px; align-items:center; background:#10243a; border:1px solid #244b69; padding:20px; border-radius:14px; color:#50cfff; }
        .bio-radiation strong { display:block; font-size:30px; color:#eaf7ff; margin:7px 0; }
        .bio-radiation strong small { font-size:13px; color:#8ca9bf; }
        .bio-radiation p { font-size:11px; }
        .bio-foot { border-top:1px solid #203d57; padding:16px 0; color:#829cb1; font-size:11px; line-height:1.7; }
        @media(max-width:850px) { .bio-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .bio-header { flex-direction:column; align-items:flex-start; } }
        @media(max-width:520px) { .bio-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}

function HeartIcon(props) {
  return <Activity {...props}/>;
}
