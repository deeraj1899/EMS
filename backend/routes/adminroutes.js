import { Router } from 'express';
import { addemployee, addreview, addwork, deleteemployee, deleteReview, editReview, getallemployees, getAllReviews, getAllSubmittedWorks, getdepartmentemployees, promoteemployee,getallorganizations,deleteOrganization,SuperAdminLogin } from '../controllers/admincontroller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = Router();

router.get('/getallemployees/:organizationId', getallemployees);
router.get('/getdepartmentemployees/:managerId', getdepartmentemployees);
router.post(`/addemployee/:organizationId`,addemployee);
router.delete('/delete/:employeeId/:organizationId', deleteemployee);
router.post('/addwork/:adminId/:employeeId', addwork);
router.put('/promote/:employeeId', promoteemployee);
router.get('/getallsubmittedworks',isAuthenticated,getAllSubmittedWorks);
router.get('/review/:submittedWorkId',getAllReviews);
router.post('/addreview',addreview);
router.put('/editreview/:id', editReview);
router.delete('/deletereview/:id', deleteReview);
router.get("/getallorganizations",getallorganizations);
router.delete(':organizationId', deleteOrganization);
router.post("/SuperAdminLogin",SuperAdminLogin);
export default router;
