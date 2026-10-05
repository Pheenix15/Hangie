// Where each sidebar item goes. null means the path isn't known yet, so tapping does nothing
export const SIDEBAR_ROUTES = {
  profile: "/(tabs)/profile",
  editProfile: "/(settings)/editProfile",
  hangouts: "/(tabs)/hangout",
  // Calendar opens the Map tab, which the tabs layout still names "profile"
  calendar: "/(tabs)/map",
  // Communities opens Chat until it gets its own screen
  communities: "/(tabs)/chat",
};

// The menu sections in the order they appear. Items without a route are placeholders
export const SIDEBAR_SECTIONS = [
  {
    title: "Menu",
    items: [
      {
        id: "profile",
        label: "Profile",
        icon: "user",
        route: SIDEBAR_ROUTES.profile,
      },
      {
        id: "communities",
        label: "Communities",
        icon: "users",
        route: SIDEBAR_ROUTES.communities,
      },
      {
        id: "hangouts",
        label: "My hangouts",
        icon: "sparkles",
        route: SIDEBAR_ROUTES.hangouts,
      },
      {
        id: "calendar",
        label: "My calendar",
        icon: "calendar",
        route: SIDEBAR_ROUTES.calendar,
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "settings", label: "Settings", icon: "settings", route: null },
      { id: "privacy", label: "Privacy", icon: "shield", route: null },
      {
        id: "notifications",
        label: "Notifications",
        icon: "bell",
        route: null,
      },
      { id: "darkMode", label: "Dark mode", icon: "moon", route: null },
    ],
  },
  {
    title: "Support",
    items: [
      { id: "help", label: "Help centre", icon: "life-buoy", route: null },
      {
        id: "feedback",
        label: "Send feedback",
        icon: "message-square",
        route: null,
      },
      { id: "terms", label: "Terms & Privacy", icon: "file-text", route: null },
    ],
  },
];

// The counts shown under the user's name
export const SIDEBAR_STATS = [
  { key: "events", singular: "Hangout", plural: "Hangouts" },
  { key: "friends", singular: "Friend", plural: "Friends" },
  { key: "posts", singular: "Post", plural: "Posts" },
];
