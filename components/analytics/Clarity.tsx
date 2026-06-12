import Script from "next/script";

/**
 * Microsoft Clarity (heatmaps + session recordings), per the SOP.
 * Activates automatically once `NEXT_PUBLIC_CLARITY_ID` is set in the
 * environment — renders nothing (and ships no script) until then.
 */
export function Clarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}
