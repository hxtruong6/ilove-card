'use client';

import { Tree } from '@/types/tree.interface';
import {
  Box,
  Button,
  Field,
  FieldRoot,
  Input,
  Select,
  Stack,
  Textarea,
  createListCollection,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface TreeFormProps {
  tree?: Tree;
  onSuccess?: () => void;
}

const THEMES = createListCollection({
  items: [
    { value: 'christmas', label: 'Christmas' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'valentine', label: "Valentine's Day" },
    { value: 'easter', label: 'Easter' },
    { value: 'halloween', label: 'Halloween' },
  ],
});

const VISIBILITY = createListCollection({
  items: [
    { value: 'false', label: 'Private' },
    { value: 'true', label: 'Public' },
  ],
});

export function TreeForm({ tree, onSuccess }: TreeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title'),
        theme: formData.get('theme'),
        description: formData.get('description'),
        isPublic: formData.get('isPublic') === 'true',
      };

      const url = tree ? `/api/trees/${tree.id}` : '/api/trees';
      const method = tree ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save tree');
      }

      const savedTree = await response.json();
      toast.success(tree ? 'Tree updated successfully' : 'Tree created successfully');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/tree/${savedTree.id}`);
      }
    } catch (error) {
      toast.error(tree ? 'Failed to update tree' : 'Failed to create tree');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <FieldRoot required>
          <Field.Label>Title</Field.Label>
          <Input name="title" defaultValue={tree?.title} placeholder="Enter tree title" required />
        </FieldRoot>

        <FieldRoot required>
          <Field.Label>Theme</Field.Label>
          <Select.Root collection={THEMES} defaultValue={[tree?.theme || 'christmas']}>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select theme" />
              </Select.Trigger>
            </Select.Control>
            <Select.Content>
              {THEMES.items.map(theme => (
                <Select.Item key={theme.value} item={theme}>
                  {theme.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </FieldRoot>

        <FieldRoot>
          <Field.Label>Description</Field.Label>
          <Textarea
            name="description"
            defaultValue={tree?.description}
            placeholder="Enter tree description"
            rows={3}
          />
        </FieldRoot>

        <FieldRoot>
          <Field.Label>Visibility</Field.Label>
          <Select.Root collection={VISIBILITY} defaultValue={[tree?.isPublic ? 'true' : 'false']}>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select visibility" />
              </Select.Trigger>
            </Select.Control>
            <Select.Content>
              {VISIBILITY.items.map(item => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </FieldRoot>

        <Button type="submit" colorScheme="brand" size="lg" loading={isLoading}>
          {tree ? 'Update Tree' : 'Create Tree'}
        </Button>
      </Stack>
    </form>
  );
}
