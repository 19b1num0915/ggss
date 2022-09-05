import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Stack,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { apiService } from 'src/api/api';
import { FormikProvider, Form, useFormik } from 'formik';
import Iconify from 'src/components/Iconify';
import WidInput from 'src/widget/WidInput';
import Page from 'src/components/Page';
import TreeView from '@mui/lab/TreeView';
import { useSnackbar } from 'notistack';
import TreeItem from '@mui/lab/TreeItem';
import Dropdown from 'src/widget/DropDown';
import { func } from 'prop-types';
// 3rd party

// ----------------------------------------------------------------------

export default function Type({ data }) {
  const { enqueueSnackbar } = useSnackbar();
  let dayjs = require('dayjs');
  const [selected, setSelected] = useState([]);
  const [segmentList, setSegmentList] = useState({});
  const [finalArray, setFinalArray] = useState([]);
  const [selectedTree, setSelectedTree] = useState({});
  const [finalBuilder, setFinalBuilder] = useState([]);
  const [test, setTest] = useState({});
  const [parentIndicatorList, setParentIndicatorList] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const staticOperators = [
    {
      id: '=',
      name: '='
    },
    {
      id: '<',
      name: '<'
    },
    {
      id: '<=',
      name: '<='
    },
    {
      id: '>',
      name: '>'
    },
    {
      id: '>=',
      name: '>='
    },
    {
      id: '!=',
      name: '!='
    },
    {
      id: 'BETWEEN',
      name: 'BETWEEN'
    },
    {
      id: 'CONTAINS',
      name: 'CONTAINS'
    },
    {
      id: 'NOT',
      name: 'NOT'
    },
    {
      id: 'STARTS WITH',
      name: 'STARTS WITH'
    },
    {
      id: 'ENDSWITH',
      name: 'ENDSWITH'
    },
  ];
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
  let objectBuilder = {
    indicator: {
      and: []
    }
  };
  console.log('OBJECT BUILDER: ', objectBuilder);
  console.log('OBJECT BUILDER FINAL STATE: ', finalBuilder);

  const getOnChange = (checked, nodes) => {
    console.log('CHANGE: ', nodes);
    if (checked) {
      if (nodes.godId) {

        let tempValid = false;
        let tempCheckParentValid = false;
        let temp = {};
        let tempCheckParent = {};
        let noGod = false;
        finalBuilder.map(x => {
          if (x.or) {
            noGod = true;
            if (nodes.parent_id) {
              tempCheckParent = x.or.find(item => item.indicator_id === nodes.parent_id);
              if (tempCheckParent) {
                tempCheckParentValid = true;
                console.log('tempCheckParent', tempCheckParent);

                x.or.push({
                  or: [
                    {
                      godId: nodes.godId,
                      indicator_id: nodes.id,
                      op: nodes.op ? nodes.op : '=',
                      value: nodes.val ? nodes.val : nodes.name
                    }
                  ]
                }
                );
                console.log('tempCheckParent PUSH', x.or);
              }
            }
            temp = x.or.find(data => data.godId === nodes.godId);
            if (temp) {
              tempValid = true;
              x.or.push({
                godId: nodes.godId,
                indicator_id: nodes.id,
                op: nodes.op ? nodes.op : '=',
                value: nodes.val ? nodes.val : nodes.name
              });
            }
            console.log("TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEMP: ", temp)
          }
        });
        console.log('NO GOD: ', noGod);
        if (noGod === false) {
          console.log('NO TEMP NO GOD');
          // OR Condition toi Enum type godId list-nd taaragui buyu anhnii parent shineer songogdson bol nemne
          setFinalBuilder([
            ...finalBuilder, {
              or: [{
                godId: nodes.godId,
                indicator_id: nodes.id,
                op: nodes.op ? nodes.op : '=',
                value: nodes.val ? nodes.val : nodes.name
              }]
            }
          ]);
        }
        if (!temp && !tempValid) {
          console.log('NO TEMP');
          setFinalBuilder([
            ...finalBuilder, {
              or: [{
                godId: nodes.godId,
                indicator_id: nodes.id,
                op: nodes.op ? nodes.op : '=',
                value: nodes.val ? nodes.val : nodes.name
              }]
            }
          ]);
        }
      } else {
        console.log('GOD ID BHQ');
        console.log('OROH YSGUI');
        setFinalBuilder([
          ...finalBuilder, {
            indicator_id: nodes.id,
            op: nodes.op ? nodes.op : '=',
            value: nodes.val ? nodes.val : nodes.name
          }
        ]);
      }
    }
    // else {
    //   finalBuilder.splice(nodes, 1);
    // }
    console.log('OBJECT BUILDER INSIDE: ', objectBuilder);

    if (checked && nodes.type_id && nodes.type_id !== '4') {
      nodes.children = [{ id: 0, name: nodes.name, node_id: nodes.id }];
    } else {
      delete nodes.children;
    }
    if (checked && nodes.godId) {
      selectedCat.map(x => {
        if (x.id === nodes.godId) {
          // const index = selectedCat.indexOf(x);
          // selectedCat.splice(index, 1);
          setFinalArray([...finalArray, nodes]);
          return;
        }
      });
    }
    /* Setting all Children or Parent Object to AllNode */
    const allNode = getChildById(segmentList, nodes);

    /* Checked or Not adding or removing from selected list */
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter(value => remove(value, allNode) === -1);


    array = array.filter((v, i) => array.indexOf(v) === i);

    setSelected(array);
  }


  const getIndicatorParent = async () => {
    const response = await apiService.getMethod('/indicator/list');
    response.data.indicators.map(x => {
      x.root = true
      x.has_children ? x.children = [{ id: '0' }] : console.log();
    });
    setParentIndicatorList(response.data.indicators);
    setSegmentList({ ...segmentList, children: response?.data.indicators, id: 'root', name: 'Сегмент Indicator' });
  };

  const getById = async (data) => {
    if (data.has_children) {
      const temp = {};
      if (data.root) {
        temp.ind_id = data.id;
      } else {
        temp.parent_val_id = data.id;
        temp.ind_id = data.ind_id;
      }
      temp.type = data.root ? 'indicator' : 'nested';
      if (data.id !== 'root') {
        const response = await apiService.postMethod('/indicator/values', temp);
        response.data.values.map(x => {
          if (!x.godId) {
            x.godId = data.id;
          }
          if (data.godId) {
            x.godId = data.godId;
          }
        });
        data.children = response.data.values;
        data.children.map(x => {
          x.has_children ? x.children = [{ id: '0' }] : console.log();
        });
      } else {
        temp.type = 'indicator';
      }
      setTest({ ...test, id: '0' });
    }
  };

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      isCond: data ? data.isCond : '',
      order_type: data ? data.order_type : '',
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        values['company'] = 'Unitel';
        values.send_date = dayjs(values.send_date).format('YYYYMMDD');
        let item = new FormData();
        console.log('SENT VALUE: ', values);
        // const res = await apiService.postMethod(`/bc/on`, item).catch(error => {
        //   enqueueSnackbar(error.response.data.action_msg, { variant: 'error' });
        // });
        // if (res.status === 200 && res.data.status === 'success') {
        //   enqueueSnackbar(res.data.action_msg);
        // }
        resetForm();
        setSubmitting(false);
      }
      catch (error) {
        setSubmitting(false);
        setErrors(error.message);
      }
    }
  });

  console.log('selectedTree:', selectedTree)

  const selectedTreeFunc = (node) => {
    setSelectedTree(node);
    getById(node);
  };
  useEffect(() => {
    const temp = finalBuilder.find(x => x.indicator_id === selectedTree.id);
    if (temp && temp.op === 'BETWEEN') {
      temp.value = ['', ''];
    }
  }, [finalBuilder.find(x => x.indicator_id === selectedTree.id)]);

  const inputChanged = (name, data, index) => {
    let myTree = finalBuilder.find(x => x.indicator_id === selectedTree.id);
    selectedCat.map(x => {
      if (x.id === selectedTree.id) {
        x[name] = data;
      }
    });
    if (name === 'op') {
      if (data === 'BETWEEN') {
        myTree.value = ['', ''];
      } else {
        myTree.value = '';
      }
      setTest({ ...test, [name]: data })
    }
    if (name === 'value' && data) {
      if (myTree.op === 'BETWEEN') {
        myTree[name][index] = data;
      } else {
        myTree[name] = data;
      }
      console.log('value inside myTree: ', myTree);
    } else if (name === 'value1' && data && myTree.op === 'BETWEEN') {
      myTree['value'][index] = data;
      console.log('value inside myTree: ', myTree);
    } else {
      myTree[name] = data;
    }

  }
  const treeValue = (item) => {
    console.log('AUTOMAT VALUE: ', item);
  }

  useEffect(() => {
    getIndicatorParent();
  }, []);

  const remove = (obj, list) => {
    return list.findIndex((x) => x.id === obj.id);
  }
  console.log('SELECTED TREE', selectedTree);
  const renderTree = (nodes) => {
    if (!nodes.children && nodes.type === 'test') {
      nodes['children'] = [{ id: 0 }];
      // nodes.children.push({ id: 0 });
      nodes.children.map((node) => renderTree(node))
    }
    if (nodes.id === 0) {
      console.log('inside', nodes);
      let myData = selectedCat.find(x => x.name === nodes.name);
      let myTree = finalBuilder.find(x => x.indicator_id === nodes.node_id);
      console.log('builderData 1st my TREE', myTree)
      console.log('builderData 1st', objectBuilder.indicator.and)
      objectBuilder.indicator.and.map(x => {
        console.log('builderData FIND x', x)
        console.log('builderData FIND nodes', nodes)
        // x.indicator_id === nodes.id
      }
      );
      { console.log('dddddddddddd', nodes) }
      return <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, marginTop: 1, marginBottom: 1 }}>
        {(myData.type_id === '1' || myData.type_id === '2') && (
          <WidInput
            type="numeric"
            regex="required"
            label="Тоо"
            defaultValue={myTree.op === 'BETWEEN' ? myTree.value[0] : myTree.op !== 'BETWEEN' ? myTree.value : ''}
            name="value"
            dataChanged={(data) => inputChanged('value', data, 0)}
          />
        )}
        {/* <WidInput
        type="textCustom"
        regex="required"
        maxLength={11}
        label="Тусгай дугаар"
        name="value"
        dataChanged={(data) => inputChanged('value', data)}
      /> */}
        <WidInput
          type="select"
          regex="required"
          label="Operator"
          data={staticOperators}
          defaultValue={myTree.op}
          selectField="name"
          name="op"
          dataChanged={(data) => inputChanged('op', data, 0)}
        />
        {(myData.type_id === '1' || myData.type_id === '2') && myTree.op === 'BETWEEN' && (
          <WidInput
            type="numeric"
            regex="required"
            label="Тоо"
            defaultValue={myTree.value[1] ? myTree.value[1] : ''}
            name="value1"
            dataChanged={(data) => inputChanged('value1', data, 1)}
          />
        )}
        {(myData.type_id !== '1' && myData.type_id !== '2') && myTree.op === 'BETWEEN' && (
          <WidInput
            type="textCustom"
            regex="required"
            maxLength={11}
            label="Тусгай дугаар"
            name="value1"
            dataChanged={(data) => inputChanged('value1', data, 1)}
          />
        )}
      </Stack>
    } else {
      return <TreeItem onClick={() => selectedTreeFunc(nodes)} key={nodes.id} nodeId={`${nodes.id}, ${nodes.name}`} label={
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
          label={<>{nodes.val ? nodes.val : nodes.name}</>}
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
    const temp = [];
    setSegmentList({ ...segmentList, children: selectedCat });
    selectedCat.map(x => {
      temp.push(x);
    });
    setFinalArray(temp);
  }, [selectedCat]);
  console.log('finalArray', finalArray);

  console.log('selectedCat', selectedCat);
  const { handleSubmit, values } = formik;
  return (
    <Page title="Сегмент Indicator">
      <Card>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Dropdown selectedCat={(item) => setSelectedCat(item)} dataList={parentIndicatorList} />
              <TreeView
                aria-label="multi-select"
                defaultCollapseIcon={<Iconify icon={'akar-icons:chevron-down'} />}
                // defaultExpanded={['root']}
                multiSelect
                defaultEndIcon={null}
                onNodeSelect={(event, ids) => console.log('ids', ids)}
                defaultExpandIcon={<Iconify icon={'akar-icons:chevron-right'} />}
              >
                {segmentList && selectedCat.length > 0 && (
                  renderTree(segmentList)

                )}
              </TreeView>
            </Stack>
          </Form>
        </FormikProvider>
      </Card>
    </Page>
  );
}
