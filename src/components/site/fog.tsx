/** Two slow-drifting fog layers. Place inside a `relative overflow-hidden` parent. */
export function Fog() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="fog-layer" />
      <div className="fog-layer-alt" />
    </div>
  );
}
