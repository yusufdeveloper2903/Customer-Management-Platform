export const appealsTableFields = [
  {
    key: 'period',
    label: 'general.detail',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'client.full_name',
    label: 'finance.client',
  },
  {
    key: 'client.phone_number',
    label: 'users.phone_number',
    formatter: data => `+${data}`,
  },
  {
    key: 'typeClient',
    label: 'opertators.type_client',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'login',
    label: 'opertators.Login',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'tariff',
    label: 'opertators.tariff',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'discount',
    label: 'opertators.promotion',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'location',
    label: 'opertators.address',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'application',
    label: 'opertators.typeAplication',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'status',
    label: 'users.status',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'operator',
    label: 'opertators.author',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'responsible',
    label: 'opertators.responsibledot',
  },
  {
    key: 'action',
    label: 'opertators.action',
    thClass: 'text-center',
    tdClass: 'text-center more-space',
  },
]

export const mastersTableFields = [
  {
    key: 'period',
    label: 'general.detail',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  // {
  //   key: 'client.full_name',
  //   label: 'finance.client',
  // },
  {
    key: 'client.phone_number',
    label: 'users.phone_number',
    formatter: data => `+${data}`,
  },
  // {
  //   key: 'typeClient',
  //   label: 'opertators.type_client',
  //   thClass: 'text-center',
  //   tdClass: 'text-center',
  // },
  // {
  //   key: 'login',
  //   label: 'opertators.Login',
  //   thClass: 'text-center',
  //   tdClass: 'text-center',
  // },
  // {
  //   key: 'tariff',
  //   label: 'opertators.tariff',
  //   thClass: 'text-center',
  //   tdClass: 'text-center',
  // },
  // {
  //   key: 'discount',
  //   label: 'opertators.promotion',
  //   thClass: 'text-center',
  //   tdClass: 'text-center',
  // },
  {
    key: 'location',
    label: 'opertators.address',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'application',
    label: 'opertators.typeAplication',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'comment.name',
    label: 'opertators.comment',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'status',
    label: 'users.status',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  // {
  //   key: 'operator',
  //   label: 'opertators.author',
  //   thClass: 'text-center',
  //   tdClass: 'text-center',
  // },
  // {
  //   key: 'responsible',
  //   label: 'opertators.responsibledot',
  // },
  {
    key: 'action',
    label: 'opertators.action',
    thClass: 'text-center',
    tdClass: 'text-center more-space',
  },
]

// export const mastersMiniTableFields = [
//   {
//     key: 'period',
//     label: 'general.detail',
//     thClass: 'text-center',
//     tdClass: 'text-center',
//   },
//   {
//     key: 'client.phone_number',
//     label: 'users.phone_number',
//     formatter: data => `+${data}`,
//     tdClass: 'px-1',
//   },
//   {
//     key: 'application',
//     label: 'opertators.typeAplication',
//     thClass: 'text-center',
//     tdClass: 'text-center',
//   },
//   {
//     key: 'location',
//     label: 'opertators.address',
//     thClass: 'text-center',
//     tdClass: 'text-center px-1',
//   },
//   {
//     key: 'comment.name',
//     label: 'opertators.comments',
//     thClass: 'text-center',
//     tdClass: 'text-center px-1',
//   },
//   {
//     key: 'status',
//     label: 'users.status',
//     thClass: 'text-center',
//     tdClass: 'text-center px-1',
//   },
// ]

export const mastersMiniTableFields = [
  {
    key: 'period',
    label: 'finance.dates',
    thClass: 'text-center centerTh',
    tdClass: 'text-center',
  },
  {
    key: 'client.phone_number',
    label: 'users.phone_number',
    formatter: data => `+${data}`,
    thClass: 'text-center centerTh',
    tdClass: 'text-center',
  },
  {
    key: 'application',
    label: 'courses.type',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'location',
    label: 'opertators.address',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'comment.name',
    label: 'opertators.comments',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
  {
    key: 'status',
    label: 'users.status',
    thClass: 'text-center',
    tdClass: 'text-center',
  },
]

export const optionsTreeSelect = [{
  id: 'm',
  label: 'McDonalds',
  children: [{
    id: 'm-fries',
    label: 'French Fries',
  }, {
    id: 'm-cheeseburger',
    label: 'Cheeseburger',
  }, {
    id: 'm-white-cheedar-burger',
    label: 'White Cheddar Burger',
  }, {
    id: 'm-southwest-buttermilk-crispy-chicken-salad',
    label: 'Southwest Buttermilk Crispy Chicken Salad',
  }, {
    id: 'm-cola',
    label: 'Coca-Cola®',
  }, {
    id: 'm-chocolate-shake',
    label: 'Chocolate Shake',
  }],
}, {
  id: 'kfc',
  label: 'KFC',
  children: [{
    id: 'kfc-fries',
    label: 'French Fries',
  }, {
    id: 'kfc-chicken-litties-sandwiches',
    label: 'Chicken Litties Sandwiches',
  }, {
    id: 'kfc-grilled-chicken',
    label: 'Grilled Chicken',
  }, {
    id: 'kfc-cola',
    label: 'Pepsi® Cola',
  }],
}, {
  id: 'bk',
  label: 'Burger King',
  children: [{
    id: 'bk-chicken-fries',
    label: 'Chicken Fries',
  }, {
    id: 'bk-chicken-nuggets',
    label: 'Chicken Nuggets',
  }, {
    id: 'bk-garden-side-salad',
    label: 'Garden Side Salad',
  }, {
    id: 'bk-cheeseburger',
    label: 'Cheeseburger',
  }, {
    id: 'bk-bacon-king-jr-sandwich',
    label: 'BACON KING™ Jr. Sandwich',
  }, {
    id: 'bk-cola',
    label: 'Coca-Cola®',
  }, {
    id: 'bk-oreo-chocolate-shake',
    label: 'OREO® Chocolate Shake',
  }],
}]
