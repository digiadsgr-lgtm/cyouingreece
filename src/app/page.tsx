import { redirect } from 'next/navigation';

export const metadata = {
  title: "CYouInGreece — See You In Greece",
  verification: {
    other: {
      "fo-verify": "398cfa48-ee3f-4e88-af21-ea8479711be2",
    },
  },
};

export default function RootPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* We use Next.js next/head equivalent for app router: exported metadata above! */}
      <p>Redirecting to <a href="/en">cyouingreece.com/en</a>...</p>
      {/* Fallback client-side redirect just in case */}
      <script dangerouslySetInnerHTML={{ __html: "window.location.replace('/en');" }} />
    </main>
  );
}
