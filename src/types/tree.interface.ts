export interface Tree {
	id: string;
	title: string;
	theme: string;
	description?: string;
	isPublic: boolean;
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
	owner: {
		id: string;
		name: string | null;
		email: string;
	};
	messages?: Message[];
}

export interface Message {
	id: string;
	content: string;
	treeId: string;
	createdAt: Date;
	updatedAt: Date;
	decoration?: string;
	senderId: string;
	sender?: {
		id: string;
		name: string | null;
		email: string;
		avatar?: string | null;
	};
}
