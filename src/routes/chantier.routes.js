import { Router } from 'express';
import { mockAuth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/roles.middleware.js';
import * as controller from '../controllers/chantier.controller.js';

const router = Router();

router.get('/chantiers', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getAll
);

router.post('/chantiers', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.create
);

router.get('/chantiers/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getById
);

router.put('/chantiers/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.update
);

export default router;