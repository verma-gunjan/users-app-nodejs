const { users, roles } = require("../dummy_data/data");

function checkPermission(requiredPermission) {
  return (req, res, next) => {
    const userId = Number(req.headers["authorization"]);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Find permissions from all user roles
    const userPermissions = user.roles.flatMap(roleCode => {
      const role = roles.find(r => r.code === roleCode);
      return role ? role.permissions : [];
    });

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: "Not allowed to perform action due to insufficient permissions"
      });
    }

    req.user = user; // Attach user to request
    next();
  };
}

module.exports = checkPermission;
