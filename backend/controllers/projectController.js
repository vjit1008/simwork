const Project = require('../models/Project');
const User = require('../models/User');
const WorkflowEvent = require('../models/WorkflowEvent');
const Credit = require('../models/Credit');
const Notification = require('../models/Notification');

// AI assignment — scores students by skill match + workload
const scoreStudent = (student, requiredSkills) => {
  const studentSkills = student.skills || [];
  const matched = requiredSkills.filter(s =>
    studentSkills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
  ).length;
  return matched;
};

// POST /api/projects — admin creates project + AI assigns students
const createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, type, departments, repoUrl } = req.body;

    const students = await User.find({ role: 'student' });

    const assignedDepts = await Promise.all(
      departments.map(async (dept) => {
        const scored = students
          .map(s => ({ student: s, score: scoreStudent(s, requiredSkills) }))
          .sort((a, b) => b.score - a.score);

        const picked = scored.slice(0, dept.count || 2).map(s => s.student._id);

        return {
          name: dept.name,
          students: picked,
          currentTask: dept.task || '',
          status: 'pending',
        };
      })
    );

    const project = await Project.create({
      title, description, requiredSkills, type,
      departments: assignedDepts,
      repoUrl,
      createdBy: req.user._id,
      status: 'active',
    });

    // Notify first dept students
    const firstDept = assignedDepts[0];
    await Promise.all(firstDept.students.map(sid =>
      Notification.create({
        userId: sid,
        title: 'New project assigned',
        message: `You have been assigned to "${title}" — ${firstDept.name} department.`,
        type: 'workflow',
        projectId: project._id,
      })
    ));

    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('❌ Create project error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects — get all projects (admin/mentor) or assigned (student)
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'student') {
      projects = await Project.find({
        'departments.students': req.user._id,
      }).populate('departments.students', 'name email');
    } else {
      projects = await Project.find()
        .populate('departments.students', 'name email')
        .populate('createdBy', 'name');
    }
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('departments.students', 'name email role');
    if (!project) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects/:id/push — student pushes work, notifies next dept
const pushWork = async (req, res) => {
  try {
    const { note } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found.' });

    const deptIndex = project.currentDeptIndex;
    const currentDept = project.departments[deptIndex];

    // Check student belongs to this dept
    const isMember = currentDept.students.some(
      s => s.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ success: false, message: 'Not your department.' });

    // Award credits
    await Credit.create({
      studentId: req.user._id,
      projectId: project._id,
      stage: currentDept.name,
      points: 10,
    });

    // Log workflow event
    await WorkflowEvent.create({
      projectId: project._id,
      fromDept: currentDept.name,
      toDept: project.departments[deptIndex + 1]?.name || 'completed',
      triggeredBy: req.user._id,
      action: 'push',
      note: note || '',
    });

    // Move to next dept or complete
    if (deptIndex + 1 < project.departments.length) {
      project.departments[deptIndex].status = 'completed';
      project.currentDeptIndex = deptIndex + 1;
      project.departments[deptIndex + 1].status = 'in-progress';

      // Notify next dept
      const nextDept = project.departments[deptIndex + 1];
      await Promise.all(nextDept.students.map(sid =>
        Notification.create({
          userId: sid,
          title: 'Your turn',
          message: `"${project.title}" has been passed to ${nextDept.name}. Please pull and continue.`,
          type: 'workflow',
          projectId: project._id,
        })
      ));
    } else {
      project.departments[deptIndex].status = 'completed';
      project.status = 'completed';
    }

    await project.save();
    res.json({ success: true, message: 'Work pushed.', project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects/:id/pullback — mentor sends back for fixes
const pullBack = async (req, res) => {
  try {
    const { note } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found.' });

    const deptIndex = project.currentDeptIndex;
    if (deptIndex === 0) return res.status(400).json({ success: false, message: 'Already at first stage.' });

    const prevDept = project.departments[deptIndex - 1];

    await WorkflowEvent.create({
      projectId: project._id,
      fromDept: project.departments[deptIndex].name,
      toDept: prevDept.name,
      triggeredBy: req.user._id,
      action: 'pullback',
      note: note || '',
    });

    project.departments[deptIndex].status = 'pending';
    project.departments[deptIndex - 1].status = 'in-progress';
    project.currentDeptIndex = deptIndex - 1;
    await project.save();

    // Notify previous dept students
    await Promise.all(prevDept.students.map(sid =>
      Notification.create({
        userId: sid,
        title: 'Revision required',
        message: `"${project.title}" has been sent back to ${prevDept.name}. Reason: ${note || 'Please review.'}`,
        type: 'review',
        projectId: project._id,
      })
    ));

    res.json({ success: true, message: 'Sent back for revision.', project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/:id/workflow — get full workflow history
const getWorkflow = async (req, res) => {
  try {
    const events = await WorkflowEvent.find({ projectId: req.params.id })
      .populate('triggeredBy', 'name')
      .sort({ createdAt: 1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createProject, getProjects, getProject, pushWork, pullBack, getWorkflow };