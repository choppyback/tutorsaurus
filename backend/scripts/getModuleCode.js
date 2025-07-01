const axios = require("axios");
const pool = require("../db");

const MODULE_LIST_URL = "https://api.nusmods.com/v2/2024-2025/moduleList.json";

const getModuleCode = async () => {
  try {
    const { data: modules } = await axios.get(MODULE_LIST_URL);

    for (const module of modules) {
      const { moduleCode } = module;

      await pool.query(
        `INSERT INTO modules (code)
         VALUES ($1)
         ON CONFLICT (code) DO NOTHING`,
        [moduleCode]
      );
    }

    console.log("Modules populated successfully!");
  } catch (err) {
    console.error("Error populating modules:", err.message);
  } finally {
    pool.end();
  }
};

getModuleCode();
