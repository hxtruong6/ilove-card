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

	// Create themes
	await prisma.theme.upsert({
		where: { name: 'christmas' },
		update: {},
		create: { name: 'christmas', isPremium: false },
	});
	await prisma.theme.upsert({
		where: { name: 'birthday' },
		update: {},
		create: { name: 'birthday', isPremium: false },
	});

	// Create trees
	const christmasTree = await prisma.tree.create({
		data: {
			title: 'Christmas 2024',
			description: 'My festive Christmas tree',
			theme: { connect: { name: 'christmas' } },
			visibility: 'PUBLIC',
			owner: { connect: { id: alice.id } },
		},
	});

	const birthdayTree = await prisma.tree.create({
		data: {
			title: 'Birthday Wishes',
			description: 'Leave your birthday messages!',
			theme: { connect: { name: 'birthday' } },
			visibility: 'INVITE_ONLY',
			owner: { connect: { id: bob.id } },
		},
	});

	// Add tree recipients
	await prisma.treeRecipient.create({
		data: {
			tree: { connect: { id: birthdayTree.id } },
			user: { connect: { id: alice.id } },
		},
	});

	// Add messages
	await prisma.message.create({
		data: {
			content: 'Merry Christmas! 🎄',
			tree: { connect: { id: christmasTree.id } },
			sender: { connect: { id: bob.id } },
		},
	});

	await prisma.message.create({
		data: {
			content: 'Happy Birthday! 🎂',
			tree: { connect: { id: birthdayTree.id } },
			sender: { connect: { id: alice.id } },
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
