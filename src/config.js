
// LAYOUT
// ----------------------------------------------------------------------

export const DRAWER_WIDTH = 260;

export const HOST_API = process.env.REACT_APP_API_URL_OAUTH || '';


export const DASHBOARD_HEADER_MOBILE = 64;
export const DASHBOARD_HEADER_DESKTOP = 72;
export const DASHBOARD_NAVBAR_WIDTH = 280;
export const DASHBOARD_NAVBAR_COLLAPSE_WIDTH = 88;

export const DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT = 48;
export const DASHBOARD_NAVBAR_SUB_ITEM_HEIGHT = 58;
export const DASHBOARD_NAVBAR_ICON_ITEM_SIZE = 22;

export const MAIN_HEADER_DESKTOP = 88;
export const MAIN_HEADER_MOBILE = 64;



// SETTINGS
// ----------------------------------------------------------------------

export const defaultSettings = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeColorPresets: 'default',
  themeStretch: false,
  themeContrast: 'default',
};
// PROJECT COLOR SELECTION PART
export const customPalette = [
  // GREEN
  {
    name: 'primary',
    lighter: '#C8FACD',
    light: '#5BE584',
    main: '#78C81E',
    dark: '#45C800',
    darker: '#78C81E'
  },
  // PURPLE
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#fff',
  },
  // CYAN
  {
    name: 'cyan',
    lighter: '#D1FFFC',
    light: '#76F2FF',
    main: '#1CCAFF',
    dark: '#0E77B7',
    darker: '#053D7A',
    contrastText: '#212B36'
  },
  // BLUE
  {
    name: 'blue',
    lighter: '#CCDFFF',
    light: '#6697FF',
    main: '#0045FF',
    dark: '#0027B7',
    darker: '#00137A',
    contrastText: '#fff'
  },
  // ORANGE
  {
    name: 'orange',
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#fda92d',
    dark: '#B66816',
    darker: '#793908',
    contrastText: '#212B36'
  },
  // RED
  {
    name: 'red',
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930',
    contrastText: '#fff'
  }
]
// Project Logo
export const logo = '/logo/logo.png';
export const logoBlack = '/logo/logo-black.png';
export const projectName = 'Unitel';
