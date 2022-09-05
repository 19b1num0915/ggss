export default {
  staticData: [
    {
      value: 'Үгүй',
      ID: false,
    },
    {
      value: 'Тийм',
      ID: true,
    },
  ],
  helperData: [
    {
      id: 0,
      value: 'Үгүй',
    },
    {
      id: 1,
      value: 'Тийм',
    },
  ],
  loanType: [
    {
      id: '1',
      name: 'Хэвийн',
    },
    {
      id: '2',
      name: 'Хугацаа хэтэрсэн',
    },
    {
      id: '3',
      name: 'Хар жагсаалт',
    },
    {
      id: '4',
      name: 'Идэвхигүй',
    },
  ],

  loanStatus: [
    {
      id: 'NORMAL',
      name: 'Хэвийн',
    },
    {
      id: 'OVERDUE',
      name: 'Хугацаа хэтэрсэн',
    },
    {
      id: 'BLACKLISTED',
      name: 'Хар жагсаалт',
    },
    {
      id: 'INACTIVE',
      name: 'Идэвхигүй',
    },
  ],
  loanStaticData: [
    {
      id: 'ACC_CLOSE',
      name: 'Төлж дууссан',
    },
    {
      id: 'ACC_OPEN',
      name: 'Төлж дуусаагүй',
    },
  ],
  relationData: [
    {
      id: 0,
      value: 'Эцэг/Эх',
    },
    {
      id: 1,
      value: 'Эхнэр/Нөхөр',
    },
    {
      id: 2,
      value: 'Хүүхэд',
    },
    {
      id: 3,
      value: 'Ах/Эгч/Дүү',
    },
    {
      id: 4,
      value: 'Найз нөхөд',
    },
    {
      id: 5,
      value: 'Бусад',
    },
  ],
  statusList: [
    'Баталгаажсан',
    'Утас бүртгүүлсэн',
    'Баталгаажаагүй',
    'Татгалзсан',
    'Түр зогсоосон',
    'Хар жагсаалтад орсон',
    'Зөвшөөрөл хүссэн',
  ],
  userType: [
    {
      id: 0,
      value: 'Хувь хүн',
    },
    {
      id: 1,
      value: 'Байгууллага',
    },
  ],
};
