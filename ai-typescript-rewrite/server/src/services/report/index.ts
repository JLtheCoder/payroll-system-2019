import { dataAccess } from '../../data/access/index';
import { createGet } from './get';
import { createList } from './list';
import { createSave } from './save';
import { createSaveUploadId } from './save_upload_id';
import type { ReportService } from './types';

export const reportService: ReportService = {
  saveUploadId: createSaveUploadId(dataAccess),
  save: createSave(dataAccess),
  get: createGet(dataAccess),
  list: createList(dataAccess),
};

export type { ReportService } from './types';
