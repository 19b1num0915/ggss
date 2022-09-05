// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  postregistration: getIcon('user-square'),
  decision: getIcon('task-square'),
  postnotes: getIcon('document'),
  auxiliary: getIcon('personalcard'),
  violation: getIcon('frame'),
  orders: getIcon('document-text'),
};
const sidebarConfigMerchant = [
  // GENERAL
  // ----------------------------------------------------------------------

  {
    subheader: 'Админ',
    items: [
      {
        title: 'BC',
        path: '/bc',
        icon: ICONS.decision,
        children: [
          { title: 'Захиалга', path: '/bc/order' },
          { title: 'Plan', path: '/bc/plan' },
          { title: 'Тайлан', path: '/bc/report' },
        ],
      },
      {
        title: 'Тохиргоо',
        path: '/settings',
        icon: ICONS.postregistration,
        children: [
          { title: 'Indicator', path: '/settings/indicator' },
          { title: 'User', path: '/settings/user' },
        ],
      },
    ],
  },
];
// const filter = '/bc/order';
// console.log('OMG: ', sidebarConfigMerchant);
// const dada = sidebarConfigMerchant[0].items.filter(x => {
//   if (x.children) {
//     const temp = x.children.filter(y => y.path === filter);
//     return x.children = temp
//   }
//   if (x.path === filter) {
//     return x
//   } else if (!x.children && x.children === []) {
//     return x
//   }
//   //  else if(x.children) {
//   //   const temp = x.children.filter(y => y.path === filter);
//   //   console.log('OMG: FOUND temp: ', temp);
//   //   x.children = temp;
//   //   console.log('OMG: FOUND x final: ', x);
//   // }
//   // if (!x.children) {
//   //   return null
//   // }
// });

// sidebarConfigMerchant[0].items.filter(x => x.children && x.children?.length === 0);
// console.log('OMG 1: ', dada);
// console.log('OMG 2: ', sidebarConfigMerchant);
// export default sidebarConfig;
export const menuConfig = {
  sidebarConfigMerchant,
};
