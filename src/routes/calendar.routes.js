import { Router } from 'express';
import { mockAuth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/roles.middleware.js';
import * as controller from '../controllers/calendar.controller.js';

const router = Router();

router.get('/calendar', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getAll
);

router.post('/calendar', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.create
);

router.get('/calendar/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getById
);

router.put('/calendar/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.update
);

export default router;