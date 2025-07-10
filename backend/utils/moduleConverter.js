const db = require("../db");

// Module Code (CS2030) -> Module ID
async function getModuleIdByCode(code) {
  const result = await db.query(
    "SELECT module_id FROM modules WHERE code = $1",
    [code]
  );
  if (result.rows.length === 0) {
    throw new Error(`Module code "${code}" not found`);
  }
  return result.rows[0].module_id;
}

// Module ID -> Module Code (CS2030)
async function getModuleCodeById(module_id) {
  const result = await db.query(
    "SELECT code FROM modules WHERE module_id = $1",
    [module_id]
  );
  if (result.rows.length === 0) {
    throw new Error(`Module ID "${module_id}" not found`);
  }
  return result.rows[0].code;
}

module.exports = {
  getModuleIdByCode,
  getModuleCodeById,
};
