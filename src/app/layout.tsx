import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a root layout in [locale], this one can just render the children
// We add fo-verify here so it's guaranteed to be on the absolute root domain
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta name="fo-verify" content="398cfa48-ee3f-4e88-af21-ea8479711be2" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
