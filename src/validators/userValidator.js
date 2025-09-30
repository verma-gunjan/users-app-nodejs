const { roles, groups } = require('../dummy_data/data');

const validateUserData = (data) => {
  const { name, roles: userRoles, groups: userGroups } = data;

  if (!name || typeof name !== 'string' || name.length > 100) return false;
  if (!Array.isArray(userRoles) || userRoles.length === 0 || !userRoles.every(r => roles.includes(r))) return false;
  if (!Array.isArray(userGroups) || userGroups.length === 0 || !userGroups.every(g => groups.includes(g))) return false;

  return true;
};

module.exports = validateUserData;
