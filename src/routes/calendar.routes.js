import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/roles.middleware.js';
import * as controller from '../controllers/calendar.controller.js';

const router = Router();

router.get('/calendar', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.getAll
);

router.post('/calendar', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.create
);

router.get('/calendar/:id', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.getById
);

router.put('/calendar/:id', 
    verifyToken, 
    authorize('manager', 'QA'), 
    controller.update
);

export default router;