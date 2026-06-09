import ExcelJS from "exceljs";
import pool from "../db/index.js";

// ✅ calcul jours ouvrés (fiable)
async function getWorkingDays(start, end) {
  let count = 0;
  const current = new Date(start);
  const year = current.getFullYear();

  const res = await fetch(`https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`);

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des jours fériés");
  }

  const holidaysJson = await res.json();
  const holidays = new Set(Object.keys(holidaysJson));
  const format = (d) => d.toISOString().split("T")[0];

  while (current <= end) {
    const day = current.getDay();
    const formatted = format(current);
    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidays.has(formatted);

    if (!isWeekend && !isHoliday) count++;
    current.setDate(current.getDate() + 1);
  }
    
  return count-1;
}

async function exportExcel(req, res) {
  try {
    // ✅ 1. récupération données
    const result = await pool.query(`
      SELECT titre, statut.libelle AS statut, cp, nature,
      priorite.libelle AS priorite, capacite, date_debut, date_fin, 
      finance, prev, COALESCE(cons, 0) AS cons,
      prev - COALESCE(cons, 0) AS raf 
      FROM chantier 
      JOIN statut ON chantier.id_statut = statut.id_statut 
      JOIN priorite ON chantier.id_priorite = priorite.id_priorite
      ORDER BY titre ASC;
    `);

    const result2 = await pool.query(`
      SELECT firstname, name, nbrestant FROM users WHERE role=1
      ORDER BY name ASC;
    `);

    const data = result.rows;
    const data2 = result2.rows;

    // ✅ 2. calcul jours ouvrés global
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfYear = new Date(today.getFullYear(), 11, 31);

    const workingDays = await getWorkingDays(today, endOfYear);

    // ✅ 3. création Excel
    const workbook = new ExcelJS.Workbook();

    // ======================
    // FEUILLE CHANTIERS
    // ======================
    const worksheet = workbook.addWorksheet("Chantiers");

    worksheet.columns = [
      { header: "Titre", key: "titre", width: 30 },
      { header: "Statut", key: "statut", width: 15 },
      { header: "CP", key: "cp", width: 30 },
      { header: "Nature", key: "nature", width: 25 },
      { header: "Priorité", key: "priorite", width: 15 },
      { header: "Capacité", key: "capacite", width: 15 },
      { header: "Début", key: "date_debut", width: 15 },
      { header: "Fin", key: "date_fin", width: 15 },
      { header: "Financement", key: "finance", width: 30 },
      { header: "Prev", key: "prev", width: 15 },
      { header: "Cons", key: "cons", width: 15 },
      { header: "RAF", key: "raf", width: 15 },
    ];

    // ✅ insertion sécurisée (IMPORTANT)
    data.forEach(row => {
      worksheet.addRow({
        titre: row.titre || "",
        statut: row.statut || "",
        cp: row.cp || "",
        nature: row.nature || "",
        priorite: row.priorite || "",
        capacite: row.capacite ?? 0,
        date_debut: row.date_debut ? new Date(row.date_debut) : null,
        date_fin: row.date_fin ? new Date(row.date_fin) : null,
        finance: row.finance || "",
        prev: row.prev ?? 0,
        cons: row.cons ?? 0,
        raf: row.raf ?? 0
      });
    });

    // ======================
    // FEUILLE QA
    // ======================
    const worksheet2 = workbook.addWorksheet("QAs");

    worksheet2.columns = [
      { header: "Prénom", key: "firstname", width: 20 },
      { header: "Nom", key: "name", width: 20 },
      { header: "Nb Restant", key: "nbrestant", width: 15 },
      { header: "Capacité", key: "capacite", width: 15 },
    ];

    // ✅ insertion avec calcul fiable
    data2.forEach(row => {
      //const nbRestant = row.nbrestant ?? 0;

      worksheet2.addRow({
        firstname: row.firstname || "",
        name: row.name || "",
        email: row.email || "",
        nbrestant: row.nbrestant ?? 0,
        capacite: Math.max(0, workingDays - row.nbrestant ?? 0)
      });
    });

    // ✅ style header (bonus pro)
    worksheet.getRow(1).font = { bold: true };
    worksheet2.getRow(1).font = { bold: true };

    // ✅ headers HTTP
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=export_chantiers.xlsx"
    );

    // ✅ envoi Excel
    await workbook.xlsx.write(res);
    
    res.end();
    console.log("✅ Excel généré et envoyé sans erreur");
    
  } catch (err) {
    console.error("❌ Erreur export:", err);
    
    if (!res.headersSent) {
        res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

export { exportExcel };