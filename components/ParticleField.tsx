'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { CLUSTERS } from '@/lib/career'

/* ---------------------------------------------------------------------------
   A lattice bowl.

   The reference object is a paraboloid opened toward the camera with a hole at
   its centre, rippled into lobes around the rim. The critical detail is that
   its points sit on a REGULAR POLAR LATTICE — concentric rings crossed by
   radial spokes. Those contour lines and the moiré between them are what makes
   it read as a surface rather than a haze; random scatter cannot produce them.

   Colour sweeps by azimuth between the three skill colours, so the object is a
   single continuous form that still names its regions on hover.
   ------------------------------------------------------------------------- */

const TAU = Math.PI * 2

/** Camera distance, also the reference depth for sizing points. */
const CAM_Z = 9.6

type Theme = 'dark' | 'light'

/** Per-theme render setup. Light mode cannot use additive blending at all. */
const THEMES = {
  dark: {
    clear: '#08090b',
    blending: THREE.AdditiveBlending,
    // Backdrop: near-black with the teal/blue corner glow.
    base: [0.0024, 0.0028, 0.0034],
    glowA: [0.0045, 0.113, 0.123],
    glowB: [0.0064, 0.0424, 0.148],
    glowAStrength: 0.34,
    glowBStrength: 0.24,
    dim: 1,
  },
  light: {
    clear: '#f7f7f5',
    // Normal blending, so dark points paint over paper like ink.
    blending: THREE.NormalBlending,
    base: [0.9046, 0.9046, 0.8879],
    glowA: [0.2158, 0.647, 0.6172],
    glowB: [0.3467, 0.4793, 0.8069],
    glowAStrength: 0.1,
    glowBStrength: 0.08,
    dim: 0.95,
  },
} as const satisfies Record<Theme, unknown>

/* Scaled up now that the object is a full-bleed backdrop for the hero rather
   than the single subject on the right. */
/* Deliberately wider than the frustum at CAM_Z (half-height ≈ 4.08), so the rim
   runs off the top and bottom edges. A background object that fits entirely
   inside the viewport reads as a cropped shape; one that overflows reads as a
   field the page is sitting on. */
/** Inner radius — the dark hole at the centre is about a third of the rim. */
const R_INNER = 1.15
const R_OUTER = 3.6
/** How steeply the dish deepens toward the rim. */
/**
 * Rim depth as a fraction of R_OUTER, and the quadratic coefficient derived
 * from it.
 *
 * The coefficient CANNOT be a fixed constant. `y = k·r²` grows quadratically
 * with the radius, so a k tuned at R_OUTER ≈ 2 puts the rim 18 units deep at
 * R_OUTER = 5.4 — the dish becomes a cone, and the extreme foreshortening
 * crushes ring spacing at the rim while stretching it near the hole. That
 * uneven screen-space density is exactly what reads as bad dot quality.
 * Deriving k from R_OUTER keeps the profile identical at any size.
 */
const DEPTH_RATIO = 0.45
const BOWL = DEPTH_RATIO / R_OUTER

/**
 * Ripple amplitudes, also as fractions of R_OUTER.
 *
 * Absolute amplitudes shrink into invisibility as the object grows — the lobed
 * rim silhouette flattens into a plain circle.
 */
const AMP_RADIAL = 0.0692 * R_OUTER
const AMP_ANGULAR = 0.0436 * R_OUTER
const AMP_LOBE = 0.0872 * R_OUTER
/** Number of lobes around the rim. */
const LOBES = 7

/** Region anchors, evenly spaced around the ring starting at the top. */
const REGION_ANGLES = CLUSTERS.map((_, i) => Math.PI / 2 + (i * TAU) / 3)

function bowlHeight(r: number): number {
  return BOWL * r * r
}

function regionCenter(i: number): [number, number, number] {
  const a = REGION_ANGLES[i]
  const r = (R_INNER + R_OUTER) / 2
  return [Math.cos(a) * r, bowlHeight(r), Math.sin(a) * r]
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* The ripple lives in the vertex shader so 50k points can undulate without the
   CPU ever touching a buffer.

   Phase is accumulated on the CPU and passed in rather than derived from raw
   elapsed time, because the wave speed responds to scroll — multiplying a
   running clock would make the surface jump every time the rate changed. */
const SURFACE_GLSL = /* glsl */ `
  float ripple(
    float r, float theta,
    float phase, float slow, float push, float amp
  ) {
    return amp * (
        ${AMP_RADIAL.toFixed(4)} * sin(${(4.6 * 1.95 / R_OUTER).toFixed(4)} * r - phase + push * 2.2)
      + ${AMP_ANGULAR.toFixed(4)} * sin(4.0 * theta + slow)
      + ${AMP_LOBE.toFixed(4)} * cos(float(${LOBES}) * theta) * (r / float(${R_OUTER}))
    );
  }
`

const VERT = /* glsl */ `
  attribute float aR;
  attribute float aTheta;
  attribute float aSeed;
  attribute float aRegion;
  attribute vec3 aColor;

  uniform float uSize;
  uniform float uDpr;
  uniform float uActive;   // active region index, or -1.0 for none

  // "It reads your presence — pointer, scroll, dwell."
  uniform float uPhase;    // radial wave phase, CPU-accumulated
  uniform float uSlow;     // angular wave phase, CPU-accumulated
  uniform float uSwirl;    // vortex rotation, CPU-accumulated
  uniform float uPush;     // pointer
  uniform float uEnergy;   // scroll velocity
  uniform float uCalm;     // dwell — the surface settles when left alone
  uniform float uDim;      // holds the object back behind the hero content
  uniform float uInk;      // 0 = glowing on black, 1 = ink on paper

  varying vec3 vColor;
  varying float vAlpha;

  ${SURFACE_GLSL}

  void main() {
    /* Dwell deliberately does NOT scale amplitude. Amplitude drives the crest
       term, which drives both alpha and colour, so damping it here made the
       whole object fade out after two idle seconds — the surface should settle,
       not disappear. Calm slows the phase rate on the CPU instead.
       (No backticks in here: this comment lives inside a JS template literal.) */
    float amp = 1.0 + uEnergy * 1.15;
    float wave = ripple(aR, aTheta, uPhase, uSlow, uPush, amp);
    float y = ${BOWL.toFixed(5)} * aR * aR + wave;

    /* Vortex: inner rings turn faster than outer ones, so the surface shears
       instead of rotating rigidly. Because the motion stays inside the
       geometry, nothing sweeps out of frame the way spinning the whole group
       did.

       Reduced motion is not handled here. It is handled by the Canvas
       frameloop prop, which drops to demand and renders a single still frame —
       the rippled, sheared surface is a good resting state, so flattening it
       with a uniform would only make the static view duller.
       (No backticks in this comment: it sits inside a JS template literal.) */
    float theta = aTheta + uSwirl / (aR + 0.5);

    vec3 p = vec3(cos(theta) * aR, y, sin(theta) * aR);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    bool isActive = abs(uActive - aRegion) < 0.5;
    bool anyActive = uActive > -0.5;
    float boost = (anyActive && isActive) ? 1.4 : 1.0;

    /* Below one device pixel a point stops shrinking and starts flickering, so
       clamp the size and pay for the difference in alpha instead. This is what
       fixed-function multisampling does in hardware, and skipping it is what
       turns a dense lattice into grit. */
    /* uSize is CSS pixels at the rest distance, scaled by depth from there —
       dividing by raw eye depth instead makes the constant meaningless and
       silently yields sub-pixel sprites. The 0.18 floor stops a point that
       drifts near the camera from blowing up across the screen. */
    float depth = max(-mv.z, 0.18);
    float want = uSize * boost * uDpr * (${CAM_Z.toFixed(2)} / depth) * mix(0.8, 1.25, aSeed);
    float given = max(want, 1.0);
    float shrinkFade = min(want / given, 1.0);

    gl_PointSize = given;
    gl_Position = projectionMatrix * mv;

    /* Crests catch the light, troughs fall to nearly nothing. The contrast is
       the whole point: a uniform alpha across every point reads as haze, while
       bright ridges over dark valleys read as contour bands. */
    // The window has to straddle the wave's actual range, which sits near zero
    // — biased above it, almost every point falls into the trough and the
    // surface disappears.
    float crest = pow(smoothstep(-0.26, 0.20, wave), 1.25);

    /* Crest peaks blow out toward white, which is where the reference gets its
       specular streak along the ridges. Troughs keep the region's own hue. */
    /* Kept just under clipping. Mint's green channel already sits near 1.0, so
       scaling colour up past that pins every channel at maximum and the hue
       washes out to white — brightness has to come from coverage (alpha)
       instead, with only the crests allowed to blow out into a specular. */
    vec3 lit = aColor * (1.05 + 0.5 * crest);
    vColor = mix(lit, vec3(1.0), pow(crest, 4.0) * 0.3) * (1.0 + 0.25 * uEnergy);

    /* Depth falloff, standing in for fog: the far wall of the bowl recedes
       while the near rim stays bright. Without it every ring reads at the same
       distance and the object flattens into a disc.

       On paper it fades far less. Additive dots on black disappear gracefully
       into the background, but ink dots on white fading to 28% just vanish —
       the far half of the object goes missing rather than receding. */
    float far = smoothstep(${(CAM_Z * 0.55).toFixed(2)}, ${(CAM_Z * 1.75).toFixed(2)}, depth);
    /* Kept shallow. At 0.28 the far side lost nearly three quarters of its
       alpha, and since the object grew, "far" is now most of it. */
    float fog = mix(mix(1.0, 0.62, far), mix(1.0, 0.78, far), uInk);

    float focus = (!anyActive || isActive) ? 1.0 : 0.14;

    // Ink needs a much higher floor: normal blending at 0.3 alpha over near-
    // white is barely a tint, where the same value additively on black glows.
    float floorA = mix(0.78, 0.82, uInk);
    float rangeA = mix(0.22, 0.18, uInk);

    vAlpha = (floorA + rangeA * crest)
           * mix(0.85, 1.0, aSeed) * focus * shrinkFade * fog * uDim;
  }
`

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Normalised radius across the sprite, 0 at centre, 1 at the edge.
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;

    /* A tight bright core plus a wide soft halo. Under additive blending the
       halos of neighbouring crests overlap and glow, which is the look a bloom
       pass would give — without a second render target or a postprocessing
       dependency on top of three. An analytic falloff also stays sharper than
       a sampled PNG sprite. */
    /* A hard-edged core with only a whisper of halo. A wide halo summed across
       tens of thousands of overlapping sprites reads as haze over the whole
       object rather than glow around each dot — that is what looks "blurred". */
    float core = smoothstep(0.75, 0.30, d);
    float halo = pow(1.0 - d, 4.0) * 0.10;

    gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
  }
`

/** Sparse out-of-focus motes drifting in front of and behind the bowl. */
const BOKEH_VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uDpr;
  varying float vAlpha;

  void main() {
    float t = uTime * 0.06 + aSeed * 6.2831853;
    vec3 p = position + vec3(sin(t) * 0.25, cos(t * 0.8) * 0.3, 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (7.0 + aSeed * 16.0) * uDpr * (1.0 / max(-mv.z, 0.001));
    gl_Position = projectionMatrix * mv;
    vAlpha = 0.10 + aSeed * 0.22;
  }
`

const BOKEH_FRAG = /* glsl */ `
  uniform vec3 uTint;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // Wide, very soft falloff so they read as defocused rather than small.
    float a = pow(1.0 - d * 2.0, 2.2);
    gl_FragColor = vec4(uTint, a * vAlpha);
  }
`

/* The canvas is opaque, so it would otherwise cover the page's CSS bloom and
   leave a seam where the hero ends. This redraws the same two corner gradients
   inside the scene. Values are linear-light because tone mapping is off and the
   renderer converts to sRGB on output. */
const BACKDROP_VERT = /* glsl */ `
  void main() {
    // Fullscreen regardless of the camera — no view or projection applied.
    gl_Position = vec4(position.xy * 2.0, 0.9999, 1.0);
  }
`

const BACKDROP_FRAG = /* glsl */ `
  uniform vec2 uRes;
  uniform vec3 uBase;
  uniform vec3 uGlowA;
  uniform vec3 uGlowB;
  uniform vec2 uStrength;

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;

    float a = 1.0 - smoothstep(0.30, 1.0,
      length((uv - vec2(0.08, 0.04)) / vec2(0.62, 0.70)));
    float b = 1.0 - smoothstep(0.24, 1.0,
      length((uv - vec2(0.88, 0.96)) / vec2(0.50, 0.62)));

    gl_FragColor = vec4(
      uBase + uGlowA * a * uStrength.x + uGlowB * b * uStrength.y,
      1.0
    );
  }
`

function Backdrop({ theme }: { theme: Theme }) {
  const { size } = useThree()
  const t = THEMES[theme]

  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uBase: { value: new THREE.Vector3() },
      uGlowA: { value: new THREE.Vector3() },
      uGlowB: { value: new THREE.Vector3() },
      uStrength: { value: new THREE.Vector2() },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uBase.value.fromArray(t.base as unknown as number[])
    uniforms.uGlowA.value.fromArray(t.glowA as unknown as number[])
    uniforms.uGlowB.value.fromArray(t.glowB as unknown as number[])
    uniforms.uStrength.value.set(t.glowAStrength, t.glowBStrength)
  }, [t, uniforms])

  useEffect(() => {
    uniforms.uRes.value.set(size.width, size.height)
  }, [size.width, size.height, uniforms])

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={BACKDROP_VERT}
        fragmentShader={BACKDROP_FRAG}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

type Res = { rings: number; density: number; motes: number }

function Bowl({
  res,
  active,
  theme,
}: {
  res: Res
  active: number
  theme: Theme
}) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const attrs = useMemo(() => {
    const { rings, density } = res
    const rand = mulberry32(0x5eed)

    /* Points per ring scales with radius, so the arc length between
       neighbours is constant across the whole surface.
       A fixed spoke count instead crams points together near the hole and
       stretches them apart at the rim, and that density gradient beats against
       the pixel grid into moiré swirls. Uniform spacing is what makes the
       reference read as woven concentric rings. */
    const radii: number[] = []
    const perRing: number[] = []
    let count = 0
    for (let ri = 0; ri < rings; ri++) {
      const r = R_INNER + (R_OUTER - R_INNER) * (ri / (rings - 1))
      const n = Math.max(16, Math.round(density * r))
      radii.push(r)
      perRing.push(n)
      count += n
    }

    const positions = new Float32Array(count * 3)
    const rs = new Float32Array(count)
    const thetas = new Float32Array(count)
    const seeds = new Float32Array(count)
    const regions = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    const palette = CLUSTERS.map(
      (c) => new THREE.Color(theme === 'light' ? c.colorLight : c.color),
    )
    const tint = new THREE.Color()

    /* A perfectly regular lattice resonates with the pixel grid and produces
       moiré swirls. Nudging each point inside its own cell — stratified jitter,
       roughly a third of the spacing — breaks that resonance while keeping the
       rings legible as rings. More than about a third and the contour banding
       dissolves into noise. */
    const JITTER = 0.08
    const ringSpacing = (R_OUTER - R_INNER) / (rings - 1)

    let i = 0
    for (let ri = 0; ri < rings; ri++) {
      const n = perRing[ri]
      const cell = TAU / n

      for (let si = 0; si < n; si++, i++) {
        // Half-step offset on alternate rings so neighbouring rings interleave
        // rather than lining up into hard radial spokes.
        const theta =
          ((si + (ri % 2) * 0.5) / n) * TAU + (rand() - 0.5) * cell * JITTER
        const r = radii[ri] + (rand() - 0.5) * ringSpacing * JITTER

        rs[i] = r
        thetas[i] = theta
        seeds[i] = rand()

        // Position is recomputed in the shader; this only needs to be a
        // plausible bounding value for culling, which is disabled anyway.
        positions[i * 3] = Math.cos(theta) * r
        positions[i * 3 + 1] = bowlHeight(r)
        positions[i * 3 + 2] = Math.sin(theta) * r

        // Colour sweeps around the azimuth between the three skill colours,
        // matching the reference's mint → blue → violet gradient.
        const turn = (((theta - REGION_ANGLES[0]) % TAU) + TAU) % TAU
        const seg = (turn / TAU) * 3
        const a = Math.floor(seg) % 3
        const b = (a + 1) % 3
        tint.copy(palette[a]).lerp(palette[b], seg - Math.floor(seg))

        colors[i * 3] = tint.r
        colors[i * 3 + 1] = tint.g
        colors[i * 3 + 2] = tint.b

        regions[i] = Math.round(seg) % 3
      }
    }

    return { positions, rs, thetas, seeds, regions, colors, count }
  }, [res, theme])

  const uniforms = useMemo(
    () => ({
      uSize: { value: 2.4 },
      uDpr: { value: 1 },
      uActive: { value: -1 },
      uPhase: { value: 0 },
      uSlow: { value: 0 },
      uSwirl: { value: 0 },
      uPush: { value: 0 },
      uEnergy: { value: 0 },
      uCalm: { value: 0 },
      uDim: { value: 1 },
      uInk: { value: 0 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uDim.value = THEMES[theme].dim
    uniforms.uInk.value = theme === 'light' ? 1 : 0
  }, [theme, uniforms])

  /** Scroll velocity, sampled by a passive listener and read per frame. */
  const scroll = useRef({ y: 0, last: 0, vel: 0 })

  useEffect(() => {
    scroll.current.y = window.scrollY
    scroll.current.last = window.scrollY
    const onScroll = () => {
      scroll.current.y = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Pointer idle tracking, for the dwell response. */
  const dwell = useRef({ x: 0, y: 0, lastMove: 0 })

  useEffect(() => {
    /* CSS pixels at the rest distance. Sprites are deliberately wider than the
       dot they draw: the fragment shader spends the outer half on the halo, so
       the visible core stays tight while the glow has room to bleed. */
    // Ink dots need a touch more area than glowing ones to read at the same
    // strength, since they cannot bloom into their neighbours.
    const inkBoost = theme === 'light' ? 1.18 : 1
    uniforms.uSize.value =
      Math.max(2.2, Math.min(3.6, size.height / 300)) * inkBoost
    uniforms.uDpr.value = Math.min(window.devicePixelRatio ?? 1, 2)
  }, [size.height, theme, uniforms])

  useEffect(() => {
    uniforms.uActive.value = active
  }, [active, uniforms])

  useFrame((state, delta) => {
    if (!mat.current) return
    const u = mat.current.uniforms
    // Guard against the long delta of a backgrounded tab.
    const dt = Math.min(delta, 1 / 20)

    /* Scroll — fast scrolling churns the surface, then it settles. Energy
       attacks quickly and releases slowly, which reads as momentum. */
    const s = scroll.current
    const px = s.y - s.last
    s.last = s.y
    s.vel = Math.abs(px) / Math.max(dt, 0.001)
    const energyTarget = Math.min(s.vel / 2600, 1)
    const rate = energyTarget > u.uEnergy.value ? 0.22 : 0.02
    u.uEnergy.value += (energyTarget - u.uEnergy.value) * (1 - Math.pow(1 - rate, dt * 60))

    /* Pointer — feeds the wave phase, damped so it trails the cursor. */
    const pushTarget = state.pointer.x * 0.9 + state.pointer.y * 0.4
    u.uPush.value += (pushTarget - u.uPush.value) * (1 - Math.pow(0.0025, dt))

    /* Dwell — after two idle seconds the ripple eases off, so a still cursor
       gets a calmer object. Any movement resets it. */
    const d = dwell.current
    if (
      Math.abs(state.pointer.x - d.x) > 0.004 ||
      Math.abs(state.pointer.y - d.y) > 0.004
    ) {
      d.x = state.pointer.x
      d.y = state.pointer.y
      d.lastMove = state.clock.elapsedTime
    }
    const idle = state.clock.elapsedTime - d.lastMove
    const calmTarget = Math.max(0, Math.min((idle - 2) / 4, 1))
    u.uCalm.value += (calmTarget - u.uCalm.value) * (1 - Math.pow(0.4, dt))

    /* Phases accumulate, so a change of rate never snaps the surface. */
    // Calm slows the motion — brightness is untouched.
    const ease = 1 - 0.55 * u.uCalm.value
    u.uPhase.value += dt * (1.9 + u.uEnergy.value * 5) * ease
    u.uSlow.value += dt * (1.1 + u.uEnergy.value * 2) * ease
    u.uSwirl.value += dt * (0.16 + u.uEnergy.value * 0.9) * ease
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attrs.positions, 3]} />
        <bufferAttribute attach="attributes-aR" args={[attrs.rs, 1]} />
        <bufferAttribute attach="attributes-aTheta" args={[attrs.thetas, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[attrs.seeds, 1]} />
        <bufferAttribute attach="attributes-aRegion" args={[attrs.regions, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[attrs.colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        /* Additive point clouds want depth testing off entirely, not just depth
           writes: with it on, points sort against each other and the surface
           breaks into patches instead of reading as one continuous glow. */
        depthTest={false}
        blending={THEMES[theme].blending}
      />
    </points>
  )
}

function Motes({ count, theme }: { count: number; theme: Theme }) {
  const mat = useRef<THREE.ShaderMaterial>(null)

  const attrs = useMemo(() => {
    const rand = mulberry32(0xb0cef)
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 11
      positions[i * 3 + 1] = (rand() - 0.5) * 7
      positions[i * 3 + 2] = (rand() - 0.5) * 6
      seeds[i] = rand()
    }
    return { positions, seeds }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDpr: { value: 1 },
      uTint: { value: new THREE.Vector3(0.72, 0.86, 0.95) },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uDpr.value = Math.min(window.devicePixelRatio ?? 1, 1.5)
  }, [uniforms])

  useEffect(() => {
    // Pale motes vanish on paper; on light they become faint grey specks.
    if (theme === 'light') uniforms.uTint.value.set(0.28, 0.32, 0.38)
    else uniforms.uTint.value.set(0.72, 0.86, 0.95)
  }, [theme, uniforms])

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attrs.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[attrs.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={BOKEH_VERT}
        fragmentShader={BOKEH_FRAG}
        transparent
        depthWrite={false}
        /* Additive point clouds want depth testing off entirely, not just depth
           writes: with it on, points sort against each other and the surface
           breaks into patches instead of reading as one continuous glow. */
        depthTest={false}
        blending={THEMES[theme].blending}
      />
    </points>
  )
}

function Regions({ onActive }: { onActive: (i: number) => void }) {
  return (
    <>
      {CLUSTERS.map((cluster, i) => (
        <mesh
          key={cluster.id}
          position={regionCenter(i)}
          onPointerOver={(e) => {
            e.stopPropagation()
            onActive(i)
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            onActive(-1)
          }}
        >
          {/* Sized from the band width so the three regions stay adjacent as
              the object scales, instead of shrinking into three dead spots. */}
          <sphereGeometry args={[(R_OUTER - R_INNER) * 0.42, 12, 12]} />
          {/* Fully transparent, but still visible to the raycaster —
              visible={false} would be skipped entirely. */}
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  )
}

function Rig({
  res,
  parallax,
  offset,
  theme,
  onActiveChange,
}: {
  res: Res
  parallax: boolean
  offset: [number, number]
  theme: Theme
  onActiveChange: (i: number) => void
}) {
  const outer = useRef<THREE.Group>(null)
  const [active, setActive] = useState(-1)

  /**
   * The dish lies in the XZ plane with its axis along +Y, so `-π/2` is dead
   * face-on and `0` is edge-on. This sits near face-on, leaving the centre hole
   * a clear opening and the rim a rounded polygon.
   */
  const REST_X = -1.22
  const REST_Y = 0.12

  useFrame((state, delta) => {
    if (!parallax || !outer.current) return
    const damp = 1 - Math.pow(0.0015, delta)
    outer.current.rotation.x +=
      (REST_X + state.pointer.y * 0.1 - outer.current.rotation.x) * damp
    outer.current.rotation.y +=
      (REST_Y + state.pointer.x * 0.14 - outer.current.rotation.y) * damp
  })

  return (
    <group
      ref={outer}
      position={[offset[0], offset[1], 0]}
      rotation={[REST_X, REST_Y, 0]}
    >
      <Bowl res={res} active={active} theme={theme} />
      <Motes count={res.motes} theme={theme} />
      <Regions
        onActive={(i) => {
          setActive(i)
          onActiveChange(i)
        }}
      />
    </group>
  )
}

/** Cheap capability probe — an old browser or a blocked GPU gets the CSS bloom. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export default function ParticleField({
  theme = 'dark',
  onActiveChange,
}: {
  theme?: Theme
  /** Fires with the hovered region index, or -1 on leave. */
  onActiveChange?: (i: number) => void
}) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [small, setSmall] = useState(false)

  useEffect(() => {
    if (!hasWebGL()) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = window.matchMedia('(max-width: 860px)')
    const sync = () => {
      setReduced(motion.matches)
      setSmall(narrow.matches)
    }
    sync()
    motion.addEventListener('change', sync)
    narrow.addEventListener('change', sync)
    setReady(true)

    return () => {
      motion.removeEventListener('change', sync)
      narrow.removeEventListener('change', sync)
    }
  }, [])

  // Stop rendering entirely once the hero scrolls away — a GPU loop running
  // behind the rest of the page is pure battery drain.
  useEffect(() => {
    const el = host.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Sized from the reference: its object spans ~620px with a ~230px hole, so
     ~195px of radial span carries ~65 contour rings — about 3px between rings.
     Packing more rings than that into the same span merges them into speckle
     instead of contours, which is the single biggest reason a dense point cloud
     stops looking like a surface.
     `density` (points per unit radius) is then chosen so the arc spacing
     matches the ring spacing, giving a square lattice. Totals ≈ 10k and 28k. */
  /* Ring count scales with the radial span so the ~3–4px ring spacing survives
     the object getting bigger; `density` is then 2π/spacing to keep the lattice
     square. Growing the radius without these would stretch the rings apart. */
  const res: Res = small
    ? { rings: 48, density: 130, motes: 40 }
    : { rings: 80, density: 210, motes: 90 }

  return (
    <div className="hero-canvas" ref={host} aria-hidden="true">
      {ready && (
        <Canvas
          /* Remount on theme change. Blend mode lives on the material and the
             clear colour on the renderer, and swapping both in place is more
             fragile than rebuilding a context that only rebuilds on a click. */
          key={theme}
          // Reduced motion gets one still frame of the rippled bowl, which is
          // a perfectly good resting state, and no loop at all.
          frameloop={inView && !reduced ? 'always' : 'demand'}
          dpr={[1, 2]}
          camera={{ position: [0, 0, CAM_Z], fov: 46 }}
          /* `flat` disables tone mapping. R3F defaults to ACES Filmic, which
             compresses highlights and desaturates — the correct choice for lit
             PBR scenes and the wrong one for additive emissive points, where it
             quietly eats every brightness increase. */
          flat
          gl={{
            antialias: false,
            /* Opaque canvas. With a transparent one, additively blended points
               leave the alpha channel far below 1, and the browser's composite
               scales the accumulated colour down with it — every brightness
               increase gets eaten at the very last step. Clearing to the page
               colour keeps the blend maths intact. */
            alpha: false,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => gl.setClearColor(THEMES[theme].clear, 1)}
        >
          <Backdrop theme={theme} />
          {/* Centred on the code window so the glass sits inside the ring
              rather than clipping across it, and dropped far enough that the
              rim clears the floating nav instead of running behind it. */}
          <Rig
            res={res}
            parallax={!reduced && !small}
            offset={small ? [0, -0.5] : [2.55, -0.8]}
            theme={theme}
            onActiveChange={onActiveChange ?? (() => {})}
          />
        </Canvas>
      )}
    </div>
  )
}
