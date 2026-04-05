import { useEffect, useRef } from "react";

/**
 * AdBanner - Google AdSense ad unit component.
 *
 * Usage:
 *   <AdBanner
 *     dataAdSlot="1234567890"        // Required: your ad unit slot ID from AdSense
 *     dataAdFormat="auto"            // Optional: ad format (default: "auto")
 *     dataFullWidthResponsive={true} // Optional: responsive width (default: true)
 *     style={{ ... }}                // Optional: custom styles
 *   />
 *
 * You get the dataAdSlot from your Google AdSense dashboard:
 *   AdSense > Ads > By ad unit > Create/copy the "data-ad-slot" value.
 */
const AdBanner = ({
    dataAdSlot = "5487230272",
    dataAdFormat = "auto",
    dataFullWidthResponsive = true,
    style = { display: "block" },
}) => {
    const adRef = useRef(null);
    const isAdPushed = useRef(false);

    useEffect(() => {
        // Only push the ad once per component mount
        if (!isAdPushed.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isAdPushed.current = true;
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={style}
            data-ad-client="ca-pub-9715954404789504"
            data-ad-slot={dataAdSlot}
            data-ad-format={dataAdFormat}
            data-full-width-responsive={dataFullWidthResponsive}
            ref={adRef}
        />
    );
};

export default AdBanner;
