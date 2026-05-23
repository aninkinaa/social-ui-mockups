export function Section({ title, icon, children }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
        {icon}
        {title}
      </label>
      <div className="bg-panel-muted p-4 rounded-2xl border border-panel-border flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, valueLabel, disabled = false }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs text-neutral-400">
        <span>{label}</span>
        <span className="font-bold text-white">{valueLabel ?? value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} 
        value={value} onChange={onChange} disabled={disabled} 
        className="w-full accent-brand-hover touch-none disabled:opacity-50" 
      />
    </div>
  );
}

export function Toggle({ label, subLabel, checked, onChange }) {
  return (
    <div className="flex items-center justify-between cursor-pointer" onClick={onChange}>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">{label}</span>
        {subLabel && <span className="text-xs text-neutral-500">{subLabel}</span>}
      </div>
      <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${checked ? 'bg-brand-hover' : 'bg-panel-border'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}></div>
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
      className="bg-panel-bg border border-panel-border text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-hover focus:ring-1 focus:ring-brand-hover w-full transition-all placeholder-neutral-600" 
    />
  );
}