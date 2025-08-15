import prisma from "../db/prismaClient.js";

export const getNotifications = async (req, res) => {
  const { type } = req.query;
  const userId = req.user.id;

 

  const filter = { userId };
  if (type) filter.type = type;

  const notifications = await prisma.notification.findMany({
    where: filter,
    orderBy: { createdAt: "desc" }
  });

  
  res.json(notifications);
};


export const markAsRead = async (req, res) => {
  const { id } = req.params;
  await prisma.notification.update({
    where: { id: parseInt(id) },
    data: { isRead: true },
  });
  res.json({ message: "Marked as read" });
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  await prisma.notification.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Notification deleted" });
};
