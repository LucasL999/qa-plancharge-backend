import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.decode(token); 
    // ⚠️ idéalement jwt.verify avec clé publique Keycloak en prod

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      email: decoded.email,
      sub: decoded.sub
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token error" });
  }
}