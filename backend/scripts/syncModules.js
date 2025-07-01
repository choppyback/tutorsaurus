const axios = require("axios");
const pool = require("../db");

const MODULE_LIST_URL = "https://api.nusmods.com/v2/2024-2025/moduleList.json";

const syncModules = async () => {
  try {
    // 1. Fetch latest module list
    const { data: modulesFromAPI } = await axios.get(MODULE_LIST_URL);
    const moduleCodesFromAPI = modulesFromAPI.map((mod) => mod.moduleCode);

    // 2. Insert any new codes
    for (const code of moduleCodesFromAPI) {
      await pool.query(
        `INSERT INTO modules (code)
         VALUES ($1)
         ON CONFLICT (code) DO NOTHING`,
        [code]
      );
    }

    // 3. Remove any codes that are no longer in NUSMods
    const result = await pool.query("SELECT code FROM modules");
    const moduleCodesInDB = result.rows.map((row) => row.code);

    const codesToDelete = moduleCodesInDB.filter(
      (code) => !moduleCodesFromAPI.includes(code)
    );

    for (const code of codesToDelete) {
      await pool.query("DELETE FROM modules WHERE code = $1", [code]);
    }

    console.log("Module codes synced successfully!");
  } catch (err) {
    console.error("Error syncing module codes:", err.message);
  } finally {
    pool.end();
  }
};

syncModules();
