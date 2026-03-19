import type { Meta, StoryObj } from '@storybook/react';
import ImageSlider from './ImageSlider';

const meta: Meta<typeof ImageSlider> = {
  title: 'Components/ImageSlider',
  component: ImageSlider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ImageSlider>;

const baseImages = [
  'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
  'https://placehold.co/324x324/50C878/FFFFFF?text=2',
  'https://placehold.co/324x324/FF6F61/FFFFFF?text=3',
];

export const ThreeImages: Story = {
  args: {
    images: baseImages,
  },
};

export const FourImages: Story = {
  args: {
    images: [...baseImages, 'https://placehold.co/324x324/9B59B6/FFFFFF?text=4'],
  },
};

export const SevenImages: Story = {
  args: {
    images: [
      ...baseImages,
      'https://placehold.co/324x324/9B59B6/FFFFFF?text=4',
      'https://placehold.co/324x324/F39C12/FFFFFF?text=5',
      'https://placehold.co/324x324/34495E/FFFFFF?text=6',
      'https://placehold.co/324x324/E74C3C/FFFFFF?text=7',
    ],
  },
};
