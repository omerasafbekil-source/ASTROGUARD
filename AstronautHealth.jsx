
import React from "react";
import {
  Dna, HeartPulse, Bone, Droplets, Eye,
  Radiation, ShieldAlert, Activity
} from "lucide-react";

const astronauts = [
  {
    id: 1,
    name: "Christina Koch",
    mission: "Artemis II",
    role: "Görev Uzmanı",
    genetic: "Genetik tarama kaydı mevcut değil",
    family: "Aile öyküsü değerlendirilmedi",
    bone: "Takip gerekli",
    kidney: "Risk değerlendirmesi bekliyor",
    eye: "SANS taraması bekliyor",
    radiation: "Dozimetrik takip bekliyor",
    status: "Örnek profil"
  },
  {
    id: 2,
    name: "Jeremy Hansen",
    mission: "Artemis II",
    role: "Uçuş Mühendisi",
    genetic: "Genetik tarama kaydı mevcut değil",
    family: "Aile öyküsü değerlendirilmedi",
    bone: "Takip gerekli",
    kidney: "Risk değerlendirmesi bekliyor",
    eye: "SANS taraması bekliyor",
    radiation: "Dozimetrik takip bekliyor",
    status: "Örnek profil"
  },
  {
    id: 3,
    name: "Victor Glover",
    mission: "Artemis II",
    role: "Görev Komutanı",
    genetic: "Genetik tarama kaydı mevcut değil",
    family: "Aile öyküsü değerlendirilmedi",
    bone: "Takip gerekli",
    kidney: "Risk değerlendirmesi bekliyor",
    eye: "SANS taraması bekliyor",
    radiation: "Dozimetrik takip bekliyor",
    status: "Örnek profil"
  }
];

function Info({ icon: Icon, title, value }) {
  return (
    <div className="ah-info">
      <Icon size={19} />
      <div>
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default function AstronautHealth() {
  const [selected, setSelected] = React.useState(astronauts[0]);

  return (
    <div className="ah-page">
      <div className="ah-heading">
        <div>
          <span>ASTROGUARD / PERSONNEL DATABASE</span>
          <h2>Astronot Sağlık Profilleri</h2>
          <p>Astronot bazlı sağlık geçmişi ve takip kayıtları</p>
        </div>
        <Dna size={42} />
      </div>

      <div className="ah-layout">
        <div className="ah-list">
          {astronauts.map(person => (
            <button
              key={person.id}
              className={`ah-person ${selected.id === person.id ? "active" : ""}`}
              onClick={() => setSelected(person)}
            >
              <div className="ah-avatar">
                <Activity />
              </div>
              <div>
                <strong>{person.name}</strong>
                <small>{person.mission} · {person.role}</small>
              </div>
            </button>
          ))}
        </div>

        <div className="ah-detail">
          <div className="ah-profile-title">
            <div>
              <span>ASTRONAUT MEDICAL RECORD</span>
              <h2>{selected.name}</h2>
              <p>{selected.mission} / {selected.role}</p>
            </div>
            <span className="ah-badge">{selected.status}</span>
          </div>

          <div className="ah-grid">
            <Info icon={Dna} title="Genetik tarama" value={selected.genetic} />
            <Info icon={HeartPulse} title="Aile sağlık öyküsü" value={selected.family} />
            <Info icon={Bone} title="Kemik sağlığı" value={selected.bone} />
            <Info icon={Droplets} title="Böbrek taşı göstergeleri" value={selected.kidney} />
            <Info icon={Eye} title="Göz / SANS" value={selected.eye} />
            <Info icon={Radiation} title="Radyasyon takibi" value={selected.radiation} />
          </div>

          <div className="ah-note">
            <ShieldAlert size={22} />
            <div>
              <strong>Veri güvenliği ve bilimsel doğruluk</strong>
              <p>
                Bu profiller örnek arayüz verileridir. Gerçek astronotların
                genetik ve klinik kayıtlarını temsil etmez. Genetik yatkınlık
                kesin hastalık tanısı anlamına gelmez.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ah-page { color:#eaf7ff; display:flex; flex-direction:column; gap:22px; }
        .ah-heading { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(120deg,#102b49,#071626); padding:25px; border:1px solid #244b69; border-radius:18px; }
        .ah-heading span,.ah-profile-title span { color:#51cfff; font-size:11px; letter-spacing:2px; }
        .ah-heading h2,.ah-profile-title h2 { margin:8px 0; font-size:25px; }
        .ah-heading p,.ah-profile-title p { color:#9db5c9; margin:0; }
        .ah-layout { display:grid; grid-template-columns:260px 1fr; gap:18px; }
        .ah-list,.ah-detail { background:#0b1b2c; border:1px solid #203d57; border-radius:16px; padding:16px; }
        .ah-list { display:flex; flex-direction:column; gap:10px; }
        .ah-person { display:flex; align-items:center; gap:12px; text-align:left; padding:13px; color:#eaf7ff; background:#10243a; border:1px solid transparent; border-radius:12px; cursor:pointer; }
        .ah-person.active { border-color:#42c9ff; background:#153550; }
        .ah-person small,.ah-info small { display:block; color:#91a9bd; font-size:11px; margin-top:5px; }
        .ah-avatar { width:38px; height:38px; border-radius:10px; display:grid; place-items:center; background:#173d58; color:#4dcfff; }
        .ah-profile-title { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:20px; }
        .ah-badge { background:#183d35; color:#79e3b0!important; padding:7px 10px; border-radius:20px; letter-spacing:0!important; }
        .ah-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
        .ah-info { display:flex; gap:12px; align-items:flex-start; padding:17px; background:#10243a; border:1px solid #203d57; border-radius:12px; color:#4dcfff; }
        .ah-info strong { display:block; color:#eaf7ff; font-size:13px; margin-top:6px; line-height:1.5; }
        .ah-note { display:flex; gap:12px; margin-top:18px; padding:16px; border-radius:12px; background:#292619; border:1px solid #68562a; color:#f4c86c; }
        .ah-note p { color:#d3c8a9; font-size:12px; line-height:1.6; margin-bottom:0; }
        @media(max-width:800px) { .ah-layout { grid-template-columns:1fr; } .ah-grid { grid-template-columns:1fr; } .ah-profile-title { align-items:flex-start; flex-direction:column; } }
      `}</style>
    </div>
  );
}
