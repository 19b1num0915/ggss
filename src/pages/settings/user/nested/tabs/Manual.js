import { useState, useEffect, useCallback } from 'react';
// @mui
import {
  Checkbox,
  Grid, Stack,
  FormControlLabel
} from '@mui/material';
import { apiService } from 'src/api/api';
import { UploadSingleFile } from 'src/components/upload';
import WidInput from 'src/widget/WidInput';
// components
import Page from 'src/components/Page';
// 3rd party
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function Manual({segment, row, isEdit, displayModel}) {
  const { enqueueSnackbar } = useSnackbar();
  const [excelResp, setExcelResp] = useState({});
  const [model, setModel] = useState({});
  const [excelFile, setExcelFile] = useState(null);
  const [user, setUser] = useState(row?.segment_worker ? true : false);
  const staticData = [
    {
      id: 'Unitel',
      number: 320,
      name: 'Unitel'
    },
    {
      id: 'Toki',
      number: 320,
      name: 'Toki'
    },
    {
      id: 'Univision',
      number: 320,
      name: 'Univision'
    },
    {
      id: 'Voice BC',
      number: 255,
      name: 'Voice BC'
    },
    {
      id: 'Other operator',
      number: 160,
      name: 'Other operator'
    },
  ];
  const [test, setTest] = useState({});
  const inputChanged = (name, data) => {
    setTest({ ...test, [name]: data });
    setModel({...model, [name]: data});
  };
  useEffect(() => {
    segment(model);
  }, [model]);
  const handleUpload = async (file) => {
    const data = new FormData();
    data.append('name', 'excel');
    data.append('file', file);
    const response = await apiService.postMethod('/uploadXlsx', data);
    response.status === 200 ?  enqueueSnackbar(response.data.message) : enqueueSnackbar('ELSE');
    setExcelResp(response.data);
    inputChanged('segmentId', response.data.segment_id)
  };
  const uploadHandler = useCallback((acceptedFiles) => {
    if (acceptedFiles) {
      const inputFile = acceptedFiles[0];
      setExcelFile(inputFile);
      handleUpload(inputFile);
    }
  }, []);
  return (
    <Page title="Сегмент">
      <Grid item xs={12} md={12}>
          <Stack spacing={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={user} disabled={isEdit} onChange={e => { setUser(e.target.checked) }} />}
                label="Business Analysis"
              />
              {user && (
                <WidInput
                  type="select"
                  regex="required"
                  data={staticData}
                  disabled={isEdit}
                  defaultValue={row ? row.segment_worker : ''}
                  selectField="name"
                  label="Business Analysis"
                  name="segment_worker"
                  dataChanged={(data) => inputChanged('segment_worker', data)}
                />

              )}
            </Stack>
            {(!isEdit || displayModel.action_id === 10) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <UploadSingleFile onDrop={uploadHandler} file={excelFile ? '/image/excel-power-up.jpg' : ''} />
            </Stack>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <WidInput
                type="description"
                regex="required"
                defaultValue={row?.seg_descr ? row?.seg_descr : ''}
                value={model.seg_descr}
                disabled={isEdit}
                label="Тайлбар"
                name="seg_descr"
                dataChanged={(data) => inputChanged('seg_descr', data)}
              />
            </Stack>
              {excelResp.total_msisdns && (<>Нийт илгээх хэрэглэгчдийн тоо: {excelResp.total_msisdns}</>)}
          </Stack>
      </Grid>
    </Page>
  );
}
