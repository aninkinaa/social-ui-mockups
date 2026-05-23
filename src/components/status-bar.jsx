export default function StatusBar({
  timeText = "9:41",
  theme = "light",
  showDynamicIsland = false,
  image = "",
  waveColor = "",
  batteryLevel = 29
}) {
  const isDark = theme === "dark";
  const fillColor = isDark ? "#FFFFFF" : "#000000";

  const safeBatteryLevel = Math.max(0, Math.min(100, batteryLevel));
  const batteryFillWidth = 21 * (safeBatteryLevel / 100);

  if (showDynamicIsland) {
    return (
      <div className="w-full h-[60px] relative z-50 pointer-events-none shrink-0 bg-transparent overflow-visible">

        {/* Time - Left */}
        <div className="absolute w-[54px] h-[20px] left-[29px] top-[20px]">
          <span
            className="absolute w-full h-full text-center font-sf font-semibold text-[17px] leading-[22px] tracking-[-0.408px]"
            style={{ fontFeatureSettings: "'case' on", color: fillColor }}
          >
            {timeText}
          </span>
        </div>

        {/* Dynamic Island - Music Playing */}
        <div
          className="absolute w-[192px] h-[36px] left-[calc(50%-192px/2)] top-[12px] bg-black rounded-[32px] overflow-hidden"
          style={{ boxShadow: "0px 8px 17px rgba(0, 0, 0, 0.15)" }}
        >

          {/* Song Thumbnail / Album Art */}
          <div className="absolute w-[24px] h-[24px] left-[10px] top-[6px] rounded-[6px] overflow-hidden bg-neutral-800">
            {image ? (
              <img crossOrigin="anonymous" src={image} alt="Album Art" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
          </div>

          {/* Music Wave */}
          <div className="absolute w-[24px] h-[24px] left-[160px] top-[6px] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="9" width="2.5" height="6" rx="1.25" fill={waveColor} opacity="0.4" />
              <rect x="5" y="4" width="2.5" height="16" rx="1.25" fill={waveColor} opacity="0.7" />
              <rect x="9" y="0" width="2.5" height="24" rx="1.25" fill={waveColor} opacity="1.0" />
              <rect x="13" y="6" width="2.5" height="12" rx="1.25" fill={waveColor} opacity="0.5" />
              <rect x="17" y="2" width="2.5" height="20" rx="1.25" fill={waveColor} opacity="0.8" />
              <rect x="21" y="8" width="2.5" height="8" rx="1.25" fill={waveColor} opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Right Side (Signal, Signal Text, Battery) */}
        <div className="absolute h-[13px] right-[29px] top-[23px] flex flex-row items-center justify-end gap-[6px]">

          {/* Mobile Signal */}
          {/* <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
            <path d="M10 3C10 2.44772 10.4477 2 11 2H12C12.5523 2 13 2.44772 13 3V11C13 11.5523 12.5523 12 12 12H11C10.4477 12 10 11.5523 10 11V3Z" fill={fillColor} />
            <path d="M15 1C15 0.447715 15.4477 0 16 0L17 0C17.5523 0 18 0.447715 18 1V11C18 11.5523 17.5523 12 17 12H16C15.4477 12 15 11.5523 15 11V1Z" fill={fillColor} />
            <path d="M5 6.5C5 5.94772 5.44772 5.5 6 5.5H7C7.55228 5.5 8 5.94772 8 6.5V11C8 11.5523 7.55228 12 7 12H6C5.44772 12 5 11.5523 5 11V6.5Z" fill={fillColor} />
            <path d="M0 9C0 8.44772 0.447715 8 1 8H2C2.55228 8 3 8.44772 3 9V11C3 11.5523 2.55228 12 2 12H1C0.447715 12 0 11.5523 0 11L0 9Z" fill={fillColor} />
          </svg> */}

          {/* Network Text (5G, 4G, dll) */}
          {/* <span
            className="font-sf font-semibold text-[13px] tracking-tight leading-none mb-[1px]"
            style={{ color: fillColor }}
          >
            {signalText}
          </span> */}

          <svg width="17" height="12" viewBox="0 0 17 12" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.50047 2.58753C10.967 2.58764 13.3393 3.55505 15.1269 5.28982C15.2615 5.42375 15.4766 5.42206 15.6092 5.28603L16.896 3.96045C16.9631 3.89146 17.0006 3.798 17 3.70076C16.9994 3.60353 16.9609 3.51052 16.893 3.44234C12.2011 -1.14745 4.79908 -1.14745 0.107163 3.44234C0.0391973 3.51047 0.000634479 3.60345 7.75932e-06 3.70069C-0.00061896 3.79792 0.0367421 3.89141 0.103824 3.96045L1.39096 5.28603C1.52346 5.42226 1.73878 5.42396 1.87331 5.28982C3.66116 3.55494 6.03367 2.58752 8.50047 2.58753ZM8.53591 6.58938C9.89112 6.58929 11.198 7.10346 12.2025 8.03199C12.3384 8.16376 12.5524 8.16091 12.6849 8.02555L13.9702 6.69997C14.0379 6.63044 14.0754 6.53611 14.0744 6.4381C14.0735 6.34008 14.034 6.24656 13.965 6.17844C10.9059 3.27385 6.16853 3.27385 3.10945 6.17844C3.04035 6.24656 3.00092 6.34013 3.00002 6.43817C2.99911 6.53622 3.0368 6.63054 3.10462 6.69997L4.38954 8.02555C4.52199 8.16091 4.73602 8.16376 4.87189 8.03199C5.87578 7.10408 7.18159 6.58995 8.53591 6.58938ZM11.1496 9.17672C11.1515 9.27501 11.1137 9.36977 11.0449 9.43863L8.82165 11.7289C8.75648 11.7962 8.66762 11.834 8.57491 11.834C8.4822 11.834 8.39334 11.7962 8.32817 11.7289L6.10452 9.43863C6.03583 9.36972 5.99804 9.27492 6.00008 9.17663C6.00212 9.07834 6.0438 8.98527 6.11528 8.91938C7.53515 7.69354 9.61467 7.69354 11.0345 8.91938C11.106 8.98532 11.1476 9.07843 11.1496 9.17672Z" />
          </svg>

          {/* Battery */}
          <div className="w-[27.4px] h-[13px] relative flex-none">
            {/* Outline */}
            <div
              className="absolute h-[13px] left-0 right-[2.4px] mix-blend-normal opacity-35 border-[1px] rounded-[4px] box-border"
              style={{ top: "calc(50% - 13px/2)", borderColor: fillColor }}
            />
            {/* Battery End */}
            <div
              className="absolute w-[1.4px] h-[4.22px] right-0 mix-blend-normal opacity-40"
              style={{ top: "calc(50% - 4.22px/2 + 0.61px)", backgroundColor: fillColor }}
            />
            <div
              className="absolute h-[9px] left-[2px] rounded-[2px] transition-all duration-300 ease-out"
              style={{
                top: "calc(50% - 9px/2)",
                backgroundColor: fillColor,
                width: `${batteryFillWidth}px`
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- Default (Non-Active) Mode ---
  return (
    <div className="w-full h-[60px] relative z-50 pointer-events-none shrink-0 bg-transparent overflow-visible">

      {/* Time - Left */}
      <div className="absolute w-[54px] h-[20px] left-[40px] top-[20px]">
        <span
          className="absolute w-full h-full text-center font-sf font-semibold text-[17px] leading-[22px] tracking-[-0.408px]"
          style={{ fontFeatureSettings: "'case' on", color: fillColor }}
        >
          {timeText}
        </span>
      </div>

      {/* Dynamic Island - Normal */}
      {/* <div className="absolute w-[125px] h-[37px] left-[calc(50%-125px/2)] top-[12px] bg-black rounded-[100px] shadow-lg"> */}
      {/* TrueDepth camera */}
      {/* <div className="absolute w-[80px] h-[37px] left-0 top-0 bg-black rounded-[100px]" /> */}
      {/* FaceTime camera */}
      {/* <div className="absolute w-[37px] h-[37px] right-0 top-0 bg-black rounded-[100px]" /> */}
      {/* </div> */}

      {/* Right Side */}
      <div className="absolute h-[13px] right-[40px] top-[23px] flex flex-row items-center justify-end gap-[6px]">

        {/* Mobile Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
          <path d="M10 3C10 2.44772 10.4477 2 11 2H12C12.5523 2 13 2.44772 13 3V11C13 11.5523 12.5523 12 12 12H11C10.4477 12 10 11.5523 10 11V3Z" fill={fillColor} />
          <path d="M15 1C15 0.447715 15.4477 0 16 0L17 0C17.5523 0 18 0.447715 18 1V11C18 11.5523 17.5523 12 17 12H16C15.4477 12 15 11.5523 15 11V1Z" fill={fillColor} />
          <path d="M5 6.5C5 5.94772 5.44772 5.5 6 5.5H7C7.55228 5.5 8 5.94772 8 6.5V11C8 11.5523 7.55228 12 7 12H6C5.44772 12 5 11.5523 5 11V6.5Z" fill={fillColor} />
          <path d="M0 9C0 8.44772 0.447715 8 1 8H2C2.55228 8 3 8.44772 3 9V11C3 11.5523 2.55228 12 2 12H1C0.447715 12 0 11.5523 0 11L0 9Z" fill={fillColor} />
        </svg>

        {/* Network Text (5G, 4G, dll) */}
        {/* <span 
          className="font-sf font-[500] text-[13px] tracking-tight leading-none"
          style={{ color: fillColor }}
        >
          {signalText}
        </span> */}

        <svg width="17" height="12" viewBox="0 0 17 12" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.50047 2.58753C10.967 2.58764 13.3393 3.55505 15.1269 5.28982C15.2615 5.42375 15.4766 5.42206 15.6092 5.28603L16.896 3.96045C16.9631 3.89146 17.0006 3.798 17 3.70076C16.9994 3.60353 16.9609 3.51052 16.893 3.44234C12.2011 -1.14745 4.79908 -1.14745 0.107163 3.44234C0.0391973 3.51047 0.000634479 3.60345 7.75932e-06 3.70069C-0.00061896 3.79792 0.0367421 3.89141 0.103824 3.96045L1.39096 5.28603C1.52346 5.42226 1.73878 5.42396 1.87331 5.28982C3.66116 3.55494 6.03367 2.58752 8.50047 2.58753ZM8.53591 6.58938C9.89112 6.58929 11.198 7.10346 12.2025 8.03199C12.3384 8.16376 12.5524 8.16091 12.6849 8.02555L13.9702 6.69997C14.0379 6.63044 14.0754 6.53611 14.0744 6.4381C14.0735 6.34008 14.034 6.24656 13.965 6.17844C10.9059 3.27385 6.16853 3.27385 3.10945 6.17844C3.04035 6.24656 3.00092 6.34013 3.00002 6.43817C2.99911 6.53622 3.0368 6.63054 3.10462 6.69997L4.38954 8.02555C4.52199 8.16091 4.73602 8.16376 4.87189 8.03199C5.87578 7.10408 7.18159 6.58995 8.53591 6.58938ZM11.1496 9.17672C11.1515 9.27501 11.1137 9.36977 11.0449 9.43863L8.82165 11.7289C8.75648 11.7962 8.66762 11.834 8.57491 11.834C8.4822 11.834 8.39334 11.7962 8.32817 11.7289L6.10452 9.43863C6.03583 9.36972 5.99804 9.27492 6.00008 9.17663C6.00212 9.07834 6.0438 8.98527 6.11528 8.91938C7.53515 7.69354 9.61467 7.69354 11.0345 8.91938C11.106 8.98532 11.1476 9.07843 11.1496 9.17672Z" />
        </svg>


        {/* Battery */}
        <div className="w-[27.4px] h-[13px] relative flex-none">
          {/* Outline */}
          <div
            className="absolute h-[13px] left-0 right-[2.4px] mix-blend-normal opacity-35 border-[1px] rounded-[4px] box-border"
            style={{ top: "calc(50% - 13px/2)", borderColor: fillColor }}
          />

          {/* Battery End */}
          <div
            className="absolute w-[1.4px] h-[4.22px] right-0 mix-blend-normal opacity-40"
            style={{ top: "calc(50% - 4.22px/2 + 0.61px)", backgroundColor: fillColor }}
          />

          {/* Fill */}
          <div
            className="absolute h-[9px] left-[2px] rounded-[2px] transition-all duration-300 ease-out"
            style={{
              top: "calc(50% - 9px/2)",
              backgroundColor: fillColor,
              width: `${batteryFillWidth}px`
            }}
          />
        </div>

      </div>
    </div>
  );
}