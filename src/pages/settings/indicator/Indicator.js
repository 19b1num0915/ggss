import { useState, useEffect, Fragment } from 'react';
// @mui
import {
  Card,
  Stack,
  FormControlLabel
} from '@mui/material';
import { apiService } from 'src/api/api';

import Iconify from 'src/components/Iconify';
import Page from 'src/components/Page';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import PopUp from './PopUp';
// 3rd party

// ----------------------------------------------------------------------

export default function Type() {
  const data = {
    id: 'root',
    name: 'Сегмент Indicator',
    children: [
      {
        id: '1',
        name: 'Univision',
      },
      {
        id: '40',
        name: 'User Type',
      },
      {
        id: '41',
        name: 'Consumption',
        color: '#fbca04',
        description: '',
        children: [
          {
            id: '42',
            name: 'Arpu',
          },
          {
            id: '43',
            name: 'DOU',
          },
          {
            id: '44',
            name: 'MOU',
          },
          {
            id: '45',
            name: 'Upoint',
          },
          {
            id: '46',
            name: 'Collective',
          },
          {
            id: '47',
            name: 'Toki',
          },
        ],
      },
      {
        id: '3',
        name: 'Аймаг',
        children: [
          {
            id: '4',
            name: 'Орон нутаг',
            children: [
              {
                id: '5',
                name: 'Архангай',
                children: [
                  {
                    id: '24',
                    name: 'Цэнхэр сум',
                  },
                  {
                    id: '25',
                    name: 'Өндөр-Улаан сум',
                  },
                  {
                    id: '26',
                    name: 'Их Тамир сум',
                  },
                ],
              },
              {
                id: '6',
                name: 'Өмнөговь',
              },
              {
                id: '7',
                name: 'Баян-Өлгий',
              },
            ],
          },
          {
            id: '8',
            name: 'Улаанбаатар',
          },
        ],
      },
      {
        id: '19',
        name: 'Хүйс',
        children: [
          {
            id: '21',
            name: 'Эрэгтэй',
          },
          {
            id: '20',
            name: 'Эмэгтэй',
          },
        ],
      },
      {
        id: '29',
        name: 'Market Type',
        children: [
          {
            id: '28',
            name: 'Mobile',
          },
          {
            id: '26',
            name: 'Univision',
          },
          {
            id: '27',
            name: 'Ger Internet',
          },
        ],
      },
      {
        id: '30',
        name: 'Product Type',
        children: [
          {
            id: '31',
            name: 'PS',
            children: [
              {
                id: '34',
                name: 'Багц10',
              },
              {
                id: '35',
                name: 'Багц20',
              },
              {
                id: '36',
                name: 'Багц30',
              },
              {
                id: '37',
                name: 'Багц40',
              },
            ],
          },
          {
            id: '32',
            name: 'Hybrid',
          },
          {
            id: '33',
            name: 'PPS',
          },
        ],
      },
    ],
  };
  const [selected, setSelected] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [selectedTree, setSelectedTree] = useState({});
  const [test, setTest] = useState({});
  const [indicatorParents, setIndicatorParents] = useState([]);
  const [indicatorTypeList, setIndicatorTypeList] = useState([]);
  const [doAction, setDoAction] = useState();

  const getIndicatorParent = async () => {
    const response = await apiService.getMethod('/indicator/list');
    response.data.indicators.map(x => {
      x.root = true
      x.meIndicator = true
      x.has_children ? x.children = [{ id: '0' }] : console.log();
    });
    setIndicatorParents({ ...indicatorParents, children: response?.data.indicators, id: 'root', name: 'Сегмент Indicator' });
  };
  const getIndicatorTypeList = async () => {
    const response = await apiService.getMethod('/indicator/type/list');
    setIndicatorTypeList(response?.data.rows);
  };

  const actionClicked = (number, data) => {
    popUpHandler(number);
    setSelectedData(data);
  };

  const getById = async (data) => {
    console.log('GET BY ID DATA: ', data);
    let responseInd = {};
    if (data.has_children) {
      const temp = {};
      if (data.root) {
        temp.ind_id = data.id;
      } else {
        // temp.parent_val_id = data.id;
        temp.ind_id = data.ind_id;
      }
      if (data.meIndicator) temp.ind_id = data.id;
      temp.type = (data.root || data.meIndicator) ? 'indicator' : 'nested';
      // indicator get
      const test = {}
      if (data.root) {
        test.id = data.id;
      } else {
        test.id = data.ind_id
      }
      if (!data.root && !data.meIndicator && !data.parent_id) {
        console.log('ALI')
        responseInd = await apiService.postMethod('/indicator/list/nested', test);
        responseInd.data.children.map(x => {
          x.meIndicator = true;
          if (x.has_children) x.children = [{ id: '0' }];
        });
        data.children = responseInd.data.children;
      }
      if (data.meIndicator || data.root) {
        console.log('ALI 1')
        const meObj = {};
        meObj.id = data.id;
        responseInd = await apiService.postMethod('/indicator/list/nested', meObj);
        responseInd.data.children.map(x => {
          x.meIndicator = true;
          if (x.has_children) x.children = [{ id: '0' }];
        });
        data.children = responseInd.data.children;

      }
      const response = await apiService.postMethod('/indicator/values', temp);
      if (responseInd.data) response.data.values.unshift(responseInd.data.children);
      response.data.values.map(x => data.children.push(x));
      // data.children.push(response.data.values);
      data.children.map(x => {
        x.has_children ? x.children = [{ id: '0' }] : console.log();
      });
    }
    setTest({ ...test, id: '0' });

  };

  const popUpHandler = (number) => {
    setConfirmModal(true);
    setDoAction(number);
  };

  const popAction = (data) => {
    setConfirmModal(false);
    if (data) {
      getIndicatorParent();
    }
  };

  const selectedTreeFunc = (node) => {
    setSelectedTree(node);
    getById(node);
  };

  const showPopUp = () => {
    if (confirmModal) {
      return (
        <PopUp
          popUpName="Indicator"
          doAction={doAction}
          indicatorTypeList={indicatorTypeList}
          confirmModal={confirmModal}
          data={selectedData}
          selectedTree={selectedTree}
          indicatorParents={indicatorParents.children}
          popAction={(check) => popAction(check)}
        />
      );
    }
  };

  function getChildById(node, selected) {
    let array = [];

    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach(node => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }
    function getNodeById(nodes, selected) {
      if (nodes.id === selected.id) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach(node => {
          if (!!getNodeById(node, selected)) {
            result = getNodeById(node, selected);
          }
        });
        return result;
      }
      return null;
    }
    return getAllChild(getNodeById(node, selected));
  }

  const getOnChange = (checked, nodes) => {
    /* Setting all Children or Parent Object to AllNode */
    const allNode = getChildById(data, nodes);

    /* Checked or Not adding or removing from selected list */
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter(value => remove(value, allNode) === -1);


    array = array.filter((v, i) => array.indexOf(v) === i);

    setSelected(array);
  }
  const remove = (obj, list) => {
    return list.findIndex((x) => x.id === obj.id);
  }
  const renderTree = (nodes) => {
    return <Fragment>
      {nodes && nodes.name && (
        <TreeItem key={nodes.id} nodeId={`${nodes.id}, ${nodes.name}`} label={
          <>
            <FormControlLabel
              style={{ marginRight: '20px' }}
              onClick={() => selectedTreeFunc(nodes)}
              control={
                <Iconify style={{ marginLeft: '10px' }} onClick={() => actionClicked(1, nodes)} icon={'akar-icons:circle-plus'} color="#78C81E" />
              }
              label={<>{nodes.val ? nodes.val : nodes.name} </>}
              key={nodes.id}
            />
            <FormControlLabel
              style={{ marginRight: '30px' }}
              control={
                nodes.id !== 'root' ?
                  <Iconify onClick={() => actionClicked(2, nodes)} icon={'carbon:edit'} color="#3366FF" />
                  : <></>
              }
            />
            <FormControlLabel
              control={
                nodes.id !== 'root' ?
                  <Iconify onClick={() => actionClicked(3, nodes)} icon={'bx:trash'} color="#FF4842" />
                  : <></>
              }
            />
            <FormControlLabel
              style={{ marginLeft: '30px' }}
              control={
                nodes.id !== 'root' ?
                  <Iconify onClick={() => actionClicked(3, nodes)} icon={nodes.meIndicator ? 'emojione:letter-i' : 'noto-v1:green-apple'} color="#FF4842" />
                  : <></>
              }
            />
          </>
        }>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
      )}
    </Fragment>
  };

  useEffect(() => {
    getIndicatorParent();
    getIndicatorTypeList();
  }, []);

  return (
    <Page title="Сегмент Indicator">
      <Card>
        {showPopUp()}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
          <TreeView
            aria-label="multi-select"
            defaultCollapseIcon={<Iconify icon={'akar-icons:chevron-down'} />}
            // defaultExpanded={['root']}
            multiSelect
            defaultEndIcon={null}
            onNodeSelect={(event, ids) => console.log('ids: ', ids)}
            defaultExpandIcon={<Iconify icon={'akar-icons:chevron-right'} />}
          >
            {indicatorParents && (
              renderTree(indicatorParents)

            )}
          </TreeView>
        </Stack>
      </Card>
    </Page>
  );
}
