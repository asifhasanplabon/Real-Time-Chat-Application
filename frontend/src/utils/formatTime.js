export const formatMessageTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatSidebarTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
  }

  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  if (now - date < msInWeek) {
    return date.toLocaleDateString("en-BD", { weekday: "short" });
  }

  return date.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
};
