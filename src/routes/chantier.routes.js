import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/roles.middleware.js';
import * as controller from '../controllers/chantier.controller.js';

const router = Router();

router.get('/chantiers', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.getAll
);

router.post('/chantiers', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.create
);

router.get('/chantiers/:id', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.getById
);

router.put('/chantiers/:id', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.update
);

export default router;