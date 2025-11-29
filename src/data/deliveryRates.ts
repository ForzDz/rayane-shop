export interface DeliveryRate {
  domicile: number | null;
  bureau: number | null;
  note?: string;
}

export const deliveryRates: Record<string, DeliveryRate> = {
  "Adrar":           { "domicile": 1400, "bureau": 900 },
  "Chlef":           { "domicile": 750,  "bureau": 450 },
  "Laghouat":        { "domicile": 950,  "bureau": 600 },
  "Oum El Bouaghi":  { "domicile": 800,  "bureau": 450 },
  "Batna":           { "domicile": 800,  "bureau": 450 },
  "Béjaïa":          { "domicile": 800,  "bureau": 450 },
  "Biskra":          { "domicile": 950,  "bureau": 600 },
  "Béchar":          { "domicile": 1100, "bureau": 650 },
  "Blida":           { "domicile": 750,  "bureau": 450 },
  "Bouira":          { "domicile": 800,  "bureau": 450 },
  "Tamanrasset":     { "domicile": 1600, "bureau": 1000 },
  "Tébessa":         { "domicile": 850,  "bureau": 450 },
  "Tlemcen":         { "domicile": 700,  "bureau": 450 },
  "Tiaret":          { "domicile": 750,  "bureau": 450 },
  "Tizi Ouzou":      { "domicile": 800,  "bureau": 450 },
  "Alger":           { "domicile": 650,  "bureau": 400 },
  "Djelfa":          { "domicile": 950,  "bureau": 600 },
  "Jijel":           { "domicile": 800,  "bureau": 450 },
  "Sétif":           { "domicile": 800,  "bureau": 450 },
  "Saïda":           { "domicile": 750,  "bureau": null, "note": "missing" },
  "Skikda":          { "domicile": 800,  "bureau": 450 },
  "Sidi Bel Abbès":  { "domicile": 700,  "bureau": 450 },
  "Annaba":          { "domicile": 850,  "bureau": 450 },
  "Guelma":          { "domicile": 850,  "bureau": 450 },
  "Constantine":     { "domicile": 800,  "bureau": 450 },
  "Médéa":           { "domicile": 750,  "bureau": 450 },
  "Mostaganem":      { "domicile": 700,  "bureau": 450 },
  "M'Sila":          { "domicile": 900,  "bureau": 600 },
  "Mascara":         { "domicile": 700,  "bureau": 450 },
  "Ouargla":         { "domicile": 950,  "bureau": 650 },
  "Oran":            { "domicile": 300,  "bureau": 400 },
  "El Bayadh":       { "domicile": 1000, "bureau": 600 },
  "Illizi":          { "domicile": null, "bureau": null },
  "Bordj Bou Arreridj": { "domicile": 800, "bureau": 450 },
  "Boumerdès":       { "domicile": 800,  "bureau": 450 },
  "El Tarf":         { "domicile": 850,  "bureau": 450 },
  "Tindouf":         { "domicile": null, "bureau": null },
  "Tissemsilt":      { "domicile": 750,  "bureau": 500 },
  "El Oued":         { "domicile": 950,  "bureau": 650 },
  "Khenchela":       { "domicile": 800,  "bureau": null },
  "Souk Ahras":      { "domicile": 800,  "bureau": 450 },
  "Tipaza":          { "domicile": 800,  "bureau": 450 },
  "Mila":            { "domicile": 800,  "bureau": 450 },
  "Aïn Defla":       { "domicile": 750,  "bureau": 450 },
  "Naâma":           { "domicile": 1000, "bureau": 600 },
  "Aïn Témouchent":  { "domicile": 650,  "bureau": 450 },
  "Ghardaïa":        { "domicile": 950,  "bureau": 600 },
  "Relizane":        { "domicile": 750,  "bureau": 450 },
  "Timimoun":        { "domicile": 1400, "bureau": null },
  "Bordj Badji Mokhtar": { "domicile": null, "bureau": null, "note": "missing" },
  "Ouled Djellal":   { "domicile": 950,  "bureau": 600 },
  "Béni Abbès":      { "domicile": 1050, "bureau": null },
  "In Salah":        { "domicile": 1600, "bureau": null, "note": "missing" },
  "In Guezzam":      { "domicile": 1600, "bureau": null, "note": "missing" },
  "Touggourt":       { "domicile": 950,  "bureau": 650 },
  "Djanet":          { "domicile": null, "bureau": null, "note": "missing" },
  "El M'Ghair":      { "domicile": 950,  "bureau": null, "note": "missing" },
  "El Meniaa":       { "domicile": 950,  "bureau": null, "note": "missing" }
};

export const getDeliveryPrice = (wilayaName: string, type: 'domicile' | 'stop_desk'): number => {
  // Extract just the name if it has a number prefix (e.g. "1-Adrar" -> "Adrar")
  const cleanName = wilayaName.replace(/^\d+-/, '');
  
  const rate = deliveryRates[cleanName];
  if (!rate) return 500; // Default fallback

  const price = type === 'domicile' ? rate.domicile : rate.bureau;
  return price || 500; // Fallback if specific price is missing
};
