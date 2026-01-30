// à remplacer par checkJwt

export const mockAuth = (req, res, next) => {
    req.user = {
        id: '12345',
        roles : ["manager", "qa"]
    };
    next();
};