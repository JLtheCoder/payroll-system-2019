const upload  = require('multer')();
const router = require('express').Router();
const payrollController = require('../../controllers/payroll');
const reportController = require('../../controllers/report');

router.get('/reports', reportController.getReportList);
router.get('/report/:reportId', reportController.getReport);
router.post('/payroll/report',
            upload.single('csv'),
            payrollController.validateCsvFile,
            payrollController.createReport);

module.exports = router;
