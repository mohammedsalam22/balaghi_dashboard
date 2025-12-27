export interface ReportExportParams {
  format: 'pdf' | 'csv';
  agencyId?: string;
}

export interface ReportData {
  id: string;
  trackingNumber: string;
  complaintType: string;
  description: string;
  citizenName: string;
  agencyName: string;
  status: string;
  createdAt: string;
}

export type ExportFormat = 'pdf' | 'csv';

export interface ReportExportState {
  loading: boolean;
  error: string | null;
  lastExportFormat: ExportFormat | null;
  lastExportTime: string | null;
}
