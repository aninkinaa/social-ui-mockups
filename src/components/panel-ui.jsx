export function Section({ title, icon, children }) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        <span className="text-zinc-600">{icon}</span>
        {title}
      </label>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, valueLabel, disabled = false }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
        <span>{label}</span>
        <span className="font-bold text-zinc-200 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/50 shadow-sm">
          {valueLabel ?? value}
        </span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} 
        value={value} onChange={onChange} disabled={disabled} 
        className="w-full accent-brand-hover touch-none disabled:opacity-50 cursor-pointer" 
      />
    </div>
  );
}

export function Toggle({ label, subLabel, checked, onChange }) {
  return (
    <div className="flex items-center justify-between cursor-pointer group" onClick={onChange}>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">{label}</span>
        {subLabel && <span className="text-xs text-zinc-500 mt-0.5">{subLabel}</span>}
      </div>
      <div className={`w-11 h-6 rounded-full transition-all duration-300 relative flex items-center shrink-0 border shadow-inner ${checked ? 'bg-brand-hover border-brand-hover' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform duration-300 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`}></div>
      </div>
    </div>
  );
}

export function Input({ value, onChange, placeholder }) {
  return (
    <input 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      className="bg-zinc-900/40 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-brand-hover focus:ring-1 focus:ring-brand-hover w-full transition-all placeholder-zinc-600 shadow-inner hover:border-zinc-700" 
    />
  );
}