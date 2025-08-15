import prisma from '../db/prismaClient.js';

const users = await prisma.user.findMany();
