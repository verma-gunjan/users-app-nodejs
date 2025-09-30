const { roles, groups } = require('../dummy_data/data');

const allowedFields = ['name', 'roles', 'groups'];

const validateUserData = (data, isPatch = false) => {
  const keys = Object.keys(data);

  // Reject unknown fields
  if (!keys.every(k => allowedFields.includes(k))) return false;

  // Validate each field only if it exists
  if ('name' in data && (typeof data.name !== 'string' || data.name.length > 100)) return false;
  if ('roles' in data && (!Array.isArray(data.roles) || !data.roles.every(r => roles.includes(r)))) return false;
  if ('groups' in data && (!Array.isArray(data.groups) || !data.groups.every(g => groups.includes(g)))) return false;

  // For POST, all required fields must exist
  if (!isPatch) {
    if (!('name' in data) || !('roles' in data) || !('groups' in data)) return false;
  }

  return true;
};

module.exports = validateUserData;
