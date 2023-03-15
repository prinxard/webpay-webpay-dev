import { Dashboard, Invoice, UserGuide } from '../../components/Icons/index';

const initialState = [
  {
    title: 'Applications',
    items: [
      {
        url: '/dashboard',
        icon: <Dashboard />,
        title: 'Dashboard',
        items: [],
      },
      {
        url: '/',
        icon: <Invoice />,
        title: 'PAYMENT',
        items: [
          {
            url: '/payment/new-payment',
            title: 'New Payment',
            items: [],
          },
          {
            url: '/payment/payment-history',
            title: 'Payment History',
            items: [],
          },
          {
            url: '/payment/pending-invoice',
            title: 'Pending Assessment',
            items: [],
          },
        ],
      },

      {
        url: '#',
        icon: <UserGuide />,
        title: 'USER GUIDE',
        items: [],
      },
    ],
  },
];

export default function individualNavigation(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
