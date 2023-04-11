// component
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Violations Records',
    path: '/violations-records',
    icon: getIcon('mdi:account-warning'),
  },
  {
    title: 'Community Services',
    path: '/community-services',
    icon: getIcon('healthicons:community-meeting'),
  },
  {
    title: 'Invoices',
    path: '/invoices',
    icon: getIcon('material-symbols:receipt-long'),
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: getIcon('material-symbols:payments-outline-sharp'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: getIcon('iconoir:reports'),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: getIcon('material-symbols:settings'),
    children: [
      {
        title: 'Violation Categories',
        path: 'settings/violation-categories',
        icon: getIcon('carbon:category'),
      },
      {
        title: 'Violations List',
        path: 'settings/violations-list',
        icon: getIcon('mdi:warning-octagon'),
      },
      {
        title: 'Community Service Types',
        path: 'settings/community-services-types',
        icon: getIcon('healthicons:community-healthworker-outline'),
      },
    ]
  },
];

export default navConfig;
