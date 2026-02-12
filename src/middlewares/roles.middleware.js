export function authorize(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: "Aucun rôle détecté" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    next();
  };
}
