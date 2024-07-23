export const summary = {
  totalTasks: 10,
  last10Task: [
    {
      _id: "65c352b376ed5c48f9440955",
      title: "Review Code",
      date: "2024-07-18T00:00:00.000Z",
      priority: "medium",
      stage: "in progress",
      assets: [],
      team: [
        {
          _id: "65c5f27fb5204a81bde86833",
          name: "Yadnesh",
          title: "Admin",
          role: "Dev",
          isActive: true,
          createdAt: "2024-07-18T09:38:07.765Z",
        },
        {
          _id: "65c5f27fb5204a81bde86833",
          name: "Person 1",
          title: "User",
          role: "Dev",
          isActive: true,
          createdAt: "2024-07-18T09:38:07.765Z",
        },
        {
          _id: "65c5f27fb5204a81bde86833",
          name: "Person 2",
          title: "User",
          role: "Dev",
          isActive: true,
          createdAt: "2024-07-18T09:38:07.765Z",
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Dashboard",
          date: "2024-07-18T00:00:00.000Z",
          tag: "Website App",
          _id: "65c3535476ed5c48f9440973",
        },
      ],
      createdAt: "2024-07-18T09:51:47.149Z",
      updatedAt: "2024-07-18T09:54:28.645Z",
      __v: 1,
    },
    {
      _id: "65c351b976ed5c48f9440947",
      title: "Project Review",
      date: "2024-07-18T00:00:00.000Z",
      priority: "high",
      stage: "todo",
      assets: [],
      team: [
        {
          _id: "65c5f27fb5204a81bde86833",
          name: "Yadnesh",
          title: "Admin",
          role: "Dev",
          isActive: true,
          createdAt: "2024-07-18T09:38:07.765Z",
        },
        {
          _id: "65c5f27fb5204a81bde86833",
          name: "Person 1",
          title: "User",
          role: "Dev",
          isActive: true,
          createdAt: "2024-07-18T09:38:07.765Z",
        },
        {
          _id: "65c5f27fb5204a81bde86833",
          name: "Person 2",
          title: "User",
          role: "Dev",
          isActive: true,
          createdAt: "2024-07-18T09:38:07.765Z",
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Review Documents",
          date: "2024-07-18T00:00:00.000Z",
          tag: "Design",
          _id: "65c352e776ed5c48f944095c",
        },
        {
          title: "Review Code",
          date: "2024-07-18T00:00:00.000Z",
          tag: "Design",
          _id: "65c3531476ed5c48f9440965",
        },
      ],
      createdAt: "2024-07-18T09:47:37.337Z",
      updatedAt: "2024-07-18T09:53:24.079Z",
      __v: 2,
    },
  ],
  users: [
    {
      _id: "65c5f27fb5204a81bde86833",
      name: "Yadnesh",
      title: "Admin",
      email: "yadnesh.gawas@gmail.com",
      role: "Dev",
      isActive: true,
      createdAt: "2024-07-18T09:38:07.765Z",
    },
    {
      _id: "65c5f27fb5204a81bde86833",
      name: "Person 2",
      title: "User",
      email: "p2@gmail.com",
      role: "Dev",
      isActive: true,
      createdAt: "2024-07-18T09:38:07.765Z",
    },
    {
      _id: "65c5f27fb5204a81bde86833",
      name: "Person 2",
      title: "User",
      email: "p3@gmail.com",
      role: "Dev",
      isActive: true,
      createdAt: "2024-07-18T09:38:07.765Z",
    },
  ],
  tasks: {
    todo: 6,
    "in progress": 3,
    completed: 1,
  },
};

export const projects = [
  {
    _id: "65d5f12ab5204a81bde866b1",//Project 1
    title: "Project1",
    date: "2024-07-18T00:00:00.000Z",
    priority: "medium",
    stage: "todo",
    assets: [],
    tasks: [
      {
        _id: "65c5f12ab5204a81bde866a8",//Task 1
      },
      {
        _id: "65c5f12ab5204a81bde866a9",//Task 2
      },
    ],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Yadnesh",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person2",
        title: "User",
        email: "user@example.com",
      },
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Person3",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person4",
        title: "User",
        email: "user@example.com",
      },
    ],
    isTrashed: false,
    activities: [],
    createdAt: "2024-07-18T09:32:26.574Z",
    updatedAt: "2024-02-18T09:36:53.339Z",
    __v: 1,
  },
  {
    _id: "65d5f12ab5204a81bde866b2",//Project 2
    title: "Project2",
    date: "2024-07-18T00:00:00.000Z",
    priority: "medium",
    stage: "todo",
    assets: [],
    tasks: [
      {
        _id: "65c5f12ab5204a81bde866c2",//Task 3
      },
      {
        _id: "65c5f12ab5204a81bde866a5",//Task 4
      },
    ],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Yadnesh",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person2",
        title: "User",
        email: "user@example.com",
      },
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Person3",
        title: "Administrator",
        email: "admin@gmail.com",
      },
    ],
    isTrashed: false,
    activities: [],
    createdAt: "2024-07-19T09:32:26.574Z",
    updatedAt: "2024-02-19T09:36:53.339Z",
    __v: 1,
  },
];

export const tasks = [
  {
    _id: "65c5f12ab5204a81bde866a8",//Task 1
    pid: "65d5f12ab5204a81bde866b1",//Project 1
    title: "Task 1",
    date: "2024-07-18T00:00:00.000Z",
    priority: "medium",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "662f32ffd1303cc",
        name: "Yadnesh",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person2",
        title: "User",
        email: "user@example.com",
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Tasks",
        date: "2024-07-18T00:00:00.000Z",
        tag: "testing",
        _id: "65c5f153b5204a81bde866c7",
      },
    ],
    createdAt: "2024-07-18T09:32:26.574Z",
    updatedAt: "2024-02-18T09:36:53.339Z",
    __v: 1,
  },
  {
    _id: "65c5f12ab5204a81bde866a9",//Task 2
    pid: "65d5f12ab5204a81bde866b1",//Project 1
    title: "Task 2",
    date: "2024-07-18T00:00:00.000Z",
    priority: "medium",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Person3",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person4",
        title: "User",
        email: "user@example.com",
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Tasks",
        date: "2024-07-18T00:00:00.000Z",
        tag: "testing",
        _id: "65c5f153b5204a81bde866c9",
      },
    ],
    createdAt: "2024-07-18T09:32:26.574Z",
    updatedAt: "2024-02-18T09:36:53.339Z",
    __v: 1,
  },
  {
    _id: "65c5f12ab5204a81bde866c2",//Task 3
    pid: "65d5f12ab5204a81bde866b2",//Project 2
    title: "Task 3",
    date: "2024-07-18T00:00:00.000Z",
    priority: "medium",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Person3",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person4",
        title: "User",
        email: "user@example.com",
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Tasks",
        date: "2024-07-18T00:00:00.000Z",
        tag: "testing",
        _id: "65c5f153b5204a81bde866c9",
      },
    ],
    createdAt: "2024-07-18T09:32:26.574Z",
    updatedAt: "2024-02-18T09:36:53.339Z",
    __v: 1,
  },
  {
    _id: "65c5f12ab5204a81bde866a5",//Task 4
    pid: "65d5f12ab5204a81bde866b2",//Project 2
    title: "Task 4",
    date: "2024-07-18T00:00:00.000Z",
    priority: "medium",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        name: "Person3",
        title: "Administrator",
        email: "admin@gmail.com",
      },
      {
        _id: "65c30b96e639681a13def0b5",
        name: "Person4",
        title: "User",
        email: "user@example.com",
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Tasks",
        date: "2024-07-18T00:00:00.000Z",
        tag: "testing",
        _id: "65c5f153b5204a81bde866c9",
      },
    ],
    createdAt: "2024-07-18T09:32:26.574Z",
    updatedAt: "2024-02-18T09:36:53.339Z",
    __v: 1,
  },
];

//modify the isAdmin attribute to switch between user and admin
export const user = {
  _id: "662f32ffd1303cc",
  name: "Yadnesh Gawas",
  title: "Administrator",
  role: "Admin",
  email: "yadnesh@gmail.com",
  isAdmin: true,
  tasks: [],
  createdAt: "2024-07-18T09:58:44.794Z",
  updatedAt: "2024-07-18T06:13:26.757Z",
  __v: 0,
  isActive: true,
};

export const activitiesData = [
  {
    _id: "0",
    type: "started",
    activity: "started this task.",
    date: new Date("2024-07-18").toISOString(),
    by: "Yadnesh Gawas",
  },
  {
    _id: "1",
    type: "commented",
    activity:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam.",
    date: new Date("2024-07-18").toISOString(),
    by: "Person 1",
  },
];
