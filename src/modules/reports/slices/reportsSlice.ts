import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ReportExportState, ExportFormat, ReportExportParams } from '../types';
import { reportsService } from '../services/reportsService';

const initialState: ReportExportState = {
  loading: false,
  error: null,
  lastExportFormat: null,
  lastExportTime: null,
};

// Async thunk for exporting reports
export const exportReport = createAsyncThunk(
  'reports/exportReport',
  async (params: ReportExportParams, { rejectWithValue }) => {
    try {
      await reportsService.exportReport(params);
      return params.format;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to export report');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetExportState: (state) => {
      state.lastExportFormat = null;
      state.lastExportTime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Export report
      .addCase(exportReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportReport.fulfilled, (state, action: PayloadAction<ExportFormat>) => {
        state.loading = false;
        state.lastExportFormat = action.payload;
        state.lastExportTime = new Date().toISOString();
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetExportState } = reportsSlice.actions;
export default reportsSlice.reducer;
