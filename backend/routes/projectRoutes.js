const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const {
  createProject, getProjects, getProject,
  pushWork, pullBack, getWorkflow,
} = require('../controllers/projectController');

router.get('/',           protect, getProjects);
router.get('/:id',        protect, getProject);
router.get('/:id/workflow', protect, getWorkflow);
router.post('/',          protect, roleCheck('admin'), createProject);
router.post('/:id/push',  protect, roleCheck('student'), pushWork);
router.post('/:id/pullback', protect, roleCheck('mentor', 'admin'), pullBack);

module.exports = router;