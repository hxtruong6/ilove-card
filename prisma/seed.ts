import { hash } from 'bcryptjs';

import { PrismaClient } from '../prisma/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.message.deleteMany();
  await prisma.treeRecipient.deleteMany();
  await prisma.tree.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const password = await hash('password123', 10);

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Smith',
      password,
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      password,
    },
  });

  // Create trees
  const christmasTree = await prisma.tree.create({
    data: {
      title: 'Christmas 2024',
      description: 'My festive Christmas tree',
      theme: 'christmas',
      isPublic: true,
      ownerId: alice.id,
    },
  });

  const birthdayTree = await prisma.tree.create({
    data: {
      title: 'Birthday Wishes',
      description: 'Leave your birthday messages!',
      theme: 'birthday',
      isPublic: false,
      ownerId: bob.id,
    },
  });

  // Add tree recipients
  await prisma.treeRecipient.create({
    data: {
      treeId: birthdayTree.id,
      userId: alice.id,
    },
  });

  // Add messages
  await prisma.message.create({
    data: {
      content: 'Merry Christmas! 🎄',
      imageUrls: [],
      treeId: christmasTree.id,
      senderId: bob.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Happy Birthday! 🎂',
      imageUrls: [],
      treeId: birthdayTree.id,
      senderId: alice.id,
    },
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
