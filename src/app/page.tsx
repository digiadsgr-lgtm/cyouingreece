// Root fallback — runs on the server, redirects bare '/' to '/en'
// This is needed when the proxy middleware hasn't already redirected
import { permanentRedirect } from 'next/navigation';

export default function RootPage() {
  permanentRedirect('/en');
}

export const dynamic = 'force-static';
