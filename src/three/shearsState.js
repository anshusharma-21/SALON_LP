// Shared, mutable state the GSAP scroll timelines write into and the 3D scene reads every frame.
// Two independent "channels" so the hero and closing choreographies never fight over one value.
//   x, y   : -1..1 across the viewport (0 = centre)
//   size   : model height as a fraction of viewport height
//   rx/ry/rz : radians
//   open   : 0 closed … 1 wide open
//   snip   : 0..1 amount of idle snipping
//   o      : opacity / presence 0..1
//   in / spin : entrance-only multipliers (presence = o × in, rotationY = ry + spin) so the
//               intro animation never fights the scroll timeline over the same value
const base = () => ({ x: 0, y: 0, size: 0.6, rx: 0, ry: 0, rz: 0, open: 0.2, snip: 0, o: 0, in: 1, spin: 0 });

export const shears = {
  a: base(), // hero + experience
  b: base(), // closing
  mouse: { x: 0, y: 0 },
};

if (import.meta.env.DEV) window.__shears = shears;
