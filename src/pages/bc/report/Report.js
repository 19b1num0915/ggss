import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Stack,
  Switch,
  Tooltip,
  Divider,
  TableBody,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// hooks
import useTabs from 'src/hooks/useTabs';
import useTable, { getComparator, emptyRows } from 'src/hooks/useTable';
// components
import Page from 'src/components/Page';
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { apiService } from 'src/api/api';
import { useSnackbar } from 'notistack';
import { saveAs } from 'file-saver';
import LoadingScreen from 'src/components/LoadingScreenTest';
import { TableNoData, TableEmptyRows, TableHeadCustom, TableSelectedActions } from 'src/components/table';
// sections
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const TABLE_HEAD = [
  { id: 'type', label: 'Төлөв', alignRight: false },
  { id: 'date', label: 'Огноо', alignRight: false },
  { id: 'time', label: 'Цаг', alignRight: false },
  { id: 'text', label: 'Текст', alignRight: true, minWidth: '430px', display: 'inline-block', textAlign: 'center'},
  { id: 'segmentCheck', label: 'Сегмент', alignRight: false },
  { id: 'userCount', label: 'Илгээх хэрэглэгчдийн тоо', alignRight: false },
  { id: 'sementCount', label: 'Segment count', alignRight: false },
];

// ----------------------------------------------------------------------

export default function Order() {

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  useEffect(() => {
    getStatusList();
    getActionList();
  }, []);

  useEffect(() => {
    getOrders();
  }, [page !== 0 || rowsPerPage]);


  let dayjs = require('dayjs');

  const { enqueueSnackbar } = useSnackbar();

  const [confirmModal, setConfirmModal] = useState(false);

  const [loader, setLoader] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [tableConfig, setTableConfig] = useState({});

  const [massAction, setMassAction] = useState({
    check: true,
  });

  const [filterName, setFilterName] = useState('');

  const [range, setRange] = useState(
    {
      startDate: dayjs(new Date().now).startOf('week').add(1, 'day').format('YYYYMMDD'),
      endDate: dayjs(new Date().now).endOf('week').add(1, 'day').format('YYYYMMDD'),
    }
  );

  const [filterService, setFilterService] = useState('');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const [statusList, setStatusList] = useState([]);

  const [actionList, setActionList] = useState([]);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  const handleStatusChange = (event) => {
    setFilterService(event.target.value);
    getOrders('status', event.target.value.toString());
  };
 
  useEffect(() => {
    const obb = selected.find(x => x.order_status !== '2');
    obb ? setMassAction({ ...massAction, check: false }) : setMassAction({ ...massAction, check: true });
  }, [selected]);


  const actionArray = (selected, number) => {
    switch (number) {
      case 1:
        const uniqueObjects = [...new Map(selected.map(item => [item.order_id, item])).values()];
        setSelected(uniqueObjects);

        break;
      case 2:
        // code block
        break;
      default:
      // code block
    }
  };

  const download = async (name, item, val) => {
    let today = dayjs().format('YYYY-MM-DD');
    let and = []
    if (name === 'status') {
      and.push({
        "op": "like",
        "field": "status_id",
        "value": [
          item
        ]
      })
    }
    let tableSearch = {
      "page": page == 0 ? page + 1 : page + 1,
      "pagesize": rowsPerPage,
      "excel": false,
      "global_filters": {
        "and": [
          // statusFilter
          {
            "op": "between",
            "field": "plan_date",
            "value": [
              name === 'date' ? dayjs(item.startDate).format('YYYYMMDD') : dayjs(range.startDate).format('YYYYMMDD'),
              name === 'date' ? dayjs(item.endDate).format('YYYYMMDD') : dayjs(range.endDate).format('YYYYMMDD'),
            ]
          }
        ]
      },
      "column_filters": {
        "and": [
          {
            "op": (name === 'status' && item !== '0') ? 'like' : '=',
            "field": "status_id",
            "value": [
              name === 'status' ? item : '15'
            ]
          },
        ]
      },
    }
    setLoader(true);
    const response = await apiService.postMethodExcel('/order/plan/download', tableSearch).catch((error) => {
      setTimeout(() => {
        setLoader(false);
      });
      enqueueSnackbar('3 секунд Timer Алдаа', { variant: 'error' });
    });
    if (response && response.data) {
      const blob = new Blob([response.data], {
      });
      saveAs(blob, `BC Тайлан ${today}.xls`);
    }
    setLoader(false);
  };

  const getOrders = async (name, item, val) => {
    let and = []
    if (name === 'status') {
      and.push({
        "op": "like",
        "field": "status_id",
        "value": [
          item
        ]
      })
    }
    let tableSearch = {
      "page": page == 0 ? page + 1 : page + 1,
      "pagesize": rowsPerPage,
      "excel": false,
      "global_filters": {
        "and": [
          // statusFilter
          {
            "op": "between",
            "field": "plan_date",
            "value": [
              name === 'date' ? dayjs(item.startDate).format('YYYYMMDD') : dayjs(range.startDate).format('YYYYMMDD'),
              name === 'date' ? dayjs(item.endDate).format('YYYYMMDD') : dayjs(range.endDate).format('YYYYMMDD'),
            ]
          }
        ]
      },
      "column_filters": {
        "and": [
          {
            "op": (name === 'status' && item !== '0') ? 'like' : '=',
            "field": "status_id",
            "value": [
              name === 'status' ? item : '15'
            ]
          },
        ]
      },
    }
    const response = await apiService.postMethod('/order/plan/list', tableSearch);
    response.data.length === 0 ? enqueueSnackbar('Өгөгдөл алга', { variant: 'error' }) : console.log();
    setTableData(response?.data.rows);
    setTableConfig(response?.data);
  };

  const getStatusList = async () => {
    const response = await apiService.getMethod('/order/status-template ');
    response.data.length !== 0 && response.data.unshift({ id: 0, status: 'Бүгд' })
    setStatusList(response?.data);
  };
  const getActionList = async () => {
    const response = await apiService.getMethod('/order/actions-template');
    setActionList(response?.data.actions);
  };
  const popAction = (data) => {
    setConfirmModal(false);
    if (data) {
      getOrders();
    }
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });
  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const denseHeight = dense ? 56 : 76;
  return (
    <Page title="BC Тайлан">
      {loader ? (
        <LoadingScreen />
      ) : (
        <Card>
          <HeaderBreadcrumbs
            heading="BC Тайлан"
          />
          <Divider />
          <TableHeader
            filterName={filterName}
            filterService={filterService}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            onStatusSelect={handleStatusChange}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            statusList={statusList}
            range={(check) => {
              setRange({ ...range, startDate: check.startDate, endDate: check.endDate });
              setPage(0);
              getOrders('date', check);
            }}
            download={download}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 200, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData?.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData?.map((row) => row)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Задаргааг татах">
                        <IconButton color="primary" onClick={() => actionArray(selected, 2)}>
                          <Iconify icon={'vscode-icons:file-type-excel'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}
              <Table size={dense ? 'small' : 'medium'}>

                {tableData && (
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData?.map((row) => row)
                      )
                    }
                  />
                )}

                <TableBody>
                  {tableData && tableData.map((row) => (
                    <TableRow
                      key={row.order_id}
                      row={row}
                      actionList={actionList}
                      selected={selected.includes(row)}
                      onSelectRow={() => onSelectRow(row)}
                      actionMadePop={(check) => popAction(check)}
                    />
                  ))}

                  {tableData && tableData.length == 0 && (<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />)}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableConfig.row_count ? tableConfig.row_count : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      )}
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
}) {
  const stabilizedThis = tableData ? tableData?.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);
  return tableData;
}
