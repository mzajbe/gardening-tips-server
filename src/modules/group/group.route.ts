import express from 'express';

import auth from '../../middlewares/auth';
import { multerUpload } from '../../config/multer.config';
import { GroupControllers } from './group.controller';
import { GroupPostControllers } from './groupPost.controller';

const router = express.Router();

router.post('/create', GroupControllers.createGroup);
router.get('/', GroupControllers.getAllGroups);
router.get('/posts/user/:userId', GroupPostControllers.getGroupPostsByUser);
router.get('/:id', GroupControllers.getGroupById);
router.post('/:id/join', GroupControllers.joinGroup);
router.post('/:id/leave', GroupControllers.leaveGroup);
router.delete('/:id', GroupControllers.deleteGroup);

router.get('/:id/posts', GroupPostControllers.getGroupPosts);
router.post(
  '/:id/posts',
  auth(),
  multerUpload.single('image'),
  GroupPostControllers.createGroupPost
);
router.patch('/:id/posts/:postId/disable', auth(), GroupPostControllers.setGroupPostDisabled);
router.delete('/:id/posts/:postId', auth(), GroupPostControllers.deleteGroupPost);

export const GroupRoutes = router;

