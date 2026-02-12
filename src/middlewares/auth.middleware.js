import 'dotenv/config';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import pool from '../db/index.js';

const issuer = process.env.KEYCLOAK_ISSUER; // p.ex. https://kc.example.com/realms/monrealm
const jwksUri = new URL(`${issuer}/protocol/openid-connect/certs`);
const JWKS = createRemoteJWKSet(jwksUri);

// Optionnel : valider l’audience si tu en utilises une
const expectedAud = process.env.KEYCLOAK_AUDIENCE; // client-id côté Keycloak (resource / client)

export default async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // 1) Vérification du token (issuer, exp, signature, aud)
    const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
      issuer,
      audience: expectedAud || undefined, // mets une valeur si tu veux durcir
    });

    // Logs utiles en dev
    // console.debug('Header alg:', protectedHeader?.alg, 'sub:', payload?.sub);

    // 2) Extraire un email fiable
    const emailFromToken =
      (typeof payload.email === 'string' && payload.email) ||
      (typeof payload.preferred_username === 'string' && payload.preferred_username) ||
      null;

    if (!emailFromToken) {
      return res.status(400).json({ error: 'Email manquant dans le token' });
    }

    // Optionnel : n’autoriser que les emails vérifiés
    if (payload.email && payload.email_verified === false) {
      return res.status(403).json({ error: 'Email non vérifié' });
    }

    // 3) Recherche BDD (normalisation casse/espaces)
    const email = emailFromToken.trim().toLowerCase();
    const result = await pool.query(
      `SELECT email, role
       FROM users
       WHERE LOWER(TRIM(email)) = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      // IMPORTANT: ne pas appeler next() ici
      return res.status(403).json({ error: 'Utilisateur non autorisé' });
    }

    // 4) Hydrater req.user et continuer
    req.user = {
      ...result.rows[0],
      tokenSub: payload.sub,
      tokenEmail: emailFromToken,
      realmRoles: Array.isArray(payload.realm_access?.roles) ? payload.realm_access.roles : [],
      resourceAccess: payload.resource_access || {},
    };

    // console.log('Utilisateur authentifié:', req.user);
    return next();

  } catch (err) {
    console.error('Erreur verifyToken:', err);
    return res.status(401).json({ error: 'Token invalide' });
  }
}
