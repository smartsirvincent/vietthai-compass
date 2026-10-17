"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function PublicTracking({ ga4Id, gtmId }: { ga4Id: string; gtmId: string }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>
    {ga4Id ? <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
      <Script id="ga4-tracking" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4Id}', { allow_google_signals: false, allow_ad_personalization_signals: false });
      `}</Script>
    </> : null}
    {gtmId ? <Script id="gtm-tracking" strategy="afterInteractive">{`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `}</Script> : null}
  </>;
}
