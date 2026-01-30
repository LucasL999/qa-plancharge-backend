import { Router } from 'express';
import { mockAuth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/roles.middleware.js';
import * as controller from '../controllers/chantier.controller.js';

const router = Router();

router.get('/chantiers', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getAllChantiers
);

router.post('/chantiers', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.createChantier
);

router.get('/chantiers/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getChantierById
);

router.put('/chantiers/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.updateChantier
);

export default router;