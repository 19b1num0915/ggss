import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography, Avatar } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: '8px',
  border: '1px solid',
  cursor: 'pointer',
  borderColor: '#E5E8EB',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
  pathname: PropTypes.string,
};

export default function NavbarAccount({ isCollapse,pathname }) {
  return (
    <Link underline="none" color="inherit" component={RouterLink} to={'/dashboard/section/outpostsectiondiagram'} >
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
        style={{ backgroundColor: pathname === '/dashboard/section/outpostsectiondiagram'
        ? '#eef6ee'
        : 'white',}}
      >
        <Avatar src="/logo/logoImap.png" alt="Imap Logo" />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle1" noWrap style={{fontSize:'12px',fontWeight: '600',color: pathname === '/dashboard/section/outpostsectiondiagram' ? '#008B03' :'#212B36' }}>
          Заставын хариуцсан 
          </Typography>
          <Typography variant="subtitle2" noWrap style={{fontSize:'12px' ,fontWeight: '600',color: pathname === '/dashboard/section/outpostsectiondiagram' ? '#008B03' :'#212B36'   }}>
          хэсгийн бүдүүвч
          </Typography>
         
        </Box>
        <Typography variant="subtitle3" noWrap style={{paddingLeft:'8px',paddingTop:'5px' }}>
        {icon}
        </Typography>
      </RootStyle>
    </Link>
  );
}
const icon = (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.66667 9.66667C1.5109 9.66698 1.35994 9.61273 1.24 9.51334C1.10366 9.40031 1.0179 9.23767 1.00164 9.06132C0.985383 8.88497 1.03996 8.70939 1.15333 8.57334L4.14 5L1.26 1.42C1.14815 1.28228 1.09582 1.10564 1.11459 0.929216C1.13336 0.752788 1.22168 0.591119 1.36 0.480004C1.49944 0.357311 1.68375 0.298354 1.86852 0.317336C2.05328 0.336319 2.22175 0.431521 2.33333 0.580004L5.55333 4.58C5.75555 4.82601 5.75555 5.18067 5.55333 5.42667L2.22 9.42667C2.08436 9.5903 1.87882 9.67945 1.66667 9.66667Z" fill="#637381"/>
  </svg>
  
);
