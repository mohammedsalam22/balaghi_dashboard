import type { ReportExportParams } from '../types';
import { apiService } from '../../../shared/services/apiService';

class ReportsService {
 
  async exportReport(params: ReportExportParams): Promise<void> {
    const { format, agencyId } = params;
    
    const queryParams = new URLSearchParams({
      format,
      ...(agencyId && { agencyId }),
    });

    const url = `/complaints/export-report?${queryParams}`;
    
    try {
      const axiosInstance = apiService.getAxiosInstance();
      
      const response = await axiosInstance.get(url, {
        responseType: 'blob', // Important for file downloads
      });

      
      if (!response.data) {
        throw new Error('No file data received from server');
      }

      
      const blob = new Blob([response.data], {
        type: format === 'pdf' 
          ? 'application/pdf' 
          : 'text/csv',
      });

      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const filename = `complaints_report.${format}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('Invalid export format specified');
      } else if (error.response?.status === 404) {
        throw new Error('No complaints found for the specified criteria');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized access');
      } else if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to export reports');
      } else {
        throw new Error('Failed to export report. Please try again.');
      }
    }
  }
}

export const reportsService = new ReportsService();
