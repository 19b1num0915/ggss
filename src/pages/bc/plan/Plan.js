import sumBy from 'lodash/sumBy';
import { useEffect, useState,useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
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
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// hooks
import useTabs from 'src/hooks/useTabs';
import useSettings from 'src/hooks/useSettings';
import useTable, { getComparator, emptyRows } from 'src/hooks/useTable';
// _mock_
import { _invoices } from 'src/_mock';
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
import { setConstantValue } from 'typescript';
import data from 'src/utils/data';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { List, arrayMove } from 'react-movable';
import { decodeToken } from '../../../utils/jwt';
import { useUiContext } from 'src/contexts/UiContext';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'all',
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];

const TABLE_HEAD = [
  { id: 'number', label: '№', alignRight: false },
  { id: 'action', label: 'Үйлдэл', alignRight: false },
  { id: 'type', label: 'Төлөв', alignRight: false },
  { id: 'date', label: 'Огноо', alignRight: false },
  { id: 'time', label: 'Цаг', alignRight: false },
  { id: 'text', label: 'Текст', alignRight: true, minWidth: '430px', display: 'inline-block', textAlign: 'center'},
  { id: 'segmentCheck', label: 'Сегментийн шалгуур', alignRight: false },
  { id: 'userCount', label: 'Илгээх хэрэглэгчдийн тоо', alignRight: false },
  { id: 'sementCount', label: 'Segment count', alignRight: false },
  { id: 'bc', label: 'BC', alignRight: false },
];

// ----------------------------------------------------------------------
export default function Order() {
  const theme = useTheme();

  const { themeStretch } = useSettings();
  const UiContext = useUiContext();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });
  const uiProps = useMemo(() => {
    return {
      profile: UiContext.profile,
      setProfile: UiContext.setProfile,
      setProfileBase: UiContext.setProfileBase
    };
  }, [UiContext]);
  useEffect(() => {

    getStatusList();
    getActionList();
    // getOrders();
    getBlackList();
    getPlanList();
    const user = decodeToken(window.localStorage.getItem('accessToken'));
    uiProps.setProfile(user ? user : {});
  }, []);

  let dayjs = require('dayjs');

  const { enqueueSnackbar } = useSnackbar();

  const [confirmModal, setConfirmModal] = useState(false);

  const [webSocketData, setWebSocketData] = useState();

  const [isEdit, setIsEdit] = useState(false);

  const [actionList, setActionList] = useState([]);

  const [doAction, setDoAction] = useState();

  const [test, setTest] = useState({});

  const [selectedData, setSelectedData] = useState({});

  const [loader, setLoader] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('');

  const [tableConfig, setTableConfig] = useState({});

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [trigger, setTrigger] = useState(null);

  const [range, setRange] = useState(
    {
      startDate: dayjs(new Date().now).startOf('week').add(1, 'day').format('YYYYMMDD'),
      endDate: dayjs(new Date().now).endOf('week').add(1, 'day').format('YYYYMMDD'),
    }
  );
  const [colorIntamira, setColorIntamira] = useState(
    {
      color1: "sadsadsa",
      color2: "sadasdsa",
      color3: "",
      color4: "",

    }
  );
  const [filterEndDate, setFilterEndDate] = useState(null);

  const [statusList, setStatusList] = useState([]);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  const handleStatusChange = (event) => {
    setFilterService(event.target.value);
    getPlanList('status', event.target.value.toString());
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    // navigate(PATH_DASHBOARD.invoice.edit(id));
  };

  const handleViewRow = (id) => {
    // navigate(PATH_DASHBOARD.invoice.view(id));
  };


  const download = async (name, item) => {
    let today = dayjs().format('YYYY-MM-DD');
    let and = []
    if (name === 'status') {
      and.push({
        "op": "like",
        "field": "id",
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
            "op": (name === 'status' && item !== '0') ? 'like' : '>=',
            "field": "id",
            "value": [
              name === 'status' ? item : '0'
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
        // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `Plan ${today}.xls`);
    }
    setLoader(false);
  };
  const getPlanList = async (name, item, val) => {
    let and = []
    if (name === 'status') {
      and.push({
        "op": "like",
        "field": "id",
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
            "op": (name === 'status' && item !== '0') ? 'like' : '>=',
            "field": "id",
            "value": [
              name === 'status' ? item : '0'
            ]
          },
        ]
      },
    }
    const response = await apiService.postMethod('/order/plan/list', tableSearch);
    response.data.length === 0 ? enqueueSnackbar('Өгөгдөл алга', { variant: 'error' }) : console.log();
    setTableData(response?.data.rows);
    setWebSocketData(response)
    connectSocket(response?.data.rows);
  };

  const getStatusList = async () => {
    const response = await apiService.getMethod('order/status-template ');
    response.data.length !== 0 && response.data.unshift({ status_id: '0', status_name: 'Бүгд' });
    if (response.data.length !== 0) setStatusList(response?.data);
  };
  const getActionList = async () => {
    const response = await apiService.getMethod('/order/actions-template');
    setActionList(response?.data.actions);
  };
  var socket;
  const  connectSocket = (item)=>{
    console.log("sadsadsaddima ====>");
      var clientId = uiProps.profile?.email;
      socket = new WebSocket("ws://" + "10.21.68.12:8080" + "/SegmentLIst/" + clientId);
      socket.onopen = function() {
          console.log("Connected to the web socket with clientId [" + clientId + "]");
      };
      socket.onmessage =function(m) {
        const asd = JSON.parse(m.data); 
        
        console.log('xxxxxx', item);
        console.log('yyyyyy', asd.list);

        item?.map((x, i) => {
          asd.list.map((y,j) => {
            if (y.plan_id === x.id) {
              const calculate = asd.list[0].sending_count * 100 / asd.list[0].segment_count  
              item[i].sms_sent_count = y.segment_count;
              item[i].protsent = calculate;
              console.log('FOUND',item[i]);

            }
          })
        })
        console.log("Got message: " , asd.list);
        // setTableData(tableData => [...tableData, item]);
        setTest({id: 0});
      };
    


  }

  const getBlackList = async () => {
    const response = await apiService.getMethod('/blackListInfo ');
    // setStatusList(response?.data);
  };

  const popAction = (data) => {
    setConfirmModal(false);
    if (data) {
      getPlanList();
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
          isActive={true}
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

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const denseHeight = dense ? 56 : 76;

  const TABS = [
    { value: 'all', label: 'Миний  батлах', color: 'info', count: tableData ? tableData.length : 0 },
    { value: '1', label: 'Миний баталсан', color: 'info', count: tableData ? tableData.length : 0 },
    { value: '2', label: 'Төлөвлөгөө батлах', color: 'info', count: tableData ? tableData.length : 0 },
  ];

  return (
    <Page title="BC PLAN">
      <Container maxWidth={themeStretch ? 'lg' : false}>
        {loader ? (
          <LoadingScreen />
        ) : (
          <Card>
            <HeaderBreadcrumbs heading="BC Plan/Sending" />
            {showPopUp()}
            <Tabs
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
            </Tabs>

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
                getPlanList('date', check);
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
                        tableData?.map((row) => row.id)
                      )
                    }
                    style={{ position: 'sticky' }}
                    actions={
                      <Stack spacing={1} direction="row">
                        <Tooltip title="Буцаах">
                          <IconButton color="primary">
                            <Iconify icon="line-md:circle-to-confirm-circle-transition" color="#0C53B7" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Цуцлах">
                          <IconButton color="primary">
                            <Iconify icon="icon-park-outline:return" color="red" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  />
                )}
                {tableData && (
                  <List
                    lockVertically
                    values={tableData?.length !== 0 ? tableData : []}
                    onChange={({ oldIndex, newIndex }) => {
                      setTableData(arrayMove(tableData, oldIndex, newIndex));
                      setTrigger(newIndex);
                    }}
                    renderList={({ children, props, isDragged }) => (
                      <Table size="small" style={{ cursor: isDragged ? 'grabbing' : undefined }} stickyHeader>
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
                              tableData?.map((row) => row.order_id)
                            )
                          }
                        />
                        <TableBody {...props}>{children}</TableBody>
                      </Table>
                    )}
                    renderItem={({ value, props, isDragged, index }) => {
                      const rowData = (
                        <>
                          <TableRow
                            props={props}
                            isDragged={isDragged}
                            index={index}
                            key={value?.id}
                            row={value}
                            actionList={actionList}
                            actionMadePop={(check) => popAction(check)}
                            selected={selected.includes(value?.order_id)}
                            onSelectRow={() => onSelectRow(value?.order_id)}
                            onViewRow={() => handleViewRow(value?.order_id)}
                            onEditRow={() => handleEditRow(value?.order_id)}
                            onDeleteRow={() => handleDeleteRow(value?.order_id)}
                          />
                        </>
                      );
                      return isDragged ? (
                        <Table style={{ ...props.style }}>
                          <TableBody>{rowData}</TableBody>
                        </Table>
                      ) : (
                        rowData
                      );
                    }}
                  />
                )}
              </TableContainer>
            </Scrollbar>
          </Card>
        )}
        <Scrollbar>
          <TableContainer>
            {tableData?.length === 0 && (
              <>
                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />
                <TableNoData isNotFound={isNotFound} />
              </>
            )}


          </TableContainer>
        </Scrollbar>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = tableData ? tableData?.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis?.map((el) => el[0]);

  return tableData;
}
