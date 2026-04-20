// Root page: catches the bare '/' path and redirects to /en
// This is a server-side fallback in case the proxy middleware fails
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}
