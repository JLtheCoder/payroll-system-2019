import { Router } from 'express';
import multer from 'multer';
import { payrollController } from '../../controllers/payroll/index';
import { reportController } from '../../controllers/report/index';

const upload = multer();

export const apiRouter = Router();

apiRouter.get('/reports', reportController.getReportList);
apiRouter.get('/report/:reportId', reportController.getReport);
apiRouter.post(
  '/payroll/report',
  upload.single('csv'),
  payrollController.validateCsvFile,
  payrollController.createReport,
);
