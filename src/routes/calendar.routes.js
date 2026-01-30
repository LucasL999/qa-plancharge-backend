import { Router } from 'express';
import { mockAuth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/roles.middleware.js';
import * as controller from '../controllers/calendar.controller.js';

const router = Router();

router.get('/calendar', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getAllCalendarEvents
);

router.post('/calendar', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.createCalendarEvent
);

router.get('/calendar/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.getCalendarEventById
);

router.put('/calendar/:id', 
    mockAuth, 
    authorize('manager', 'qa'), 
    controller.updateCalendarEvent
);

export default router;