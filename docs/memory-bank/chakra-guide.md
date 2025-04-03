# Chakra UI v3 Guide

## Overview

This guide documents the usage of Chakra UI v3 in the iCard project. It includes component patterns, best practices, and examples to ensure consistent UI implementation across the application.

## Core Concepts

### 1. Component Structure

Chakra UI v3 follows a compound component pattern with `.Root`, `.Body`, `.Header`, `.Footer` etc. structure:

```tsx
import { Card } from '@chakra-ui/react';

const Example = () => (
  <Card.Root>
    <Card.Header>
      <Card.Title>Title</Card.Title>
    </Card.Header>
    <Card.Body>Content</Card.Body>
    <Card.Footer>Actions</Card.Footer>
  </Card.Root>
);
```

### 2. Common Components

#### Buttons

```tsx
import { Button, HStack } from '@chakra-ui/react';
import { RiArrowRightLine, RiMailLine } from 'react-icons/ri';

const ButtonExample = () => (
  <HStack>
    <Button colorPalette="teal" variant="solid">
      <RiMailLine /> Email
    </Button>
    <Button colorPalette="teal" variant="outline">
      Call us <RiArrowRightLine />
    </Button>
  </HStack>
);
```

#### Avatars

```tsx
import { Avatar, HStack } from '@chakra-ui/react';

const AvatarExample = () => (
  <HStack gap="4">
    <Avatar.Root shape="square" size="lg">
      <Avatar.Fallback name="Dan Abramov" />
      <Avatar.Image src="https://bit.ly/dan-abramov" />
    </Avatar.Root>
    <Avatar.Root shape="rounded" size="lg">
      <Avatar.Fallback name="Segun Adebayo" />
      <Avatar.Image src="https://bit.ly/sage-adebayo" />
    </Avatar.Root>
  </HStack>
);
```

#### Cards

```tsx
import { Avatar, Button, Card } from '@chakra-ui/react';

const CardExample = () => (
  <Card.Root width="320px">
    <Card.Body gap="2">
      <Avatar.Root size="lg" shape="rounded">
        <Avatar.Image src="https://picsum.photos/200/300" />
        <Avatar.Fallback name="Nue Camp" />
      </Avatar.Root>
      <Card.Title mt="2">Nue Camp</Card.Title>
      <Card.Description>
        This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Card.Description>
    </Card.Body>
    <Card.Footer justifyContent="flex-end">
      <Button variant="outline">View</Button>
      <Button>Join</Button>
    </Card.Footer>
  </Card.Root>
);
```

#### Forms

```tsx
import { Field, Input } from '@chakra-ui/react';

const FormExample = () => (
  <Field.Root required>
    <Field.Label>
      Email
      <Field.RequiredIndicator />
    </Field.Label>
    <Input placeholder="me@example.com" />
  </Field.Root>
);
```

#### Form with React Hook Form

```tsx
'use client';

import { Button, Field, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface FormValues {
  firstName: string;
  lastName: string;
}

const FormWithValidation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(data => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.firstName}>
          <Field.Label>First name</Field.Label>
          <Input {...register('firstName')} />
          <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.lastName}>
          <Field.Label>Last name</Field.Label>
          <Input {...register('lastName')} />
          <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
};
```

#### Select

```tsx
'use client';

import { Portal, Select, createListCollection } from '@chakra-ui/react';

const SelectExample = () => {
  return (
    <Select.Root collection={frameworks} size="sm" width="320px">
      <Select.HiddenSelect />
      <Select.Label>Select framework</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select framework" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map(framework => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

const frameworks = createListCollection({
  items: [
    { label: 'React.js', value: 'react' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ],
});
```

#### Lists

```tsx
import { List } from '@chakra-ui/react';
import { LuCircleCheck, LuCircleDashed } from 'react-icons/lu';

const ListExample = () => (
  <List.Root gap="2" variant="plain" align="center">
    <List.Item>
      <List.Indicator asChild color="green.500">
        <LuCircleCheck />
      </List.Indicator>
      Lorem ipsum dolor sit amet
    </List.Item>
    <List.Item>
      <List.Indicator asChild color="green.500">
        <LuCircleCheck />
      </List.Indicator>
      Assumenda, quia temporibus eveniet
    </List.Item>
  </List.Root>
);
```

#### Icon Buttons

```tsx
import { For, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { LuVoicemail } from 'react-icons/lu';

const IconButtonExample = () => (
  <HStack wrap="wrap" gap="8">
    <For each={['solid', 'subtle', 'surface', 'outline', 'ghost']}>
      {variant => (
        <VStack key={variant}>
          <IconButton aria-label="Call support" key={variant} variant={variant}>
            <LuVoicemail />
          </IconButton>
          <Text textStyle="sm">{variant}</Text>
        </VStack>
      )}
    </For>
  </HStack>
);
```

## Best Practices

1. **Component Structure**

   - Always use the compound component pattern
   - Use `.Root` as the main wrapper
   - Follow the established structure (Header, Body, Footer)

2. **Styling**

   - Use theme tokens for colors, spacing, and typography
   - Prefer semantic color tokens (e.g., `colorPalette="teal"`)
   - Use responsive styles when needed

3. **Accessibility**

   - Always provide `aria-label` for icon buttons
   - Use semantic HTML elements
   - Ensure proper keyboard navigation

4. **Forms**

   - Use `Field.Root` for form controls
   - Implement proper error handling
   - Use React Hook Form for form management

5. **Layout**
   - Use `HStack` and `VStack` for flex layouts
   - Use `gap` prop for consistent spacing
   - Use `wrap` prop for responsive layouts

## Theme Customization

The project uses a custom theme defined in `styles/theme.ts`. Key customizations include:

1. **Colors**

   - Primary: Teal palette
   - Secondary: Gray palette
   - Accent: Orange palette

2. **Typography**

   - Custom font families
   - Defined text styles
   - Responsive font sizes

3. **Components**
   - Custom button variants
   - Card styles
   - Form control styles

## Updates Log

### 2024-04-03

- Initial guide creation
- Added core component examples
- Documented best practices
- Added theme customization section

## Future Updates

- Add more component examples
- Document advanced patterns
- Add performance optimization tips
- Include testing strategies
