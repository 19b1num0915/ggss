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
  // { id: 'checkbox', label: '', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
];

// ----------------------------------------------------------------------

export default function User() {
  const [doAction, setDoAction] = useState();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

  const [confirmModal, setConfirmModal] = useState(false);

  const popUpHandler = () => {
    setConfirmModal(true);
  };

  const popAction = (data) => {
    setConfirmModal(false);
    if (data) {
      getUserList();
    }
  };

  const showPopUp = () => {
    if (confirmModal) {
      return (
        <PopUp
          popUpName="Захиалга"
          doAction={doAction}
          confirmModal={confirmModal}
          popAction={(check) => popAction(check)}
        />
      );
    }
  };

  const getUserList = async () => {
    const response = await apiService.getMethod('/user/list');
    setTableData(response?.data.rows);
  };
  const responsein = (value) => {
    if(value == 100){
      getUserList();
    }
  };
  return (
    <Page title="User">
      <Card>
        <HeaderBreadcrumbs
          heading="Test"
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
        <Divider style={{ marginBottom: '16px' }} />
        <Table>
          {tableData && (
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              rowCount={tableData?.length}
            />
          )}

          <TableBody>
            {tableData &&
              tableData.map((row) => (
                <TableRow
                  key={row.order_id}
                  row={row}
                  checkResponse={responsein}
                />
              ))}

            {tableData && tableData.length == 0 && <TableEmptyRows />}
          </TableBody>
        </Table>
      </Card>
    </Page>
  );
}
// ----------------------------------------------------------------------
