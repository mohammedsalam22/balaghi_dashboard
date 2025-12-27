import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as CsvIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../shared/store/hooks';
import type { RootState } from '../../../shared/store/store';
import { exportReport, clearError } from '../slices/reportsSlice';
import { fetchAgenciesAsync } from '../../governmentagency/slices/governmentAgenciesSlice';
import type { ExportFormat, ReportExportParams } from '../types';
import type { GovernmentAgency } from '../../governmentagency/types';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { loading, error, lastExportFormat, lastExportTime } = useSelector(
    (state: RootState) => state.reports
  );
  const { agencies, isLoading: agenciesLoading } = useSelector(
    (state: RootState) => state.governmentAgencies
  );

  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [agencyId, setAgencyId] = useState('');

  // Fetch agencies on component mount
  useEffect(() => {
    void dispatch(fetchAgenciesAsync());
  }, [dispatch]);

  const handleExport = () => {
    const params: ReportExportParams = {
      format: exportFormat,
      ...(agencyId && { agencyId }),
    };

    dispatch(exportReport(params));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const formatLastExportTime = (time: string) => {
    return new Date(time).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('reports.title')}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('reports.description')}
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={handleClearError}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Export Options Card */}
        <Box sx={{ flex: 1, maxWidth: { md: '50%' } }}>
          <Paper elevation={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('reports.exportOptions')}
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('reports.format')}</InputLabel>
                <Select
                  value={exportFormat}
                  label={t('reports.format')}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  disabled={loading}
                >
                  <MenuItem value="pdf">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PdfIcon color="error" />
                      {t('reports.pdfFormat')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="csv">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CsvIcon color="success" />
                      {t('reports.csvFormat')}
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('reports.agency')}</InputLabel>
                <Select
                  value={agencyId}
                  label={t('reports.agency')}
                  onChange={(e) => setAgencyId(e.target.value)}
                  disabled={loading || agenciesLoading}
                >
                  <MenuItem value="">
                    <em>{t('reports.allAgencies')}</em>
                  </MenuItem>
                  {agencies.map((agency: GovernmentAgency) => (
                    <MenuItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                onClick={handleExport}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                fullWidth
              >
                {loading
                  ? t('reports.exporting')
                  : t('reports.exportReport')}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Export History */}
        <Box>
          <Paper elevation={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('reports.exportHistory')}
              </Typography>

              {lastExportTime ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={lastExportFormat === 'pdf' ? <PdfIcon /> : <CsvIcon />}
                    label={lastExportFormat?.toUpperCase()}
                    color={lastExportFormat === 'pdf' ? 'error' : 'success'}
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('reports.lastExport')}: {formatLastExportTime(lastExportTime)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('reports.noExports')}
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsPage;
