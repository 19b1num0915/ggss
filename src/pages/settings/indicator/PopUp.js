import { useDebugValue, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Dialog, Tooltip, Tab, Box, Tabs, IconButton, DialogActions, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { apiService } from 'src/api/api';
import WidInput from 'src/widget/WidInput';
import { capitalCaseTransform } from 'change-case';
// 3rd party
import { FormikProvider, Form, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/Iconify';
import * as Yup from 'yup';
import { array } from 'i/lib/util';


export default function PopUp({ popUpName, doAction, confirmModal, data, selectedTree, indicatorTypeList, popAction, indicatorParents }) {
  let dayjs = require('dayjs');
  const [currentTab, setCurrentTab] = useState('Table value');
  const ACCOUNT_TABS = [
    {
      value: 'Table value',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
          <WidInput
            type="text"
            regex="required"
            label="Нэр"
            defaultValue={data.val || ''}
            name="value"
            dataChanged={(data) => inputChanged('value', data)}
          />
          <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
            <IconButton>
              <Iconify icon={'ant-design:question-circle-outlined'} />
            </IconButton>
          </Tooltip>
        </Stack>
      </>,
    },
    {
      value: 'Indicator',
      icon: <Iconify icon={'eva:checkmark-circle-2-fill'} width={20} height={20} />,
      component: <>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <WidInput
              type="select"
              regex="required"
              label="Type"
              data={indicatorTypeList}
              defaultValue={doAction === 2 ? data?.type_id : ''}
              selectField="name"
              name="type_id"
              dataChanged={(data) => inputChanged('type_id', data)}
            />
            <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
              <IconButton>
                <Iconify icon={'ant-design:question-circle-outlined'} />
              </IconButton>
            </Tooltip>
            <WidInput
              type="text"
              regex="required"
              label="Нэр"
              defaultValue={doAction === 2 ? data?.name : ''}
              name="value"
              dataChanged={(data) => inputChanged('value', data)}
            />
            <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
              <IconButton>
                <Iconify icon={'ant-design:question-circle-outlined'} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <WidInput
              type="text"
              regex="required"
              label="Table Name"
              defaultValue={doAction === 2 ? data?.table_name : ''}
              name="table_name"
              dataChanged={(data) => inputChanged('table_name', data)}
            />
            <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
              <IconButton>
                <Iconify icon={'ant-design:question-circle-outlined'} />
              </IconButton>
            </Tooltip>
            <WidInput
              type="text"
              regex="required"
              label="Column Name"
              defaultValue={doAction === 2 ? data?.column_name : ''}
              name="column_name"
              dataChanged={(data) => inputChanged('column_name', data)}
            />
            <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
              <IconButton>
                <Iconify icon={'ant-design:question-circle-outlined'} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <WidInput
              type="description"
              regex="required"
              label="Raw query field"
              defaultValue={doAction === 2 ? data?.raw_query : ''}
              name="raw_query"
              dataChanged={(data) => inputChanged('raw_query', data)}
            />
            <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
              <IconButton>
                <Iconify icon={'ant-design:question-circle-outlined'} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

      </>,
    },
  ];
  const ValidationSchema = Yup.object().shape({
    value: Yup.string()
      .required('SMS Required'),
  });

  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      value: data ? data.val : '',
      type_id: data ? data.type_id : '',
      table_name: data ? data.table_name : '',
      column_name: data ? data.column_name : '',
      raw_query: data ? data.raw_query : '',
      type: data.id === 'root' ? 'indicator' : 'sub_parent'
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isSubmitting) {
          let url = '';
          if (doAction === 1) {
            url = currentTab === 'Indicator' ? '/indicator/create' : '/indicator/create/values';

            data.meIndicator ? values.type = 'indicator' : values.type = 'sub_parent';
            if (currentTab === 'Table value') {
              values.ind_id = data.id;
              delete values.parent_id;
            } else {
              values.parent_id = data.id;
            }
          } else if (doAction === 2) {
            url = (data.meIndicator || data.root) ? '/indicator/edit' : '/indicator/edit/value';
            if (data.meIndicator || data.root) {
              values.indicator_id = data.id;
              values.parent_id = data.parent_id;
            } else {
              values.parent_id = data.parent_id;
              values.value_id = data.id;
            }
            values.is_success = true;
          } else {
            url = data.meIndicator ? '/indicator/delete' : '/indicator/delete/value';
            values.id = data.id;
          }
          if (data.root) values.type = 'indicator';
          const res = await apiService.postMethod(url, values).catch((error) => {
            enqueueSnackbar(error.response.data.msg, { variant: 'error' });
          });
          resetForm();
          setSubmitting(false);
          res.data.status !== 'fail'
            ? enqueueSnackbar(res.data.msg) && popAction(true)
            : enqueueSnackbar(res.data.msg, { variant: 'error' });
        }
      }
      catch (error) {
        setSubmitting(false);
        setErrors(error.message);
      }
    },
  });
  const handleClose = async (reason) => {
    popAction(false);
  };
  const closeModal = () => {
    popAction(false);
  };
  const inputChanged = (name, data) => {
    values[name] = data
  };
  useEffect(() => {
    if (doAction === 2) {
      data.meIndicator ? setCurrentTab('Indicator') : setCurrentTab('Table value')
    } else if (doAction === 1) {
      if (data.meIndicator && !data.has_children) {
        setCurrentTab('Indicator');
      }
    }
    indicatorParents.find(x => {
      if (x.id === data.parent_id || x.id === data.ind_id) {
        values.type_id = x.type_id;
      }
    });
  }, []);
  const render = () => {
    return <Grid item xs={12} md={12}>
      <Card sx={{ p: 3 }}>
        {doAction !== 3 && (
          <>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={(e, value) => setCurrentTab(value)}
            >
              {ACCOUNT_TABS.map((tab) => (
                <Tab
                  disableRipple
                  disabled={doAction === 2 || (doAction === 1 && (data.meIndicator && !data.has_children))}
                  key={tab.value}
                  label={capitalCaseTransform(tab.value)}
                  icon={tab.icon}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Box sx={{ mb: 5 }} />
            {ACCOUNT_TABS.map((tab) => {
              const isMatched = tab.value === currentTab;
              return isMatched && <Box key={tab.value}>{tab.component}</Box>;
            })}
          </>
        )}

        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            {doAction === 3 ?
              <>
                <h4>{data.meIndicator ? data.name : data.val}</h4>&nbsp;устгахдаа итгэлтэй байна уу?
              </> : <>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>


                </Stack>

                {(data.id === 'root' || (doAction === 2 && data.root)) && (
                  <>

                  </>
                )}


              </>}

          </Stack>
          {(data.id === 'root' || (doAction === 2 && data.root)) && (
            <>

            </>
          )}
        </Stack>
      </Card>
    </Grid>
  };
  const { handleSubmit, values, isSubmitting } = formik;
  return (
    <div>
      <Dialog open={confirmModal} onClose={closeModal} sx={{ p: 5 }} maxWidth>
        <DialogTitle>{doAction === 3 ? `${popUpName} устгах` : doAction === 2 ? `${popUpName} засах` : `${popUpName} нэмэх`}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <DialogContent>
              {render()}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()} color="inherit">
                {'Хаах'}
              </Button>
              <LoadingButton type="submit" color={doAction === 3 ? 'error' : doAction === 1 ? 'primary' : 'secondary'} variant="contained" loading={isSubmitting}>
                {doAction === 1 ? 'Нэмэх' : doAction === 2 ? 'Хадгалах' : 'Устгах'}
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
