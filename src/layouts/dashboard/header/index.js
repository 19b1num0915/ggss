import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
import useSettings from 'src/hooks/useSettings';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import {
  DASHBOARD_NAVBAR_WIDTH,
  DASHBOARD_HEADER_MOBILE,
  DASHBOARD_HEADER_DESKTOP,
  DASHBOARD_NAVBAR_COLLAPSE_WIDTH,
} from '../../../config';
// components
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
//
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import LightMode from './LightMode';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse',
})(({ isCollapse, theme }) => ({
  boxShadow: 'none',
  ...cssStyles(theme).bgBlur(),
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DASHBOARD_NAVBAR_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${DASHBOARD_NAVBAR_COLLAPSE_WIDTH}px)`,
    }),
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: DASHBOARD_HEADER_MOBILE,
 
  transition: theme.transitions.create('min-height', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 5),
    minHeight: DASHBOARD_HEADER_DESKTOP,
  },
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardHeader({ onOpenSidebar }) {
  const { isCollapse } = useCollapseDrawer();
  const { themeMode } = useSettings();
  const isOffset = useOffSetTop(DASHBOARD_HEADER_DESKTOP);

  const isDesktop = useResponsive('up', 'lg');

  return (
    <RootStyle isCollapse={isCollapse} style={{
      border: '1px solid',
      borderStyle:'none',
      background: themeMode === 'light' ? 'white' : '#161C24',
      borderBottomStyle: 'solid',
      borderColor: '#e5e8eb',
    }}>
      <ToolbarStyle
        sx={{
          ...(isOffset && {
            minHeight: { md: DASHBOARD_HEADER_DESKTOP - 16 },
          }),
        }}
      >
        {!isDesktop && (
          <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButtonAnimate>
        )}

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {/* <LanguagePopover /> */}
          <LightMode />
          <NotificationsPopover />
          {/* <ContactsPopover /> */}
          <AccountPopover/>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
