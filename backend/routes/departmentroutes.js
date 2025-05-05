import express from 'express';
import { getDepartmentsByOrganization } from '../controllers/departmentcontroller.js';

const router = express.Router();
router.get('/organization/:organizationId/departments', getDepartmentsByOrganization);

export default router;
