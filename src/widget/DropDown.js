import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: 'none',
    margin: 0,
    color: 'inherit',
    fontSize: 13,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      padding: 8,
      borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'}`,
      '&[aria-selected="true"]': {
        backgroundColor: 'transparent',
      },
      [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]: {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: 'relative',
  },
}));

function PopperComponent(props) {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <StyledAutocompletePopper {...other} />;
}

PopperComponent.propTypes = {
  anchorEl: PropTypes.any,
  disablePortal: PropTypes.bool,
  open: PropTypes.bool.isRequired,
};

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
  boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'}`,
  borderRadius: 6,
  width: 300,
  zIndex: theme.zIndex.modal,
  fontSize: 13,
  color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: 10,
  width: '100%',
  borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
  '& input': {
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
    padding: 8,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
    fontSize: 14,
    '&:focus': {
      boxShadow: `0px 0px 0px 3px ${theme.palette.mode === 'light' ? 'rgba(3, 102, 214, 0.3)' : 'rgb(12, 45, 107)'}`,
      borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd',
    },
  },
}));

const Button = styled(ButtonBase)(({ theme }) => ({
  fontSize: 13,
  width: '100%',
  textAlign: 'left',
  paddingBottom: 8,
  color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
  fontWeight: 600,
  '&:hover,&:focus': {
    color: theme.palette.mode === 'light' ? '#0366d6' : '#58a6ff',
  },
  '& span': {
    width: '100%',
  },
  '& svg': {
    width: 16,
    height: 16,
  },
}));

export default function GitHubLabel({ selectedCat, dataList }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState([]);
  const [pendingValue, setPendingValue] = React.useState([]);
  const theme = useTheme();

  const handleClick = (event) => {
    setPendingValue(value);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    selectedCat(pendingValue);
    setValue(pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'github-label' : undefined;

  return (
    <React.Fragment>
      <Box sx={{ width: 221, fontSize: 13 }}>
        <Button disableRipple aria-describedby={id} onClick={handleClick}>
          <span>Сегмент ангилал сонгох</span>
          <SettingsIcon />
        </Button>
        {value.length > 0 &&
          value.map((label) => (
            <Box
              key={label.name}
              sx={{
                mt: '3px',
                height: 20,
                padding: '.15em 4px',
                fontWeight: 600,
                lineHeight: '15px',
                borderRadius: '2px',
              }}
              // style={{
              //   backgroundColor: label.color,
              //   color: theme.palette.getContrastText(label.color),
              // }}
            >
              {label.name}
            </Box>
          ))}
      </Box>
      <StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <Box
              sx={{
                borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
                padding: '8px 10px',
                fontWeight: 600,
              }}
            >
              Шүүж авах ангилалуудыг сонгоно уу
            </Box>
            <Autocomplete
              open
              multiple
              onClose={(event, reason) => {
                if (reason === 'escape') {
                  handleClose();
                }
              }}
              value={pendingValue}
              onChange={(event, newValue, reason) => {
                if (event.type === 'keydown' && event.key === 'Backspace' && reason === 'removeOption') {
                  return;
                }
                setPendingValue(newValue);
              }}
              disableCloseOnSelect
              PopperComponent={PopperComponent}
              renderTags={() => null}
              noOptionsText="No labels"
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Box
                    component={DoneIcon}
                    sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                    style={{
                      visibility: selected ? 'visible' : 'hidden',
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      width: 14,
                      height: 14,
                      flexShrink: 0,
                      borderRadius: '3px',
                      mr: 1,
                      mt: '2px',
                    }}
                    style={{ backgroundColor: option.color }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      '& span': {
                        color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
                      },
                    }}
                  >
                    {option.name}
                    <br />
                    <span>{option.description}</span>
                  </Box>
                  <Box
                    component={CloseIcon}
                    sx={{ opacity: 0.6, width: 18, height: 18 }}
                    style={{
                      visibility: selected ? 'visible' : 'hidden',
                    }}
                  />
                </li>
              )}
              options={[...dataList].sort((a, b) => {
                // Display the selected labels first.
                let ai = value.indexOf(a);
                ai = ai === -1 ? value.length + dataList.indexOf(a) : ai;
                let bi = value.indexOf(b);
                bi = bi === -1 ? value.length + dataList.indexOf(b) : bi;
                return ai - bi;
              })}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <StyledInput
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  autoFocus
                  placeholder="Үгээр хайх"
                />
              )}
            />
          </div>
        </ClickAwayListener>
      </StyledPopper>
    </React.Fragment>
  );
}

// From https://github.com/abdonrd/github-labels
const labels = [
  {
    id: '30',
    name: 'Product Type',
    color: '#7057ff',
    description: 'Good for newcomers',
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
  {
    id: '29',
    name: 'Market Type',
    color: '#008672',
    description: 'Extra attention is needed',
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
    id: '19',
    name: 'Хүйс',
    color: '#b60205',
    description: '',
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
    id: '3',
    name: 'Байршил',
    color: '#d93f0b',
    description: '',
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
    id: '40',
    name: 'User Type',
    color: '#0e8a16',
    description: '',
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
];
