import axios from 'axios';

export const uploadCsv = (formData) => {
  return axios({
    method: 'post',
    url: '/api/payroll/report',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getReportList = () => {
  return axios({
    method: 'get',
    url: '/api/reports',
  });
};

export const getReport = (reportId) => {
  return axios({
    method: 'get',
    url: `/api/report/${reportId}`,
  });
};
