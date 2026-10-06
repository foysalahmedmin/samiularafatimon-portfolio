/**
 * Runs before first paint (Next guide: preventing flash before hydration).
 *  - `js` on <html> means "reveals may hide below-the-fold content" (never set for reduced motion)
 *  - `reduced` mirrors prefers-reduced-motion
 *  - `boot-skip` skips the opening sequence on return visits, for reduced motion, and with ?boot=0
 */
const script = `(function(){var d=document.documentElement;try{
var r=matchMedia('(prefers-reduced-motion: reduce)').matches;
d.classList.add(r?'reduced':'js');
var seen=false;try{seen=sessionStorage.getItem('imon-boot')==='1'}catch(e){}
if(r||seen||/[?&]boot=0/.test(location.search))d.classList.add('boot-skip');
}catch(e){}})();`;

export function MotionHead() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
