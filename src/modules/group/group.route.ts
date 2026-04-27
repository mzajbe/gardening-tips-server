import express from 'express';
import { GroupControllers } from './group.controller';

const router = express.Router();

router.post('/create', GroupControllers.createGroup);
router.get('/', GroupControllers.getAllGroups);
router.get('/:id', GroupControllers.getGroupById);
router.post('/:id/join', GroupControllers.joinGroup);
router.post('/:id/leave', GroupControllers.leaveGroup);
router.delete('/:id', GroupControllers.deleteGroup);

export const GroupRoutes = router;
