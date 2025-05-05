import Department from '../models/Department.js';

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Endpoints for department data
 */

/**
 * @swagger
 * /api/employee/department/organization/{organizationId}/departments:
 *   get:
 *     summary: Get all departments under an organization
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 departments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       organization:
 *                         type: string
 *       400:
 *         description: Bad request (missing organizationId)
 *       404:
 *         description: No departments found for this organization
 *       500:
 *         description: Internal server error
 */
export const getDepartmentsByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is required." });
    }

    const departments = await Department.find({ organization: organizationId })
      .sort({ name: 1 }) // Optional: for consistent ordering
      .lean();

    if (!departments || departments.length === 0) {
      return res.status(404).json({ error: "No departments found for this organization." });
    }

    return res.status(200).json({ departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};