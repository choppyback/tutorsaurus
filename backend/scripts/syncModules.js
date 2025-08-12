const axios = require("axios");
const pool = require("../db");

const MODULE_LIST_URL = "https://api.nusmods.com/v2/2024-2025/moduleList.json";

const syncModules = async () => {
  try {
    // 1. Fetch latest module list
    const { data: modulesFromAPI } = await axios.get(MODULE_LIST_URL);

    const moduleCodesFromAPI = [];

    // 2. Insert or update each module code and title
    for (const mod of modulesFromAPI) {
      const { moduleCode, title } = mod;
      moduleCodesFromAPI.push(moduleCode);

      await pool.query(
        `INSERT INTO modules (code, title)
         VALUES ($1, $2)
         ON CONFLICT (code)
         DO UPDATE SET title = EXCLUDED.title`,
        [moduleCode, title]
      );
    }

    // 3. Delete any codes no longer in NUSMods
    const result = await pool.query("SELECT code FROM modules");
    const moduleCodesInDB = result.rows.map((row) => row.code);

    const codesToDelete = moduleCodesInDB.filter(
      (code) => !moduleCodesFromAPI.includes(code)
    );

    for (const code of codesToDelete) {
      await pool.query("DELETE FROM modules WHERE code = $1", [code]);
    }

    console.log("Module codes and titles synced successfully!");
  } catch (err) {
    console.error("Error syncing modules:", err.message);
  }
};

module.exports = syncModules;
