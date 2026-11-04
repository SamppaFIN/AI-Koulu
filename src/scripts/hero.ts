// Astrolabi-hero: SVG-piirroksen päälle WebGL-valokeila ja tähtikenttä. Ilman WebGL:ää näkyy pelkkä SVG.
import { reduced } from "./util";

const FRAG = `precision mediump float;
uniform vec2 res; uniform float t; uniform float aim;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / res; vec2 p = uv * 2.0 - 1.0;
  float r = length(p), a = atan(p.y, p.x);
  float beam = pow(max(0.0, cos(a - aim)), 24.0) * smoothstep(1.0, 0.15, r) * 0.55;
  vec2 cell = floor(uv * 240.0); float h = hash(cell);
  float star = step(0.9985, h) * (0.6 + 0.4 * sin(t * 1.3 + 7.0 * hash(cell + 3.1)));
  float ring = smoothstep(0.012, 0.0, abs(r - 0.72)) * 0.15;
  vec3 gold = vec3(0.93, 0.78, 0.45);
  float alpha = clamp(beam + ring + star * 0.8, 0.0, 1.0) * smoothstep(1.02, 0.9, r);
  gl_FragColor = vec4(gold * alpha, alpha);
}`;

export function start(state: Record<string, unknown>) {
  const art = document.querySelector<HTMLElement>(".hero-art")!;
  const hero = art.closest<HTMLElement>(".hero")!;
  const alidade = art.querySelector<SVGGElement>(".alidade");
  const st = { webgl: false, running: false, frames: 0 };
  state.hero = st;

  // Alidadi kääntyy osoittimen kulmaan. Viivan oma suunta on −45°.
  let aim = -Math.PI / 4, aimGoal = aim;
  hero.addEventListener("pointermove", (e) => {
    const b = art.getBoundingClientRect();
    const ang = Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2));
    if (alidade) alidade.style.rotate = `${((ang * 180) / Math.PI + 45).toFixed(1)}deg`;
    aimGoal = -ang; // WebGL:n y-akseli osoittaa ylös
  });

  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }"), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const pr = gl.createProgram()!; gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(pr, "res"), uT = gl.getUniformLocation(pr, "t"), uAim = gl.getUniformLocation(pr, "aim");
  art.appendChild(cv);
  st.webgl = true;

  const resize = () => { const d = Math.min(devicePixelRatio || 1, 1.5), w = art.clientWidth; cv.width = Math.round(w * d); cv.height = Math.round(w * d); gl.viewport(0, 0, cv.width, cv.height); };
  const draw = (now: number) => {
    // Valokeila kiertää hitaasti ja kääntyy kohti osoitinta
    aim += (aimGoal + 0.05 * Math.sin(now / 9000) - aim) * 0.02;
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uT, now / 1000); gl.uniform1f(uAim, aim);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    st.frames++;
  };
  let raf = 0;
  const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
  resize(); addEventListener("resize", resize);
  if (reduced()) { draw(0); return; }
  new IntersectionObserver(([e]) => {
    st.running = e.isIntersecting;
    if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
    if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
  }).observe(hero);
}
