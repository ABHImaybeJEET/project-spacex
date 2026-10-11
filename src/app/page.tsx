import Innovision from "@/components/innovision/Innovision";
import { SITE_DESCRIPTION } from "@/config/site";
import { homeJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";

// Canonical "/" also covers the query-string entry points (?auth=login, ?open=register, OAuth ?code=) and every
// #/ hash route, which all render this one page.
export const metadata = pageMetadata({ title: null, description: SITE_DESCRIPTION, path: "/" });

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(homeJsonLd()) }} />
      <Innovision />
    </>
  );
}
