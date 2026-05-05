import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a root layout in [locale], this one can just render the children
export default function RootLayout({ children }: Props) {
  return children;
}
