import React from 'react';
import styles from './Text.module.scss';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';

const VARIANT_TAG = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
} as const;

type IntrinsicTag = (typeof VARIANT_TAG)[TextVariant];

interface TextProps {
  variant: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const Text: React.FC<TextProps> = ({ variant, children, className = '', as }) => {
  const defaultTag: IntrinsicTag = VARIANT_TAG[variant];

  const Tag = (as ?? defaultTag) as React.ElementType<{
    className?: string;
    children?: React.ReactNode;
  }>;

  return <Tag className={`${styles[variant]} ${className}`.trim()}>{children}</Tag>;
};

export { Text };
export default Text;
