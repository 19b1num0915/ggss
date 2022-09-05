import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Stack,
  Checkbox,
  FormControlLabel
} from '@mui/material';

import Iconify from 'src/components/Iconify';
import WidInput from 'src/widget/WidInput';
import Page from 'src/components/Page';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Dropdown from 'src/widget/DropDown';
// 3rd party

// ----------------------------------------------------------------------

export default function Type() {
  const [selected, setSelected] = useState([]);
  const [segmentList, setSegmentList] = useState(data);
  const [selectedCat, setSelectedCat] = useState([]);
  const data = {
    id: 'root',
    name: 'Сегмент тодорхойлох',
    children: [
      {
        id: '1',
        name: 'Univision',
        type: 'test'
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
  console.log('selected: ', selected);
  const renderTree = (nodes) => {
    if (!nodes.children && nodes.type === 'test') {
      nodes['children'] = [{ id: 0 }];
      // nodes.children.push({ id: 0 });
      nodes.children.map((node) => renderTree(node))
    }
    if (nodes.id === 0) {
      return <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
        <WidInput
          type="textCustom"
          regex="required"
          maxLength={11}
          label="Тусгай дугаар"
          name="specNum"
        />
        <WidInput
          type="textCustom"
          regex="required"
          maxLength={11}
          label="Тусгай дугаар"
          name="specNum"
        />
        <WidInput
          type="textCustom"
          regex="required"
          maxLength={11}
          label="Тусгай дугаар"
          name="specNum"
        />
      </Stack>
    } else {
      return <TreeItem key={nodes.id} nodeId={`${nodes.id}, ${nodes.name}`} label={
        <FormControlLabel
          control={
            nodes.id !== 'root' ?
              <Checkbox
                checked={selected.some(item => item.id === nodes.id)}
                onChange={event =>
                  getOnChange(event.currentTarget.checked, nodes)
                }
                onClick={e => e.stopPropagation()}
              /> : <></>
          }
          label={<>{nodes.name}</>}
          key={nodes.id}
        />
      }>
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    }
  };
  useEffect(() => {
    setSegmentList({...segmentList, children: selectedCat});
  }, [selectedCat]);

  return (
    <Page title="Сегмент Indicator">
      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
          <Dropdown selectedCat={(item) => setSelectedCat(item)} />
          <TreeView
            aria-label="multi-select"
            defaultCollapseIcon={<Iconify icon={'akar-icons:chevron-down'} />}
            // defaultExpanded={['root']}
            multiSelect
            defaultEndIcon={null}
            onNodeSelect={(event, ids) => console.log('ids', ids)}
            defaultExpandIcon={<Iconify icon={'akar-icons:chevron-right'} />}
          >
            {segmentList && (
              renderTree(segmentList)

            )}
          </TreeView>
        </Stack>
      </Card>
    </Page>
  );
}
