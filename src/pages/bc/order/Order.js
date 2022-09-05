import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Button,
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
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { apiService } from 'src/api/api';
import { useSnackbar } from 'notistack';
import { saveAs } from 'file-saver';
import PopUp from './PopUp';
import LoadingScreen from 'src/components/LoadingScreenTest';
import { TableNoData, TableEmptyRows, TableHeadCustom, TableSelectedActions } from 'src/components/table';
// sections
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const TABLE_HEAD = [
  { id: 'action', label: 'Үйлдэл', alignRight: false },
  { id: 'type', label: 'Төлөв', alignRight: false },
  { id: 'send_date', label: 'Огноо', alignRight: false },
  { id: 'time', label: 'Цаг', alignRight: false },
  { id: 'code', label: 'Нөхцөлийн код', alignRight: false },
  { id: 'type2', label: 'Төрөл', alignRight: false },
  { id: 'specNumber', label: 'Тусгай дугаар', alignRight: false },
  { id: 'text', label: 'Текст', alignRight: true, minWidth: '430px', display: 'inline-block', textAlign: 'center'},
  { id: 'segmentCheck', label: 'Сегментийн шалгуур', alignRight: false },
  { id: 'userCount', label: 'Илгээх хэрэглэгчдийн тоо', alignRight: false },
  { id: 'segmentUser', label: 'Сегмент гаргах мэргэжилтэн', alignRight: false },
  { id: 'description', label: 'Нэмэлт тайлбар ', alignRight: false },
  { id: 'test', label: 'Test'},
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

  const [isEdit, setIsEdit] = useState(false);

  const [doAction, setDoAction] = useState();

  const [selectedData, setSelectedData] = useState({});

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

  const [drive, setDrive] = useState({"send_date": "desc"});


  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  const handleStatusChange = (event) => {
    setFilterService(event.target.value);
    getOrders('status', event.target.value.toString());
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };
  useEffect(() => {
    // selected.filter(x => x.order_status === '2' ? setMassAction({ ...massAction, check: true }) : setMassAction({ ...massAction, check: false }))
    // selected.map(data => {
    //   if (data.order_status !== '2') {
    //     return setMassAction({ ...massAction, check: false })
    //   }
    // });
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
    // const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    // setSelected([]);
    // setTableData(deleteRows);
  };

  const download = async (name, item, val) => {
    let today = dayjs().format('YYYY-MM-DD');
    let and = []
    if (name === 'status') {
      and.push({
        "op": "like",
        "field": "order_status",
        "value": [
          item
        ]
      })
    }
    let tableSearch = {
      "order": {
        "send_date": "desc",
        "order_status": "desc"
      },
      "excel": true,
      "global_filters": {
        "and": [
          // statusFilter
          {
            "op": "between",
            "field": "send_date",
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
            "op": (name === 'status' && item !== '0') ? 'like' : '>=',
            "field": "order_status",
            "value": [
              name === 'status' ? item : '0'
            ]
          },
        ]
      },
    }
    setLoader(true);
    const response = await apiService.postMethodExcel('/order/download', tableSearch).catch((error) => {
      setTimeout(() => {
        setLoader(false);
      });
      enqueueSnackbar('3 секунд Timer Алдаа', { variant: 'error' });
    });
    if (response && response.data) {
      const blob = new Blob([response.data], {
        // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // type: 'application/vnd.ms-excel',
      });
      saveAs(blob, `EXCCCEL ${today}.xls`);
    }
    setLoader(false);
  };

  const getOrders = async (name, item, val) => {
    let and = []
    if (name === 'status') {
      and.push({
        "op": "like",
        "field": "order_status",
        "value": [
          item
        ]
      })
    }
    let tableSearch = {
      "page": page == 0 ? page + 1 : page + 1,
      "pagesize": rowsPerPage,
      "order": drive,
      "excel": false,
      "global_filters": {
        "and": [
          // statusFilter
          {
            "op": "between",
            "field": "send_date",
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
            "op": (name === 'status' && item !== '0') ? 'like' : '>=',
            "field": "order_status",
            "value": [
              name === 'status' ? item : '0'
            ]
          },
        ]
      },
    }
    const response = await apiService.postMethod('/bc/orders', tableSearch);
    response.data.length === 0 ? enqueueSnackbar('Өгөгдөл алга', { variant: 'error' }) : console.log();
    setTableData(response?.data.rows);
    setTableConfig(response?.data);
   console.log("aaaaaaa", response);
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

  const popUpHandler = (value, number, row) => {
    setConfirmModal(true);
    setIsEdit(value);
    setDoAction(number);
    setSelectedData(row);
  };

  const showPopUp = () => {
    if (confirmModal) {
      return (
        <PopUp
          popUpName="Захиалга"
          doAction={doAction}
          isEdit={isEdit}
          confirmModal={confirmModal}
          data={selectedData}
          popAction={(check) => popAction(check)}
        />
      );
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
  // useEffect(() => {
  //   setSelected([...new Set(selected)]);
  // }, [selected]);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const denseHeight = dense ? 56 : 76;

  const TABS = [
    // { value: 'all', label: 'Дотоодын захиалга', color: 'info', count: tableConfig ? tableConfig.total : 0 },
  ];
  const sendDataToParent = (ascDesc, index) => { // the callback. Use a better name
    // if(index.length % 2 == 0){
    //   // setDrive("asc");
    //   console.log(index.length);
    // }else{
    //   // setDrive("desc");
    //   console.log("desc");

    // }
    console.log("===================>",ascDesc,index);
    console.log("===================>", {
      
    });
    setDrive({ 
      [index]: ascDesc
    });
    getOrders();
  };
  
  console.log("===================> DRIVE", drive);
  return (
    <Page title="BC Захиалга">
      {loader ? (
        <LoadingScreen />
      ) : (
        <Card>
          <HeaderBreadcrumbs
            heading="BC Захиалга"
            action={
              <Button
                style={{ color: 'white', paddingRight: '10px' }}
                variant="contained"
                startIcon={<Iconify icon={'akar-icons:plus'} />}
                onClick={() => popUpHandler(false, 1)}
              >
                Нэмэх
              </Button>
            }
          />
          {showPopUp()}
          {/* <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, paddingLeft: '8px', bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={<Label color={tab.color}> {tab.count} </Label>}
                label={tab.label}
              />
            ))}
          </Tabs> */}
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
                      {massAction && massAction.check && (
                      <Tooltip title="Хяналтанд илгээх">
                        <IconButton color="primary" onClick={() => actionArray(selected, 1)}>
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip>

                      )}

                      <Tooltip title="Хуулах">
                        <IconButton color="primary" onClick={() => actionArray(selected, 2)}>
                          <Iconify icon={'akar-icons:copy'} />
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
                    sendDataToParent={sendDataToParent}
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
              count={tableConfig.total ? tableConfig.total : 0}
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
