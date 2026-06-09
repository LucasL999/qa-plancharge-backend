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
      SELECT firstname, name, nbannual FROM users WHERE role=1
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

    const lastRow = data.length + 1;
    const totalRow = lastRow + 3;

    worksheet.getCell(`J${totalRow}`).value ="Charge globale";
    worksheet.getCell(`J${totalRow}`).font = { bold: true };
    worksheet.getColumn("J").width = 20;
    worksheet.getCell(`J${totalRow + 1}`).value = { formula: `SUM(J2:J${data.length + 1})`, result: 0 };

    worksheet.getCell(`K${totalRow}`).value ="Consommation globale";
    worksheet.getCell(`K${totalRow}`).font = { bold: true };
    worksheet.getColumn("K").width = 30;
    worksheet.getCell(`K${totalRow + 1}`).value = { formula: `SUM(K2:K${data.length + 1})`, result: 0 };

    worksheet.getCell(`L${totalRow}`).value ="RAF global";
    worksheet.getCell(`L${totalRow}`).font = { bold: true };
    worksheet.getColumn("L").width = 20;
    worksheet.getCell(`L${totalRow + 1}`).value = { formula: `SUM(L2:L${data.length + 1})`, result: 0 };

    worksheet.getCell(`K${totalRow + 4}`).value ="Total capacitaire";
    worksheet.getCell(`K${totalRow + 4}`).font = { bold: true };
    worksheet.getCell(`K${totalRow + 5}`).value = { formula: `QAs!H2`, result: 0 };

    worksheet.getCell(`J${totalRow + 4}`).value = "Delta";
    worksheet.getCell(`J${totalRow + 4}`).font = { bold: true };
    worksheet.getCell(`J${totalRow + 5}`).value = { formula: `K${totalRow + 5} - L${totalRow + 1}`, result: 0 };

    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB0C4DE' }
    };
    
    worksheet.columns.forEach(col => {
      col.alignment = { horizontal: "center", vertical: "middle" };
    });
 
  const startRow = totalRow;
  const endRow = totalRow + 5;

  // ✅ Ligne du haut
  ["J", "K", "L"].forEach(col => {
    worksheet.getCell(`${col}${startRow}`).border = {
      ...worksheet.getCell(`${col}${startRow}`).border,
      top: { style: "medium" }
    };
  });

  // ✅ Ligne du bas
  ["J", "K", "L"].forEach(col => {
    worksheet.getCell(`${col}${endRow}`).border = {
      ...worksheet.getCell(`${col}${endRow}`).border,
      bottom: { style: "medium" }
    };
  });

  // ✅ Colonne gauche (J)
  for (let row = startRow; row <= endRow; row++) {
    worksheet.getCell(`J${row}`).border = {
      ...worksheet.getCell(`J${row}`).border,
      left: { style: "medium" }
    };
  }

  // ✅ Colonne droite (L)
  for (let row = startRow; row <= endRow; row++) {
    worksheet.getCell(`L${row}`).border = {
      ...worksheet.getCell(`L${row}`).border,
      right: { style: "medium" }
    };
  }



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
        nbrestant: row.nbannual ?? 0,
        capacite: Math.max(0, workingDays - row.nbannual ?? 0)
      });
    });

    worksheet2.getCell("H1").value ="Total capacitaire";
    worksheet2.getCell("H1").font = { bold: true };
    worksheet2.getColumn("H").width = 20;
    worksheet2.getCell("H2").value = { formula: `SUM(D2:D${data2.length + 1})`, result: 0 };

    // ✅ style header (bonus pro)
    worksheet.getRow(1).font = { bold: true };
    worksheet2.getRow(1).font = { bold: true };
    
    worksheet2.columns.forEach(col => {
      col.alignment = { horizontal: "center", vertical: "middle" };
    });

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