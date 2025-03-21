type ValidIcons = "house.fill" | "lock.fill" | "person.fill" | "bell.fill";

export const getScreens = (isAuthenticated: boolean) => {
  return [
    {
      name: "index",
      title: "Home",
      icon: "house.fill" as ValidIcons,
    },
    !isAuthenticated
      ? {
          name: "authentication",
          title: "Authentication",
          icon: "lock.fill" as ValidIcons,
        }
      : [
          {
            name: "profile",
            title: "Profile",
            icon: "person.fill" as ValidIcons,
          },
          {
            name: "notifications",
            title: "Notifications",
            icon: "bell.fill" as ValidIcons,
          },
        ],
  ].flat();
};
