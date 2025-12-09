'use client';

import { Box, Button, ButtonGroup, Icon, IconButton } from '@chakra-ui/react';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FiBold, FiCode, FiItalic, FiList } from 'react-icons/fi';

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	editable?: boolean;
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: 'Write a festive message...',
			}),
		],
		content,
		editable,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose focus:outline-none min-h-[100px] p-2',
			},
		},
	});

	if (!editor) {
		return null;
	}

	if (!editable) {
		return <EditorContent editor={editor} />;
	}

	return (
		<Box borderWidth="1px" borderRadius="md" overflow="hidden">
			{/* Toolbar */}
			<Box bg="gray.50" p={2} borderBottomWidth="1px" display="flex" gap={2}>
				<ButtonGroup size="sm" variant="ghost" attached>
					<IconButton
						aria-label="Bold"
						onClick={() => editor.chain().focus().toggleBold().run()}
						colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
					>
						<Icon as={FiBold} />
					</IconButton>
					<IconButton
						aria-label="Italic"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
					>
						<Icon as={FiItalic} />
					</IconButton>
					<IconButton
						aria-label="Bullet List"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						colorScheme={editor.isActive('bulletList') ? 'blue' : 'gray'}
					>
						<Icon as={FiList} />
					</IconButton>
					<IconButton
						aria-label="Code"
						onClick={() => editor.chain().focus().toggleCode().run()}
						colorScheme={editor.isActive('code') ? 'blue' : 'gray'}
					>
						<Icon as={FiCode} />
					</IconButton>
				</ButtonGroup>
			</Box>

			{/* Editor Content */}
			<Box p={2}>
				<EditorContent editor={editor} />
			</Box>
		</Box>
	);
}
