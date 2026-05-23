export default function DynamicIsland({ show, image, waveColor = "#1db954" }) {
  if (!show) return null;

  return (
    <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[192px] h-[36px] bg-black rounded-[32px] z-50 flex items-center shadow-lg pointer-events-none">
      
      <div className="absolute left-[10px] top-[6px] w-[24px] h-[24px] rounded-[6px] overflow-hidden bg-neutral-800">
        <img src={image} alt="Album Art" className="w-full h-full object-cover" />
      </div>
      
      <div className="absolute left-[160px] top-[6px] w-[24px] h-[24px] flex items-center justify-between">
        <div className="w-[2.5px] h-[6px] rounded-[50px] animate-pulse" style={{ backgroundColor: waveColor, animationDelay: '0ms' }} />
        <div className="w-[2.5px] h-[16px] rounded-[50px] animate-pulse" style={{ backgroundColor: waveColor, animationDelay: '150ms' }} />
        <div className="w-[2.5px] h-[24px] rounded-[50px] animate-pulse" style={{ backgroundColor: waveColor, animationDelay: '300ms' }} />
        <div className="w-[2.5px] h-[12px] rounded-[50px] animate-pulse" style={{ backgroundColor: waveColor, animationDelay: '450ms' }} />
        <div className="w-[2.5px] h-[20px] rounded-[50px] animate-pulse" style={{ backgroundColor: waveColor, animationDelay: '600ms' }} />
        <div className="w-[2.5px] h-[8px] rounded-[50px] animate-pulse" style={{ backgroundColor: waveColor, animationDelay: '750ms' }} />
      </div>

    </div>
  );
}