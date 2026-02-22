<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Lenis from 'lenis';

	gsap.registerPlugin(ScrollTrigger);

	let canvas: HTMLCanvasElement;
	let aboutCanvas: HTMLCanvasElement;
	let renderer: THREE.WebGLRenderer;
	let aboutRenderer: THREE.WebGLRenderer;
	let capabilitiesCanvas: HTMLCanvasElement;
	let capabilitiesRenderer: THREE.WebGLRenderer;
	let mouseX = 0;
	let mouseY = 0;
	let scrollY = $state(0);
	let lastScrollY = 0;
	let navHidden = $state(false);
	let navOnDark = $state(false);
	let mobileMenuOpen = $state(false);
	let innerHeight = 0;
	let isLoaded = $state(false);

	// GSAP context for cleanup
	let gsapCtx: gsap.Context;

	// Magnetic button effect
	let magneticBtn: HTMLElement;
	let btnX = $state(0);
	let btnY = $state(0);

	// Contact form state
	let formName = $state('');
	let formEmail = $state('');
	let formCompany = $state('');
	let formSubject = $state('');
	let formMessage = $state('');
	let formStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		formStatus = 'sending';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formName,
					email: formEmail,
					company: formCompany,
					subject: formSubject,
					message: formMessage
				})
			});
			if (!res.ok) throw new Error('Send failed');
			formStatus = 'sent';
			formName = '';
			formEmail = '';
			formCompany = '';
			formSubject = '';
			formMessage = '';
		} catch {
			formStatus = 'error';
		}
	}

	// Counter animation state
	let yearsCount = $state(0);

	let lenis: Lenis;

	onMount(() => {
		innerHeight = window.innerHeight;

		// Smooth scrolling
		lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time: number) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		// Initialize Three.js scene
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(70, 70, -30);
		camera.lookAt(1000, 900, -500);


		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 2.0;

		// Sky gradient sphere
		const skyGeo = new THREE.SphereGeometry(400, 64, 32);
		const skyMat = new THREE.ShaderMaterial({
			side: THREE.BackSide,
			depthWrite: false,
			uniforms: {
				topColor: { value: new THREE.Color(0xc4ddf0) },
				bottomColor: { value: new THREE.Color(0xedf3f8) }
			},
			vertexShader: `
				varying vec3 vPos;
				void main() {
					vPos = position;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 topColor, bottomColor;
				varying vec3 vPos;
				void main() {
					float h = normalize(vPos).y;
					float t = max(pow(max(h, 0.0), 0.5), 0.0);
					gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
				}
			`
		});
		scene.add(new THREE.Mesh(skyGeo, skyMat));

		// Lighting
		const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 200);
		scene.add(hemi);

		const sun = new THREE.DirectionalLight(0xffffff, 300);
		sun.position.set(800, 200, 0);
		scene.add(sun);

		// Environment map for PBR materials (generated before clouds so reflections stay clean)
		const pmrem = new THREE.PMREMGenerator(renderer);
		const envScene = new THREE.Scene();
		envScene.add(new THREE.Mesh(skyGeo.clone(), skyMat.clone()));
		const envRT = pmrem.fromScene(envScene, 0, 0.1, 1000);
		scene.environment = envRT.texture;
		pmrem.dispose();

		// Fog
		scene.fog = new THREE.FogExp2(0xdfe6ed, 0.0035);

// Load mountain model
		const loader = new GLTFLoader();
		loader.load('/models/mountain_200.glb', (gltf) => {
			const model = gltf.scene;
			model.scale.set(0.8, 0.8, 0.8);
			model.rotation.y = Math.PI;

			model.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					const mat = mesh.material as THREE.MeshStandardMaterial;
					if (mat.map) {
						mat.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
						mat.map.minFilter = THREE.LinearMipmapLinearFilter;
						mat.map.magFilter = THREE.LinearFilter;
						mat.map.generateMipmaps = true;
						mat.map.needsUpdate = true;
					}
					if (mat.normalMap) {
						mat.normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
						mat.normalMap.needsUpdate = true;
					}
					mat.envMapIntensity = 1.5;
					mat.emissive = new THREE.Color(0x1a4a6c);
					mat.emissiveIntensity = 0.35;
					mat.onBeforeCompile = (shader) => {
						shader.uniforms.colorTop = { value: new THREE.Color(0xffffff) };
						shader.uniforms.colorMid = { value: new THREE.Color(0xdce8f2) };
						shader.uniforms.colorBot = { value: new THREE.Color(0x5a6878) };
						shader.uniforms.edgeColor = { value: new THREE.Color(0x2e7ab8) };
						shader.vertexShader = shader.vertexShader.replace(
							'#include <common>',
							'varying float vWorldY;\nvarying vec3 vWorldNormal;\nvarying vec3 vViewDir;\n#include <common>'
						);
						shader.vertexShader = shader.vertexShader.replace(
							'#include <worldpos_vertex>',
							'#include <worldpos_vertex>\nvWorldY = worldPosition.y;\nvWorldNormal = normalize(mat3(modelMatrix) * normal);\nvViewDir = normalize(cameraPosition - worldPosition.xyz);'
						);
						shader.fragmentShader = shader.fragmentShader.replace(
							'#include <common>',
							'uniform vec3 colorTop;\nuniform vec3 colorMid;\nuniform vec3 colorBot;\nuniform vec3 edgeColor;\nvarying float vWorldY;\nvarying vec3 vWorldNormal;\nvarying vec3 vViewDir;\n#include <common>'
						);
						shader.fragmentShader = shader.fragmentShader.replace(
							'#include <dithering_fragment>',
							'float h = smoothstep(-5.0, 80.0, vWorldY);\nvec3 tint = h > 0.5 ? mix(colorMid, colorTop, (h - 0.5) * 2.0) : mix(colorBot, colorMid, h * 2.0);\ngl_FragColor.rgb = mix(gl_FragColor.rgb, tint, 0.55);\ngl_FragColor.rgb *= 1.15;\nfloat fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0), 3.0);\ngl_FragColor.rgb = mix(gl_FragColor.rgb, edgeColor, fresnel * 0.5);\n#include <dithering_fragment>'
						);
					};
					mat.needsUpdate = true;
				}
			});

			scene.add(model);
		});

		// Camera forward direction (normalized)
		const startPos = new THREE.Vector3(0, 70, -30);
		const lookTarget = new THREE.Vector3(-100, 60, -90);
		const forward = new THREE.Vector3().subVectors(lookTarget, startPos).normalize();
		const cameraSpeed = 90;
		const targetPos = new THREE.Vector3();
		const lerpFactor = 0.05;
		const mouseInfluence = 5;

		// Render loop
		let lastRendered = true;
		renderer.setAnimationLoop(() => {
			const aboutEl = document.getElementById('about');
			const cutoff = aboutEl ? aboutEl.offsetTop : Infinity;
			if (scrollY > cutoff) {
				if (lastRendered) {
					// Render one final frame then stop
					renderer.render(scene, camera);
					lastRendered = false;
				}
				return;
			}
			lastRendered = true;
			const t = scrollY / innerHeight;
			targetPos.copy(startPos).addScaledVector(forward, t * cameraSpeed);
			targetPos.x += mouseX * mouseInfluence;
			targetPos.y += -mouseY * mouseInfluence;
			camera.position.lerp(targetPos, lerpFactor);
			camera.lookAt(lookTarget);
renderer.render(scene, camera);
		});

		// ============ Wavy Dot Grid (spans expertise + about) ============
		const expertiseEl = document.getElementById('expertise');
		const aboutEl = document.getElementById('about');
		if (aboutCanvas && expertiseEl) {
			const dotScene = new THREE.Scene();
			const dotCamera = new THREE.PerspectiveCamera(50, aboutCanvas.clientWidth / aboutCanvas.clientHeight, 0.1, 200);
			dotCamera.position.set(0, 22, 12);
			dotCamera.lookAt(0, 0, -8);

			aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, antialias: true, alpha: false });
			aboutRenderer.setClearColor(0xf1f5f9);
			aboutRenderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
			aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

			// Grid parameters
			const cols = 70;
			const rows = 45;
			const spacing = 0.8;
			const totalDots = cols * rows;

			// Static base positions — wave computed on GPU
			const positions = new Float32Array(totalDots * 3);
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const i = r * cols + c;
					positions[i * 3] = (c - (cols - 1) / 2) * spacing;
					positions[i * 3 + 1] = 0;
					positions[i * 3 + 2] = (r - (rows - 1) / 2) * spacing;
				}
			}
			const geo = new THREE.BufferGeometry();
			geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

			const dotMat = new THREE.ShaderMaterial({
				transparent: true,
				uniforms: {
					uColor: { value: new THREE.Color(0x3b82f6) },
					uTime: { value: 0 },
					uScroll: { value: 0 },
					uMouse: { value: new THREE.Vector3(0, 0, 0) },
					uMouseActive: { value: 0 },
				},
				vertexShader: `
					uniform float uTime;
					uniform float uScroll;
					uniform vec3 uMouse;
					uniform float uMouseActive;
					varying float vAlpha;
					void main() {
						vec3 pos = position;
						// Scroll pushes grid away from camera (shrinks as you scroll)
						pos.z -= uScroll * 15.0;
						// Abstract multi-layered wave
						float t = uTime * 0.4;
						float wave = sin(pos.x * 0.3 + t * 1.3) * cos(pos.z * 0.25 + t * 0.9) * 1.2
							+ sin(pos.x * 0.15 - t * 0.7 + pos.z * 0.4) * cos(pos.z * 0.1 + t * 1.1) * 0.8
							+ sin(length(pos.xz) * 0.2 - t * 0.6) * 0.6
							+ cos(pos.x * 0.08 + pos.z * 0.12 + t * 0.3) * sin(pos.z * 0.2 - t * 0.5) * 1.0;
						// Drifting offset so the whole grid breathes
						pos.x += sin(t * 0.2 + pos.z * 0.05) * 0.3;
						pos.z += cos(t * 0.15 + pos.x * 0.05) * 0.3;
						// Mouse ripple on GPU
						float mouseWave = 0.0;
						float sz = 0.6;
						if (uMouseActive > 0.5) {
							float dist = distance(pos.xz, uMouse.xz);
							if (dist < 5.0) {
								float falloff = 1.0 - dist / 5.0;
								mouseWave = sin(dist * 2.0 - uTime * 3.5) * falloff * 2.0;
								sz += falloff * 1.0;
							}
						}
						pos.y = wave + mouseWave;
						// Size variation based on wave height
						sz += abs(wave) * 0.15;
						vAlpha = sz;
						vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
						gl_PointSize = sz * (100.0 / -mvPos.z);
						gl_Position = projectionMatrix * mvPos;
					}
				`,
				fragmentShader: `
					uniform vec3 uColor;
					varying float vAlpha;
					void main() {
						float d = length(gl_PointCoord - 0.5) * 2.0;
						if (d > 1.0) discard;
						float alpha = smoothstep(1.0, 0.2, d) * vAlpha * 1.05;
						gl_FragColor = vec4(uColor * 1.4, alpha);
					}
				`,
			});

			const dots = new THREE.Points(geo, dotMat);
			dots.scale.x = -1;
			dotScene.add(dots);

			// Mouse tracking relative to canvas
			aboutCanvas.addEventListener('mousemove', (e: MouseEvent) => {
				const rect = aboutCanvas.getBoundingClientRect();
				dotMat.uniforms.uMouse.value.x = ((e.clientX - rect.left) / rect.width - 0.5) * cols * spacing;
				dotMat.uniforms.uMouse.value.z = ((e.clientY - rect.top) / rect.height - 0.5) * rows * spacing;
				dotMat.uniforms.uMouseActive.value = 1;
			});
			aboutCanvas.addEventListener('mouseleave', () => {
				dotMat.uniforms.uMouseActive.value = 0;
			});

			let expertiseVisible = false;
			let aboutVisible = false;

			const dotObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.target.id === 'expertise') expertiseVisible = entry.isIntersecting;
					if (entry.target.id === 'about') aboutVisible = entry.isIntersecting;
				});
				const dotVisible = expertiseVisible || aboutVisible;
				aboutCanvas.style.visibility = dotVisible ? 'visible' : 'hidden';
			}, { threshold: 0 });
			dotObserver.observe(expertiseEl);
			if (aboutEl) dotObserver.observe(aboutEl);

			function animateDots() {
				requestAnimationFrame(animateDots);
				if (!expertiseVisible && !aboutVisible) return;
				dotMat.uniforms.uTime.value += 0.02;
				// Scroll progress: 0 at expertise top, 1 at about bottom
				const expertiseTop = expertiseEl.offsetTop;
				const aboutBottom = (aboutEl ? aboutEl.offsetTop + aboutEl.offsetHeight : expertiseEl.offsetTop + expertiseEl.offsetHeight);
				const totalRange = aboutBottom - expertiseTop;
				const progress = Math.max(0, Math.min(1, (window.scrollY - expertiseTop) / totalRange));
				dotMat.uniforms.uScroll.value = progress;
				aboutRenderer.render(dotScene, dotCamera);
			}
			animateDots();

			const dotResizeObserver = new ResizeObserver(() => {
				if (!aboutCanvas) return;
				const w = window.innerWidth;
				const h = window.innerHeight;
				aboutRenderer.setSize(w, h);
				dotCamera.aspect = w / h;
				dotCamera.updateProjectionMatrix();
			});
			dotResizeObserver.observe(document.body);
		}

		// ============ Capabilities Earth Scene ============
		const capSection = document.getElementById('capabilities-wrapper');
		if (capabilitiesCanvas && capSection) {
			const earthScene = new THREE.Scene();
			const earthCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 5000);
			earthCamera.position.set(0, 0, 5);
			earthCamera.lookAt(0, 0, 0);

			capabilitiesRenderer = new THREE.WebGLRenderer({ canvas: capabilitiesCanvas, antialias: true, alpha: false });
			capabilitiesRenderer.setSize(window.innerWidth, window.innerHeight);
			capabilitiesRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			capabilitiesRenderer.setClearColor(0x0f172a, 1);
			capabilitiesRenderer.toneMapping = THREE.ACESFilmicToneMapping;
			capabilitiesRenderer.toneMappingExposure = 2.0;

			// Lighting
			const earthHemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
			earthScene.add(earthHemi);
			const earthSun = new THREE.DirectionalLight(0xffffff, 1.0);
			earthSun.position.set(5, 3, 2);
			earthScene.add(earthSun);
			const earthFill = new THREE.DirectionalLight(0xffffff, 0.5);
			earthFill.position.set(-5, 0, -2);
			earthScene.add(earthFill);

			// Earth
			const earthGroup = new THREE.Group();
			earthGroup.rotation.z = -23.4 * Math.PI / 180;
			earthScene.add(earthGroup);

			const earthTexLoader = new THREE.TextureLoader();
			const earthGeometry = new THREE.IcosahedronGeometry(3, 80);
			// Mirror flip UVs horizontally so nations appear correctly
			const uvAttr = earthGeometry.attributes.uv;
			for (let i = 0; i < uvAttr.count; i++) {
				uvAttr.setX(i, 1.0 - uvAttr.getX(i));
			}
			uvAttr.needsUpdate = true;

			// Compute flat-disc radar target positions for each vertex
			const posAttr = earthGeometry.attributes.position;
			const radarPositions = new Float32Array(posAttr.count * 3);
			const radarMaxRadius = 3.0;
			const numRings = 4;
			const ringSpacing = radarMaxRadius / numRings;
			const ringSnapThreshold = 0.15;

			for (let i = 0; i < posAttr.count; i++) {
				const x = posAttr.getX(i);
				const y = posAttr.getY(i);
				const z = posAttr.getZ(i);
				const r = Math.sqrt(x * x + y * y + z * z);

				const theta = Math.atan2(z, x);
				const phi = Math.acos(Math.max(-1, Math.min(1, y / r)));

				// sqrt mapping for more uniform area distribution
				let radarR = Math.sqrt(phi / Math.PI) * radarMaxRadius;

				// Snap to nearest concentric ring
				const nearestRing = Math.round(radarR / ringSpacing) * ringSpacing;
				if (Math.abs(radarR - nearestRing) < ringSnapThreshold && nearestRing > 0 && nearestRing <= radarMaxRadius) {
					radarR = nearestRing;
				}

				radarPositions[i * 3] = radarR * Math.cos(theta);
				radarPositions[i * 3 + 1] = radarR * Math.sin(theta);
				radarPositions[i * 3 + 2] = 0.0;
			}

			earthGeometry.setAttribute('aRadarPos', new THREE.BufferAttribute(radarPositions, 3));

			// Bridge morph: initialize with sphere positions, then load GLB
			const bridgePositions = new Float32Array(posAttr.count * 3);
			for (let i = 0; i < posAttr.count; i++) {
				bridgePositions[i * 3] = posAttr.getX(i);
				bridgePositions[i * 3 + 1] = posAttr.getY(i);
				bridgePositions[i * 3 + 2] = posAttr.getZ(i);
			}
			const bridgeAttr = new THREE.BufferAttribute(bridgePositions, 3);
			earthGeometry.setAttribute('aDomePos', bridgeAttr);

			let domeReady = false;

			// Load bridge OBJ and map particles to its surface
			const bridgeLoader = new OBJLoader();
			bridgeLoader.load('/InfraBridge.obj', (obj) => {
				// Collect all triangles from the OBJ meshes
				const triangles: { a: THREE.Vector3; b: THREE.Vector3; c: THREE.Vector3; area: number }[] = [];
				let totalArea = 0;
				const tempA = new THREE.Vector3();
				const tempB = new THREE.Vector3();
				const tempC = new THREE.Vector3();

				obj.updateMatrixWorld(true);
				let meshCount = 0;
				const meshInfo: string[] = [];
				obj.traverse((child) => {
					if (!(child as THREE.Mesh).isMesh) return;
					const mesh = child as THREE.Mesh;
					const geo = mesh.geometry;
					const pos = geo.attributes.position;
					const idx = geo.index;
					const matrix = mesh.matrixWorld;
					meshCount++;

					const triCount = idx ? idx.count / 3 : pos.count / 3;
					const trisBefore = triangles.length;
					for (let t = 0; t < triCount; t++) {
						const i0 = idx ? idx.getX(t * 3) : t * 3;
						const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
						const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;

						tempA.set(pos.getX(i0), pos.getY(i0), pos.getZ(i0)).applyMatrix4(matrix);
						tempB.set(pos.getX(i1), pos.getY(i1), pos.getZ(i1)).applyMatrix4(matrix);
						tempC.set(pos.getX(i2), pos.getY(i2), pos.getZ(i2)).applyMatrix4(matrix);

						const ab = new THREE.Vector3().subVectors(tempB, tempA);
						const ac = new THREE.Vector3().subVectors(tempC, tempA);
						const area = ab.cross(ac).length() * 0.5;
						if (area < 1e-8) continue;

						triangles.push({
							a: tempA.clone(), b: tempB.clone(), c: tempC.clone(), area
						});
						totalArea += area;
					}
					meshInfo.push(`${mesh.name || 'unnamed'}: ${triCount} tris, ${triangles.length - trisBefore} valid`);
				});
				console.log(`[Bridge OBJ] Found ${meshCount} meshes:`, meshInfo);
				console.log(`[Bridge OBJ] Total valid triangles: ${triangles.length}, total area: ${totalArea.toFixed(2)}`);

				if (triangles.length === 0) { domeReady = true; return; }

				// No CDF needed — use uniform triangle sampling so thin cables/road
				// get visible particle density (area-weighting over-favors bulky towers)
				const triTotal = triangles.length;

				// Compute bounding box to normalize and scale
				const bbox = new THREE.Box3();
				for (const tri of triangles) {
					bbox.expandByPoint(tri.a);
					bbox.expandByPoint(tri.b);
					bbox.expandByPoint(tri.c);
				}
				const center = new THREE.Vector3();
				bbox.getCenter(center);
				const size = new THREE.Vector3();
				bbox.getSize(size);
				const maxDim = Math.max(size.x, size.y, size.z);
				const scale = 1080.0 / maxDim;
				console.log(`[Bridge OBJ] BBox min: [${bbox.min.x.toFixed(2)}, ${bbox.min.y.toFixed(2)}, ${bbox.min.z.toFixed(2)}]`);
				console.log(`[Bridge OBJ] BBox max: [${bbox.max.x.toFixed(2)}, ${bbox.max.y.toFixed(2)}, ${bbox.max.z.toFixed(2)}]`);
				console.log(`[Bridge OBJ] Size: [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}], maxDim: ${maxDim.toFixed(2)}, scale: ${scale.toFixed(4)}`);

				// Sample random points on triangles, area-weighted
				// Use deterministic seeded RNG for consistency
				let seed = 42;
				function seededRandom() {
					seed = (seed * 16807 + 0) % 2147483647;
					return (seed - 1) / 2147483646;
				}

				function sampleTriangle(tri: { a: THREE.Vector3; b: THREE.Vector3; c: THREE.Vector3 }) {
					let u = seededRandom();
					let v = seededRandom();
					if (u + v > 1) { u = 1 - u; v = 1 - v; }
					const w = 1 - u - v;
					return new THREE.Vector3(
						tri.a.x * w + tri.b.x * u + tri.c.x * v,
						tri.a.y * w + tri.b.y * u + tri.c.y * v,
						tri.a.z * w + tri.b.z * u + tri.c.z * v
					);
				}

				function pickTriangle(): number {
					return Math.floor(seededRandom() * triTotal);
				}

				// Distribute all particles across the bridge surface
				// Rotate bridge 45 deg around Y axis (green line)
				const bridgeAngleY = Math.PI * 0.25;
				const cosY = Math.cos(bridgeAngleY);
				const sinY = Math.sin(bridgeAngleY);
				for (let i = 0; i < posAttr.count; i++) {
					const triIdx = pickTriangle();
					const pt = sampleTriangle(triangles[triIdx]);
					const noise = 0.5;
					const x = (pt.x - center.x) * scale + (seededRandom() - 0.5) * noise;
					const y = (pt.y - center.y) * scale + (seededRandom() - 0.5) * noise;
					const z = (pt.z - center.z) * scale + (seededRandom() - 0.5) * noise;
					bridgePositions[i * 3] = x * cosY + z * sinY + 260;
					bridgePositions[i * 3 + 1] = y;
					bridgePositions[i * 3 + 2] = -x * sinY + z * cosY;
				}

				bridgeAttr.needsUpdate = true;
				domeReady = true;
			});

			const earthMaterial = new THREE.ShaderMaterial({
				transparent: true,
				uniforms: {
					specMap: { value: earthTexLoader.load('/textures/earth/02_earthspec1k.jpg') },
					uTime: { value: 0 },
					uActivity: { value: 0 },
					uMouseNDC: { value: new THREE.Vector2(0, 0) },
					uMouseHover: { value: 0 },
					uColorProgress: { value: 0 },
					uMorphProgress: { value: 1 },
					uSweepAngle: { value: 0 },
					uDomeMorphProgress: { value: 0 }
				},
				vertexShader: `
					attribute vec3 aRadarPos;
					attribute vec3 aDomePos;
					uniform sampler2D specMap;
					uniform float uTime;
					uniform float uActivity;
					uniform vec2 uMouseNDC;
					uniform float uMouseHover;
					uniform float uMorphProgress;
					uniform float uDomeMorphProgress;
					varying float vIsLand;
					varying vec3 vNormal;
					varying vec3 vViewDir;
					varying float vDepth;
					varying float vRadarAngle;
					varying float vRadarRadius;
					varying float vMorphProgress;
					varying float vDomeMorphProgress;

					// Pseudo-random
					float hash(float n) { return fract(sin(n) * 43758.5453); }

					void main() {
						float spec = texture2D(specMap, uv).r;
						vIsLand = 1.0 - smoothstep(0.1, 0.5, spec);

						vec3 pos = position;
						if (vIsLand > 0.3) {
							vec3 n = normalize(position);
							// Tangent basis on sphere surface
							vec3 up = abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
							vec3 tangent = normalize(cross(up, n));
							vec3 bitangent = cross(n, tangent);

							// Per-particle random seed
							float id = dot(position, vec3(127.1, 311.7, 74.7));
							float phase1 = hash(id) * 6.2831;
							float phase2 = hash(id + 1.0) * 6.2831;
							float speed1 = 0.3 + hash(id + 2.0) * 0.7;
							float speed2 = 0.3 + hash(id + 3.0) * 0.7;
							float speed3 = 0.2 + hash(id + 4.0) * 0.5;
							float speed4 = 0.2 + hash(id + 5.0) * 0.5;

							float t = uTime;
							// Multi-frequency wandering along surface
							float dT = sin(t * speed1 + phase1) * 0.02
								+ sin(t * speed3 * 1.7 + phase2 * 2.0) * 0.012
								+ sin(t * speed1 * 2.3 + phase1 * 0.5) * 0.008;
							float dB = cos(t * speed2 + phase2) * 0.02
								+ cos(t * speed4 * 1.9 + phase1 * 1.5) * 0.012
								+ cos(t * speed2 * 2.1 + phase2 * 0.7) * 0.008;

							// Mouse proximity in screen space
							vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
							vec2 screenPos = clipPos.xy / clipPos.w;
							float mouseDist = distance(screenPos, uMouseNDC);
							float mouseInfluence = smoothstep(0.15, 0.0, mouseDist) * uMouseHover;

							// Combine scroll activity with mouse hover proximity
							float activity = max(uActivity, mouseInfluence);
							// Reduce wandering as any morph progresses
							float anyMorph = max(uMorphProgress, uDomeMorphProgress);
							pos += (tangent * dT + bitangent * dB) * activity * (1.0 - anyMorph);
						}

						// Chain morphs: globe → radar → dome
						float radarT = smoothstep(0.0, 1.0, uMorphProgress);
						float domeT = smoothstep(0.0, 1.0, uDomeMorphProgress);
						vec3 finalPos = pos;
						finalPos = mix(finalPos, aRadarPos, radarT);
						finalPos = mix(finalPos, aDomePos, domeT);

						// Pass info to fragment shader
						vRadarAngle = atan(aRadarPos.y, aRadarPos.x);
						vRadarRadius = length(aRadarPos.xy);
						vMorphProgress = uMorphProgress;
						vDomeMorphProgress = uDomeMorphProgress;

						vNormal = normalize(normalMatrix * normal);
						vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
						vViewDir = normalize(-mvPosition.xyz);
						vDepth = -mvPosition.z;
						// Far particles get bigger (blurrier), close ones stay small (sharp)
						float depthFactor = smoothstep(2.0, 8.0, vDepth);
						float size = mix(0.15, 0.6, depthFactor);
						float globeSize = vIsLand > 0.3 ? size * (30.0 / -mvPosition.z) : 0.0;
						// Radar and bridge show ALL particles, not just land
						float radarSize = 0.3 * (30.0 / -mvPosition.z);
						float domeSize = 0.2 * (30.0 / -mvPosition.z);
						float morphedSize = mix(globeSize, radarSize, radarT);
						gl_PointSize = mix(morphedSize, domeSize, domeT);
						gl_Position = projectionMatrix * mvPosition;
					}
				`,
				fragmentShader: `
					uniform float uColorProgress;
					uniform float uMorphProgress;
					uniform float uDomeMorphProgress;
					uniform float uSweepAngle;
					uniform float uTime;
					varying float vIsLand;
					varying vec3 vNormal;
					varying vec3 vViewDir;
					varying float vDepth;
					varying float vRadarAngle;
					varying float vRadarRadius;
					varying float vMorphProgress;
					varying float vDomeMorphProgress;
					void main() {
						float anyMorphF = max(vMorphProgress, vDomeMorphProgress);
						if (vIsLand < 0.3 && anyMorphF < 0.01) discard;
						float d = length(gl_PointCoord - 0.5) * 2.0;
						if (d > 1.0) discard;
						float lighting = dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))) * 0.3 + 0.7;
						float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);
						// Transition from light blue to warm slate
						vec3 blueCol = vec3(0.55, 0.75, 0.95);
						vec3 slateCol = vec3(0.55, 0.52, 0.48);
						vec3 baseCol = mix(blueCol, slateCol, uColorProgress);
						vec3 blueFresnel = vec3(0.1, 0.15, 0.2);
						vec3 slateFresnel = vec3(0.15, 0.12, 0.1);
						vec3 col = baseCol * lighting + fresnel * mix(blueFresnel, slateFresnel, uColorProgress);
						// Blur: far particles have soft edges, close ones are crisp
						float depthFactor = smoothstep(2.0, 8.0, vDepth);
						float edge = mix(0.2, 0.8, depthFactor);
						float alpha = smoothstep(1.0, edge, d) * mix(0.9, 0.3, depthFactor);

						// Radar overlay
						float morphT = smoothstep(0.0, 1.0, vMorphProgress);
						if (morphT > 0.01) {
							vec3 radarGreen = vec3(0.1, 0.9, 0.3);
							vec3 radarDim = vec3(0.04, 0.25, 0.08);

							// Concentric ring brightening
							float radarMaxR = 3.0;
							float ringSpacing = radarMaxR / 4.0;
							float ringDist = mod(vRadarRadius + 0.001, ringSpacing);
							float onRing = 1.0 - smoothstep(0.0, 0.1, min(ringDist, ringSpacing - ringDist));

							// Sweep line with trailing afterglow
							float angleDiff = vRadarAngle - uSweepAngle;
							angleDiff = mod(angleDiff + 3.14159, 6.28318) - 3.14159;
							float sweep = smoothstep(-0.8, 0.0, angleDiff) * smoothstep(0.03, 0.0, angleDiff);
							float trail = smoothstep(-2.0, 0.0, angleDiff) * smoothstep(0.03, 0.0, angleDiff) * 0.25;

							// Compose radar color
							vec3 radarCol = radarDim;
							radarCol += radarGreen * onRing * 0.5;
							radarCol += radarGreen * (sweep + trail);

							col = mix(col, radarCol, morphT);

							// Crisper alpha in radar mode
							float radarAlpha = smoothstep(1.0, 0.3, d) * 0.85;
							alpha = mix(alpha, radarAlpha, morphT);
						}

						// Bridge overlay
						float domeT = smoothstep(0.0, 1.0, vDomeMorphProgress);
						if (domeT > 0.01) {
							vec3 steelBlue = vec3(0.4, 0.65, 0.9);
							vec3 steelDim = vec3(0.08, 0.12, 0.2);

							// Structural shimmer along cables
							float shimmer = sin(uTime * 1.5 + vNormal.x * 10.0) * 0.2 + 0.8;

							// Edge highlight
							float bridgeFresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);

							vec3 bridgeCol = steelDim * shimmer;
							bridgeCol += steelBlue * bridgeFresnel * 0.5;
							bridgeCol += steelBlue * 0.15;

							col = mix(col, bridgeCol, domeT);

							float bridgeAlpha = smoothstep(1.0, 0.2, d) * 0.9;
							alpha = mix(alpha, bridgeAlpha, domeT);
						}

						gl_FragColor = vec4(col, alpha);
					}
				`
			});

			const earthMesh = new THREE.Points(earthGeometry, earthMaterial);
			earthGroup.add(earthMesh);
			earthGroup.position.set(2.5, -2.5, 0);

			let lastCapScroll = 0;
			let capVisible = false;
			let scrollActivity = 0;

			// Mouse hover for globe particles
			let mouseHoverTarget = 0;
			let mouseHoverSmooth = 0;

			window.addEventListener('mousemove', (e: MouseEvent) => {
				if (!capVisible) return;
				const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
				const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
				earthMaterial.uniforms.uMouseNDC.value.set(ndcX, ndcY);
				mouseHoverTarget = 1;
			});

			window.addEventListener('mouseleave', () => {
				mouseHoverTarget = 0;
			});

			const capObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => { capVisible = entry.isIntersecting; });
			}, { threshold: 0 });
			capObserver.observe(capSection);

			function animateEarth() {
				requestAnimationFrame(animateEarth);
				if (!capVisible) return;
				const currentScroll = window.scrollY;
				const delta = currentScroll - lastCapScroll;
				lastCapScroll = currentScroll;
				const curRadarMorph = earthMaterial.uniforms.uMorphProgress.value;
				const curDomeMorph = earthMaterial.uniforms.uDomeMorphProgress.value;
				const anyMorph = Math.max(curRadarMorph, curDomeMorph);
				// Scroll-driven rotation only when scrolling down, only for globe
				const downDelta = Math.max(0, delta);
				const scrollingDown = downDelta > 0.5;
				if (anyMorph < 0.01) {
					// Globe mode: free scroll-driven rotation
					earthMesh.rotation.y += downDelta * 0.003;
				} else {
					// Radar & bridge: same fixed angle so transition is smooth
					earthMesh.rotation.y += (0 - earthMesh.rotation.y) * 0.05;
				}
				earthMaterial.uniforms.uTime.value += 0.016;

				// Ease activity up when scrolling, ease down when stopped
				const isScrolling = Math.abs(delta) > 0.5 ? 1 : 0;
				const easeSpeed = isScrolling ? 0.04 : 0.12;
				scrollActivity += (isScrolling - scrollActivity) * easeSpeed;
				earthMaterial.uniforms.uActivity.value = scrollActivity;

				// Smooth mouse hover
				mouseHoverSmooth += (mouseHoverTarget - mouseHoverSmooth) * 0.08;
				earthMaterial.uniforms.uMouseHover.value = mouseHoverSmooth;

				// Scroll progress through capabilities wrapper
				const capTop = capSection.offsetTop;
				const capHeight = capSection.offsetHeight;
				const progress = Math.max(0, Math.min(1, (currentScroll - capTop) / (capHeight * 0.85)));

				// Dot color: blue → slate based on progress
				earthMaterial.uniforms.uColorProgress.value = progress;

				// Radar morph: already morphed at start, hold through Defense, fade as bridge takes over
				let radarMorph = 0;
				if (progress < 0.30) {
					radarMorph = 1;
				} else {
					radarMorph = Math.max(0, 1 - (progress - 0.30) / 0.06);
				}
				earthMaterial.uniforms.uMorphProgress.value = radarMorph;

				// Bridge morph: ramp in for Infrastructure, hold, fade back to globe
				let domeMorph = 0;
				if (domeReady) {
					if (progress >= 0.30 && progress < 0.55) {
						domeMorph = Math.min(1, (progress - 0.30) / 0.06);
					} else if (progress >= 0.55) {
						domeMorph = Math.max(0, 1 - (progress - 0.55) / 0.06);
					}
				}
				earthMaterial.uniforms.uDomeMorphProgress.value = domeMorph;

				// Sweep angle rotation when radar is active, only when scrolling down
				if (radarMorph > 0 && scrollingDown) {
					earthMaterial.uniforms.uSweepAngle.value += 0.03;
				}

				// Pull camera back during bridge morph so full model is visible
				const targetZ = 5 + domeMorph * 450; // 5 → 455 during bridge
				earthCamera.position.z += (targetZ - earthCamera.position.z) * 0.15;

				// Shift camera to look at bottom-left during bridge morph
				const targetX = domeMorph * -50; // slight offset so bridge is roughly centered
				const targetY = domeMorph * 20; // move camera slightly up for bridge
				earthCamera.position.x += (targetX - earthCamera.position.x) * 0.15;
				earthCamera.position.y += (targetY - earthCamera.position.y) * 0.15;

				// Un-tilt for radar and tower (both should stand upright)
				const baseTilt = -23.4 * Math.PI / 180;
				const tiltFactor = Math.max(radarMorph, domeMorph);
				const targetTilt = baseTilt * (1.0 - tiltFactor);
				earthGroup.rotation.z += (targetTilt - earthGroup.rotation.z) * 0.05;

				// Background color stops:
				// 0.00 = Defense start → Dark Navy
				// 0.20 = Defense end → Dark Navy
				// 0.25 = Infra pinned → Dark Navy
				// 0.40 = Infra end → transition to Navy
				// 0.50 = Investments → Dark Navy
				// 0.65 = Investments end → transition to Dark Navy
				// 0.75 = Energy → Dark Navy
				// 0.90 = Energy end → transition to White
				// 1.00 = End → White
				const navy = new THREE.Color(0x0f172a);
				const darkNavy = new THREE.Color(0x0a1024);
				const white = new THREE.Color(0xfafaf9);

				const bgStops: [number, THREE.Color][] = [
					[0.00, navy],
					[0.15, navy],
					[0.22, darkNavy],
					[0.35, darkNavy],
					[0.42, navy],
					[0.60, navy],
					[0.68, darkNavy],
					[0.80, darkNavy],
					[0.92, white],
					[1.00, white],
				];

				// Interpolate between stops
				let bgColor = bgStops[0][1];
				for (let s = 0; s < bgStops.length - 1; s++) {
					if (progress >= bgStops[s][0] && progress <= bgStops[s + 1][0]) {
						const t = (progress - bgStops[s][0]) / (bgStops[s + 1][0] - bgStops[s][0]);
						bgColor = bgStops[s][1].clone().lerp(bgStops[s + 1][1], t);
						break;
					}
				}
				capabilitiesRenderer.setClearColor(bgColor, 1);

				capabilitiesRenderer.render(earthScene, earthCamera);
			}
			animateEarth();

			const capResizeObserver = new ResizeObserver(() => {
				if (!capabilitiesCanvas) return;
				const w = window.innerWidth;
				const h = window.innerHeight;
				capabilitiesRenderer.setSize(w, h);
				earthCamera.aspect = w / h;
				earthCamera.updateProjectionMatrix();
			});
			capResizeObserver.observe(document.body);
		}

		// GSAP scroll animations
		gsapCtx = gsap.context(() => {
			const trigger = { start: 'top 85%' };

			// Hero elements fade out on scroll
			const heroSection = document.querySelector('.hero-section');
			if (heroSection) {
				const heroFadeElements = ['.hero-content', '.hero-keg', '.hero-est', '.hero-scroll'];
				const heroTl = gsap.timeline({
					scrollTrigger: {
						trigger: heroSection,
						start: 'top top',
						end: '30% top',
						scrub: 0.5,
					}
				});
				heroFadeElements.forEach((sel, i) => {
					const el = document.querySelector(sel);
					if (el) {
						heroTl.to(el, {
							opacity: 0,
							y: -60,
							duration: 0.3,
							ease: 'power2.in',
						}, i * 0.03);
					}
				});
			}

			// Helper to create reliable scroll animations
			function scrollAnim(el: Element, from: gsap.TweenVars, to: gsap.TweenVars) {
				gsap.set(el, from);
				ScrollTrigger.create({ trigger: el, ...trigger, once: true, onEnter: () => gsap.to(el, to) });
			}
			function scrollAnimChildren(parent: Element, from: gsap.TweenVars, to: gsap.TweenVars) {
				gsap.set(parent.children, from);
				ScrollTrigger.create({ trigger: parent, ...trigger, once: true, onEnter: () => gsap.to(parent.children, to) });
			}

			// Line dividers
			gsap.utils.toArray<HTMLElement>('.gsap-line').forEach((el) => {
				scrollAnim(el, { width: 0 }, { width: '100%', duration: 1.5, ease: 'power4.out' });
			});

			// Scale reveals
			gsap.utils.toArray<HTMLElement>('.gsap-scale-reveal').forEach((el) => {
				scrollAnim(el, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' });
			});

			// Fade ups
			gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((el) => {
				scrollAnim(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
			});

			// Slide ups
			gsap.utils.toArray<HTMLElement>('.gsap-slide-up').forEach((el) => {
				scrollAnim(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
			});

			// Expertise section: horizontal scroll cards
			const expertiseSec = document.getElementById('expertise');
			const expertiseCanvasEl = aboutCanvas;
			if (expertiseSec) {
				const scrollTrack = expertiseSec.querySelector('.expertise-scroll-track') as HTMLElement;
				const expertiseContent = expertiseSec.querySelector(':scope > div:last-child');
				if (scrollTrack) {
					const scrollDistance = scrollTrack.scrollWidth - window.innerWidth + 64;
					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: expertiseSec,
							start: 'center center',
							end: `+=${scrollDistance + window.innerHeight * 0.6}`,
							pin: true,
							scrub: true,
						}
					});
					// 0–60%: horizontal scroll
					tl.to(scrollTrack, {
						x: -scrollDistance,
						duration: 0.6,
						ease: 'none',
					}, 0);
					// 60–80%: background darkens
					tl.to(expertiseSec, {
						backgroundColor: '#000000',
						duration: 0.2,
						ease: 'power2.in',
					}, 0.6);
					// 60–85%: dot grid fades in
					if (expertiseCanvasEl) {
						tl.to(expertiseCanvasEl, { opacity: 1, duration: 0.25 }, 0.6);
					}
				}
			}

			// About section: fade in content on scroll
			const aboutSec = document.getElementById('about');
			const aboutContentEl = aboutSec?.querySelector('.about-content');
			if (aboutContentEl) {
				gsap.fromTo(aboutContentEl, { opacity: 0, y: 40 }, {
					opacity: 1,
					y: 0,
					scrollTrigger: {
						trigger: aboutSec,
						start: 'top 70%',
						end: 'top 20%',
						scrub: true,
					}
				});
			}

			// Years counter
			const counterEl = document.querySelector('.gsap-counter');
			if (counterEl) {
				const counter = { val: 0 };
				ScrollTrigger.create({ trigger: counterEl, ...trigger, once: true, onEnter: () => {
					gsap.to(counter, { val: 15, duration: 2, ease: 'expo.out', snap: { val: 1 }, onUpdate: () => { yearsCount = counter.val; } });
				}});
				scrollAnim(counterEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
			}

			// ============ THEATRICAL CAPABILITY REVEALS ============
			['cap-defense', 'cap-infra', 'cap-investments', 'cap-energy'].forEach((id) => {
				const section = document.getElementById(id);
				if (!section) return;

				const anims = section.querySelectorAll('.cap-anim');
				const lines = section.querySelectorAll('.cap-line');
				const items = section.querySelectorAll('.cap-item');

				// Pin each subsection and scrub content up/down with scroll
				const content = section.querySelector(':scope > div') as HTMLElement;
				if (content) {
					gsap.to(content, {
						y: -120,
						ease: 'none',
						scrollTrigger: {
							trigger: section,
							start: 'top top',
							end: `+=${window.innerHeight * 0.6}`,
							pin: true,
							pinSpacing: true,
							scrub: true,
						}
					});
				}

				// Set initial states
				gsap.set(anims, { y: 60, opacity: 0 });
				gsap.set(lines, { width: 0 });
				gsap.set(items, { y: 80, opacity: 0 });

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: section,
						start: 'top 70%',
						once: true,
					}
				});

				// Number + divider line first
				tl.to(anims[0], { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
				tl.to(lines, { width: '100%', duration: 1.2, ease: 'power4.out' }, '-=0.6');

				// Title
				if (anims[1]) tl.to(anims[1], { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=0.7');

				// Description
				if (anims[2]) tl.to(anims[2], { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=0.8');

				// Items one by one
				if (items.length) {
					tl.to(items, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out' }, '-=0.4');
				}
			});

			// Flip cards - ethos
			const flipCards = document.querySelector('.gsap-flip-cards');
			if (flipCards) scrollAnimChildren(flipCards, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power4.out' });

			// Contact reveal
			const contactReveal = document.querySelector('.gsap-contact-reveal');
			if (contactReveal) {
				const words = contactReveal.querySelectorAll('.contact-word');
				gsap.set(words, { y: 60, opacity: 0 });
				ScrollTrigger.create({ trigger: contactReveal, ...trigger, once: true, onEnter: () => {
					gsap.to(words, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' });
				}});
				const contactTexts = contactReveal.querySelectorAll('p');
				gsap.set(contactTexts, { y: 30, opacity: 0 });
				ScrollTrigger.create({ trigger: contactReveal, ...trigger, once: true, onEnter: () => {
					gsap.to(contactTexts, { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.4, ease: 'power4.out' });
				}});
			}

		});

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
			innerHeight = window.innerHeight;
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = (e.clientX / window.innerWidth) * 2 - 1;
			mouseY = (e.clientY / window.innerHeight) * 2 - 1;
		};

		const handleScroll = () => {
			scrollY = window.scrollY;
			navHidden = scrollY > lastScrollY && scrollY > 80;
			lastScrollY = scrollY;

			const capWrapper = document.getElementById('capabilities-wrapper');
			if (capWrapper) {
				const rect = capWrapper.getBoundingClientRect();
				navOnDark = rect.top < 60 && rect.bottom > 60;
			}
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('scroll', handleScroll, { passive: true });

		setTimeout(() => { isLoaded = true; }, 100);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	onDestroy(() => {
		renderer?.setAnimationLoop(null);
		gsapCtx?.revert();
		renderer?.dispose();
		aboutRenderer?.dispose();
		capabilitiesRenderer?.dispose();
		lenis?.destroy();
	});

	// Magnetic button handler
	function handleMagneticMove(e: MouseEvent) {
		if (!magneticBtn) return;
		const rect = magneticBtn.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		btnX = x * 0.3;
		btnY = y * 0.3;
	}

	function handleMagneticLeave() {
		btnX = 0;
		btnY = 0;
	}
</script>

<svelte:head>
	<title>Kleis Eschatos Group</title>
</svelte:head>

<div class="relative">
	<!-- Navbar -->
	<nav
		class="liquid-nav fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-4 py-3 transition-all duration-500 ease-in-out md:rounded-full md:px-8"
		class:nav-hidden={navHidden}
		class:nav-dark={navOnDark}
	>
		<div class="flex items-center justify-between gap-4 md:gap-10">
			<img src="/self_logo.png" alt="KEG" class="h-6 w-auto md:h-8" />
			<a href="#about" class="nav-link hidden text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300 md:inline">About</a>
			<a href="#capabilities" class="nav-link hidden text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300 md:inline">Capabilities</a>
			<a href="#investments" class="nav-link hidden text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300 md:inline">Investments</a>
			<a href="#ethos" class="nav-link hidden text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300 md:inline">Ethos</a>
			<a href="#contact" class="nav-link hidden text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300 md:inline">Contact</a>
			<button
				class="nav-link flex h-8 w-8 items-center justify-center md:hidden"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
					{/if}
				</svg>
			</button>
		</div>
		<div
			class="mobile-menu-inner grid md:hidden"
			class:mobile-menu-open={mobileMenuOpen}
		>
			<div class="overflow-hidden">
				<div class="flex flex-col items-center gap-4 pt-4 pb-2">
					{#each [
						{ label: 'About', href: '#about' },
						{ label: 'Capabilities', href: '#capabilities' },
						{ label: 'Investments', href: '#investments' },
						{ label: 'Ethos', href: '#ethos' },
						{ label: 'Contact', href: '#contact' }
					] as link}
						<a
							href={link.href}
							class="nav-link text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300"
							onclick={() => mobileMenuOpen = false}
						>{link.label}</a>
					{/each}
				</div>
			</div>
		</div>
	</nav>

	<!-- Fixed 3D Mountain Background -->
	<div class="fixed inset-0 z-0">
		<canvas bind:this={canvas} class="h-full w-full"></canvas>
	</div>

	<!-- ==================== HERO SECTION ==================== -->
	<section class="hero-section relative z-10 flex min-h-screen items-center">

		<div class="hero-content relative z-10 w-full max-w-6xl px-10 md:px-16" class:loaded={isLoaded}>
			<div class="overflow-hidden">
				<div class="hero-title mb-8 flex items-center gap-5" style="transform: translateY(100%); opacity: 0;">
					<img src="/self_logo.png" alt="KEG" class="h-14 w-auto md:h-20 lg:h-24" />
					<h1 class="text-5xl font-extralight tracking-tight text-slate-800 md:text-7xl lg:text-8xl">
						Kleis Eschatos Group
					</h1>
				</div>
			</div>

			<div class="overflow-hidden">
				<p class="hero-tagline mb-12 max-w-xl text-xl font-light leading-relaxed text-slate-500 md:text-2xl" style="transform: translateY(100%); opacity: 0;">
					Securing Sovereignty. Engineering Resilience. Powering the Future.
				</p>
			</div>

		</div>

		<div class="hero-est absolute right-10 top-10 text-[10px] font-light tracking-[0.4em] text-slate-400 md:right-16">EST. 2009</div>

		<div class="hero-scroll absolute bottom-16 left-1/2 -translate-x-1/2">
			<a href="#about" class="scroll-indicator flex flex-col items-center gap-4">
				<span class="text-sm font-light tracking-[0.4em] text-slate-600 uppercase">Scroll</span>
				<div class="scroll-line h-14 w-px bg-gradient-to-b from-slate-600 to-transparent"></div>
			</a>
		</div>
	</section>


	<!-- ==================== STATEMENT SECTION ==================== -->
	<section class="relative z-10 bg-gradient-to-b from-transparent via-slate-100/50 via-15% to-slate-100">
		<div class="mx-auto max-w-5xl px-8 py-32">
			<!-- Large centered headline -->
			<div class="gsap-scale-reveal">
				<h2 class="text-center text-4xl font-extralight leading-[1.2] tracking-tight text-slate-800 md:text-5xl lg:text-6xl">
					Strategic Defense.
				</h2>
				<h2 class="mt-2 text-center text-4xl font-extralight leading-[1.2] tracking-tight text-slate-600 md:text-5xl lg:text-6xl">
					Resilient Infrastructure.
				</h2>
				<h2 class="mt-2 text-center text-4xl font-extralight leading-[1.2] tracking-tight text-slate-600 md:text-5xl lg:text-6xl">
					Ethical Capital.
				</h2>
			</div>

			<!-- Divider with label -->
			<div class="mx-auto mt-16 flex max-w-2xl items-center gap-6">
				<div class="gsap-line h-px flex-1 bg-slate-300"></div>
				<span class="gsap-fade-up text-sm font-light tracking-[0.4em] text-slate-400 uppercase">Who We Are</span>
				<div class="gsap-line h-px flex-1 bg-slate-300"></div>
			</div>

			<!-- Description -->
			<div class="gsap-slide-up mx-auto mt-12 max-w-3xl text-center">
				<p class="gsap-fade-up text-xl font-light leading-[1.8] text-slate-600 md:text-2xl">
					We are a multi-disciplinary industrial group bridging the gap between national security and sustainable development. Integrating over a decade of specialized engineering expertise with a philosophy of long-term stewardship, we build the systems that protect and empower nations.
				</p>
			</div>
		</div>
	</section>

	<!-- Dot grid canvas — fixed behind expertise + about -->
	<canvas bind:this={aboutCanvas} class="pointer-events-none fixed inset-0 z-[15] h-full w-full" style="opacity: 0; visibility: hidden;"></canvas>

	<!-- ==================== OUR EXPERTISE ==================== -->
	<section id="expertise" class="relative z-10 flex min-h-screen items-center overflow-hidden" style="background-color: #f1f5f9;">
		<div class="relative z-20 w-full py-16">
			<h2 class="expertise-heading mb-14 text-center text-4xl font-extralight tracking-tight text-slate-800 md:text-5xl lg:text-6xl">Our Expertise</h2>
			<div class="expertise-scroll-track flex gap-8 px-8">
				{#each [
					{ title: 'Defense Technology', desc: 'Advanced security and intelligence solutions for government agencies and special forces.', num: '01' },
					{ title: 'Infrastructure', desc: 'Future-ready systems built to endure environmental and operational challenges.', num: '02' },
					{ title: 'Investments', desc: 'Capital aligned with purpose, industrial growth, and long-term national stability.', num: '03' },
					{ title: 'Energy', desc: 'Power generation, renewables, and sustainable transition solutions for the future.', num: '04' }
				] as item}
					<div class="expertise-card group relative flex-shrink-0 w-[75vw] overflow-hidden border border-slate-200 bg-white px-12 py-20 shadow-sm transition-all duration-500 hover:border-slate-300 hover:shadow-lg md:w-[40vw] md:py-24 lg:w-[30vw]">
						<span class="expertise-num mb-8 block text-xs font-light tracking-[0.3em] text-slate-400">{item.num}</span>
						<h4 class="expertise-title mb-4 text-3xl font-extralight text-slate-800 transition-colors duration-300">{item.title}</h4>
						<p class="expertise-desc text-base font-light leading-relaxed text-slate-500">{item.desc}</p>
						<div class="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-slate-500 to-transparent transition-all duration-700 group-hover:w-full"></div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ==================== ABOUT US ==================== -->
	<section id="about" class="relative z-[20] min-h-screen overflow-hidden bg-transparent">
		<div class="about-content relative z-20 mx-auto max-w-6xl px-8 pt-0 pb-48">
			<!-- Header centered -->
			<div class="mb-20 text-center">
				<p class="about-label mb-6 text-xs font-light tracking-[0.5em] text-slate-500 uppercase">Who We Are</p>
				<h2 class="about-heading text-5xl font-extralight leading-[1.1] tracking-tight text-slate-800 md:text-6xl lg:text-7xl">About Us</h2>
			</div>

			<!-- Two-column: counter left, content right -->
			<div class="grid items-start gap-16 lg:grid-cols-12">
				<!-- Left: years counter -->
				<div class="lg:col-span-3 self-stretch">
					<div class="gsap-counter lg:sticky lg:top-1/2 lg:-translate-y-1/2">
						<span class="about-heading block text-7xl font-extralight tabular-nums text-slate-800 md:text-8xl">{yearsCount}<span class="about-label text-slate-400">+</span></span>
						<span class="about-label mt-2 block text-xs font-light tracking-[0.3em] text-slate-500 uppercase">years of excellence</span>
					</div>
				</div>

				<!-- Right: heritage + philosophy -->
				<div class="space-y-24 lg:col-span-9">
					<!-- Heritage -->
					<div class="gsap-slide-up group">
						<div class="mb-8 flex items-center gap-5">
							<span class="about-number flex h-12 w-12 shrink-0 items-center justify-center border border-slate-300 text-xs font-light tracking-[0.2em] text-slate-400 transition-colors duration-500 group-hover:border-slate-500 group-hover:text-slate-600">01</span>
							<div class="about-divider h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
						</div>
						<h3 class="about-heading mb-6 text-3xl font-extralight leading-[1.3] text-slate-800 md:text-4xl">
							A Heritage of Precision,<br />A Future of Purpose.
						</h3>
						<p class="about-body text-lg font-light leading-[1.9] text-slate-500">
							Kleis Eschatos Group was established over 15 years ago to provide government agencies with bespoke, specialized procurement and support services. We have since evolved into a comprehensive group covering defense technologies, manufacturing, and strategic investment.
						</p>
					</div>

					<!-- Philosophy -->
					<div class="gsap-slide-up group">
						<div class="mb-8 flex items-center gap-5">
							<span class="about-number flex h-12 w-12 shrink-0 items-center justify-center border border-slate-300 text-xs font-light tracking-[0.2em] text-slate-400 transition-colors duration-500 group-hover:border-slate-500 group-hover:text-slate-600">02</span>
							<div class="about-divider h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
						</div>
						<h3 class="about-heading mb-6 text-3xl font-extralight leading-[1.3] text-slate-800 md:text-4xl">
							Stewardship Over<br />Speculation.
						</h3>
						<p class="about-body text-lg font-light leading-[1.9] text-slate-500">
							We go beyond the traditional role of a contractor. We believe in stewardship — acting as long-term stakeholders rather than passive advisors. Our approach blends strategic foresight with disciplined capital, ensuring that every project we deliver harmonizes economic growth with social responsibility and national stability.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== CAPABILITIES WRAPPER WITH GLOBE ==================== -->
	<div id="capabilities-wrapper" class="relative">
		<!-- Sticky earth canvas background -->
		<div class="sticky top-0 z-[18] h-screen w-full">
			<canvas bind:this={capabilitiesCanvas} class="h-full w-full"></canvas>
		</div>

		<!-- Content overlay -->
		<div class="relative z-[20]" style="margin-top: -100vh;">

	<!-- ==================== CAPABILITIES INTRO ==================== -->
	<section id="capabilities" class="relative overflow-hidden bg-transparent pt-20 pb-8">
		<div class="mx-auto max-w-4xl px-8 text-center">
			<p class="gsap-fade-up text-base font-light tracking-[0.4em] text-slate-400 uppercase">What We Do</p>
			<h2 class="gsap-fade-up mt-4 text-5xl font-extralight leading-[1.2] text-white md:text-6xl lg:text-7xl">Our Capabilities</h2>
		</div>
	</section>


	<!-- ==================== DEFENSE SECTION ==================== -->
	<section id="cap-defense" class="relative">
		<div class="mx-auto max-w-6xl px-8 py-32">
			<!-- Header -->
			<div class="mb-20 max-w-3xl">
				<div class="cap-anim mb-6 flex items-center gap-4">
					<span class="flex h-12 w-12 items-center justify-center border border-slate-600 text-lg font-extralight text-slate-400">01</span>
					<div class="cap-line h-px flex-1 bg-gradient-to-r from-slate-600 to-transparent"></div>
				</div>
				<h3 class="cap-anim mb-6 text-4xl font-extralight leading-[1.3] text-white md:text-5xl lg:text-6xl">Defense & Security</h3>
				<p class="cap-anim text-2xl font-light leading-[1.8] text-slate-300 md:text-3xl">
					Comprehensive protection for a complex world. We act as a leading turnkey solution provider, integrating various technologies for homeland security and special forces.
				</p>
			</div>

			<!-- Numbered list -->
			<div class="space-y-0">
				{#each [
					{ title: 'Cyber Intelligence', desc: 'Solutions for data protection and intelligence gathering to combat digital threats.' },
					{ title: 'Surveillance Systems', desc: 'Integrated "Air-Ground" supervision capabilities to detect and track activity across borders.' },
					{ title: 'Tactical Response', desc: 'Full-spectrum CBRNE detection vehicles and specialized riot control systems.' },
					{ title: 'Modernization', desc: 'Retrofitting and upgrading critical defense platforms and air defense units.' },
					{ title: 'Optics & Vision', desc: 'Advanced night vision systems and "future-proof" optical gear.' },
					{ title: 'Software Engineering', desc: 'Full-lifecycle development—from design to implementation—creating secure, reliable systems for mission-critical operations.' }
				] as item, i}
					<div class="cap-item group border-t border-slate-700 last:border-b">
						<div class="flex items-start gap-8 py-8 transition-all duration-500 group-hover:pl-4">
							<span class="mt-1 text-base font-light tabular-nums tracking-[0.2em] text-slate-500 transition-colors duration-500 group-hover:text-slate-300">{String(i + 1).padStart(2, '0')}</span>
							<div class="flex-1">
								<h4 class="mb-2 text-3xl font-extralight text-white transition-colors duration-300 group-hover:text-slate-200">{item.title}</h4>
								<p class="max-w-xl text-[20px] font-light leading-relaxed text-slate-400">{item.desc}</p>
							</div>
							<span class="mt-2 text-slate-500 transition-all duration-500 group-hover:translate-x-1 group-hover:text-slate-300">&rarr;</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>


	<!-- ==================== INFRASTRUCTURE SECTION ==================== -->
	<section id="cap-infra" class="relative overflow-hidden">
		<div class="relative mx-auto flex min-h-screen max-w-6xl items-center px-8 py-32">
			<div class="grid w-full gap-12 lg:grid-cols-12 lg:gap-16">
				<!-- Items -->
				<div class="order-2 lg:order-1 lg:col-span-7">
					<div class="space-y-6">
						{#each [
							{ title: 'Resilient Engineering', desc: 'Design and development of infrastructure ecosystems capable of withstanding environmental and operational challenges.', num: '01' },
							{ title: 'Mechanical Services', desc: 'Precision fabrication, manufacturing, and assembly of complex components for large-scale industrial projects.', num: '02' }
						] as item}
							<div class="cap-item group relative overflow-hidden border border-slate-600 bg-slate-800/60 p-8 transition-all duration-500 hover:border-slate-500 hover:shadow-lg">
								<div class="flex items-start gap-6">
									<span class="mt-1 text-sm font-light tracking-[0.2em] text-slate-500 transition-colors duration-500 group-hover:text-slate-300">{item.num}</span>
									<div>
										<h4 class="mb-3 text-2xl font-light text-white transition-colors duration-300 group-hover:text-slate-200">{item.title}</h4>
										<p class="text-[20px] font-light leading-relaxed text-slate-400">{item.desc}</p>
									</div>
								</div>
								<div class="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-slate-400 to-transparent transition-all duration-700 group-hover:w-full"></div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Title -->
				<div class="order-1 lg:order-2 lg:col-span-5">
					<div class="lg:sticky lg:top-24">
						<div>
							<div class="cap-anim mb-6 flex items-center gap-4">
								<div class="cap-line h-px flex-1 bg-gradient-to-l from-slate-600 to-transparent"></div>
								<span class="flex h-12 w-12 items-center justify-center border border-slate-600 text-lg font-extralight text-slate-400">02</span>
							</div>
							<h3 class="cap-anim mb-4 text-5xl font-extralight leading-[1.2] text-white md:text-6xl lg:text-right">
								Sustainable<br/>
								Infrastructure<br/>
								<span class="text-slate-400">& Engineering</span>
							</h3>
							<p class="cap-anim text-2xl font-light text-slate-400 lg:text-right">Building systems that endure.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>


	<!-- ==================== INVESTMENTS SECTION ==================== -->
	<section id="cap-investments" class="relative flex min-h-screen items-center">
		<div class="mx-auto max-w-6xl px-8 py-32">
			<!-- Header centered -->
			<div class="mb-20 text-center">
				<div class="cap-anim mb-6 inline-flex items-center gap-4">
					<div class="h-px w-12 bg-gradient-to-r from-transparent to-slate-600"></div>
					<span class="flex h-12 w-12 items-center justify-center border border-slate-600 text-lg font-extralight text-slate-400">03</span>
					<div class="h-px w-12 bg-gradient-to-r from-slate-600 to-transparent"></div>
				</div>
				<h3 class="cap-anim mb-6 text-4xl font-extralight leading-[1.3] text-white md:text-5xl lg:text-7xl">Strategic Investments</h3>
				<p class="cap-anim mx-auto max-w-2xl text-2xl font-light leading-[1.8] text-slate-300 md:text-3xl">
					Capital with a conscience. We deploy disciplined capital to build industries that serve both shareholders and society.
				</p>
			</div>

			<!-- Three columns -->
			<div class="grid gap-8 md:grid-cols-3">
				{#each [
					{ title: 'Industrial Localization', desc: 'We invest directly in establishing local manufacturing facilities to ensure supply chain security and technology transfer.', num: '01' },
					{ title: 'Systemic Transformation', desc: 'Partnering with visionary enterprises to turn transformation into sustainable performance.', num: '02' },
					{ title: 'Strategic Partnerships', desc: 'Building strong relationships with global business partners to bring world-class technologies to the local market.', num: '03' }
				] as item}
					<div class="cap-item group overflow-hidden border border-slate-600/40 bg-slate-800/40 backdrop-blur-sm p-8 text-center transition-all duration-500 hover:border-slate-500 hover:bg-slate-800/60">
						<span class="mb-8 block text-7xl font-extralight text-slate-600 transition-colors duration-500 group-hover:text-slate-400">{item.num}</span>
						<h4 class="mb-4 text-2xl font-light text-white transition-colors duration-300 group-hover:text-slate-200">{item.title}</h4>
						<p class="text-[20px] font-light leading-relaxed text-slate-400">{item.desc}</p>
						<div class="mx-auto mt-6 h-px w-0 bg-gradient-to-r from-transparent via-slate-500 to-transparent transition-all duration-700 group-hover:w-full"></div>
					</div>
				{/each}
			</div>
		</div>
	</section>


	<!-- ==================== ENERGY SECTION ==================== -->
	<section id="cap-energy" class="relative overflow-hidden">
		<div class="relative mx-auto max-w-6xl px-8 py-32">
			<!-- Header -->
			<div class="mb-20 max-w-3xl">
				<div>
					<div class="cap-anim mb-6 flex items-center gap-4">
						<span class="flex h-12 w-12 items-center justify-center border border-slate-400 text-lg font-extralight text-slate-500">04</span>
						<div class="cap-line h-px flex-1 bg-gradient-to-r from-slate-400 to-transparent"></div>
					</div>
					<h3 class="cap-anim mb-6 text-5xl font-extralight leading-[1.2] text-slate-800 md:text-6xl">Energy & Renewables</h3>
					<p class="cap-anim text-2xl font-light leading-[1.8] text-slate-500 md:text-3xl">New power for a new era.</p>
				</div>
			</div>

			<!-- Two-column grid -->
			<div class="grid gap-12 md:grid-cols-2">
				{#each [
					{ title: 'Power Generation', desc: 'Comprehensive overhaul, maintenance, and parts supply for industrial turbines and power plants.', num: '01' },
					{ title: 'Heavy Engine Optimization', desc: 'Expert overhaul services for high-capacity engines used in the energy and logistics sectors.', num: '02' },
					{ title: 'Water Security', desc: 'Next-generation mobile desalination and purification systems ensuring water access.', num: '03' },
					{ title: 'Future Energy', desc: 'Implementing advanced technologies to support the shift toward cleaner, more efficient energy grids.', num: '04' }
				] as item}
					<div class="cap-item group">
						<span class="mb-4 block text-5xl font-extralight text-slate-300 transition-colors duration-500 group-hover:text-slate-500">{item.num}</span>
						<div class="border-t border-slate-300 pt-6 transition-colors duration-500 group-hover:border-slate-400">
							<h4 class="mb-3 text-2xl font-light text-slate-800 transition-colors duration-300 group-hover:text-slate-700">{item.title}</h4>
							<p class="text-[20px] font-light leading-relaxed text-slate-500">{item.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

		</div><!-- end content overlay -->
	</div><!-- end capabilities-wrapper -->


	<!-- ==================== ETHOS SECTION ==================== -->
	<section id="ethos" class="relative z-[20] bg-zinc-50">
		<div class="mx-auto max-w-5xl px-8 py-24">
			<div class="gsap-fade-up mb-16 text-center">
				<p class="mb-4 text-sm font-light tracking-[0.4em] text-slate-500 uppercase">Our Ethos</p>
				<h2 class="text-5xl font-extralight leading-[1.2] text-slate-800 md:text-6xl lg:text-7xl">Guiding Principles</h2>
			</div>

			<div class="gsap-flip-cards grid gap-12 md:grid-cols-3 md:gap-8">
				{#each [
					{ title: 'Foresight', desc: 'We stay up-to-date with global technological advancements to identify new products and solutions for the market.', symbol: 'I' },
					{ title: 'Balance', desc: 'We harmonize growth with responsibility, ensuring our work serves both shareholders and society.', symbol: 'II' },
					{ title: 'Commitment', desc: 'We do not just advise; we invest, align, and commit to the success of our partners.', symbol: 'III' }
				] as item, i}
					<div>
						<div class="group relative text-center">
							<div class="relative mx-auto mb-8 h-24 w-24">
								<div class="absolute inset-0 border border-slate-300 transition-all duration-700 group-hover:rotate-45 group-hover:scale-90"></div>
								<div class="absolute inset-0 border border-slate-200 transition-all duration-700 delay-100 group-hover:-rotate-45 group-hover:scale-110"></div>
								<div class="absolute inset-0 flex items-center justify-center">
									<span class="text-4xl font-extralight text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-slate-700">{item.symbol}</span>
								</div>
							</div>

							<h3 class="mb-4 text-2xl font-extralight text-slate-800 md:text-3xl">{item.title}</h3>
							<p class="text-base font-light leading-relaxed text-slate-500">{item.desc}</p>

							<div class="mx-auto mt-6 h-px w-0 bg-gradient-to-r from-transparent via-slate-400 to-transparent transition-all duration-700 group-hover:w-full"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>


	<!-- ==================== CONTACT SECTION ==================== -->
	<section id="contact" class="relative z-[20] overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100">
		<div class="relative mx-auto max-w-6xl px-8 py-32">
			<!-- Header -->
			<div class="gsap-contact-reveal mb-20 text-center">
				<p class="mb-10 text-base font-light tracking-[0.4em] text-slate-500 uppercase md:text-lg">Contact Us</p>
				<h2 class="mb-6 text-6xl font-extralight leading-[1.1] text-slate-800 md:text-7xl lg:text-9xl">
					<span class="contact-word inline-block">Let's</span>
					<span class="contact-word inline-block">build</span>
					<span class="contact-word inline-block">something</span>
				</h2>
				<h2 class="mb-16 text-6xl font-extralight leading-[1.1] text-slate-500 md:text-7xl lg:text-9xl">
					<span class="contact-word inline-block">that</span>
					<span class="contact-word inline-block">lasts.</span>
				</h2>
				<p class="mx-auto max-w-xl text-lg font-light leading-relaxed text-slate-500 md:text-xl">
					Ready to discuss how we can support your strategic objectives? Get in touch with our team.
				</p>
			</div>

			<!-- Form -->
			<div class="gsap-slide-up mx-auto max-w-3xl">
				<form onsubmit={handleFormSubmit} class="space-y-8">
					<!-- Name + Email row -->
					<div class="grid gap-8 md:grid-cols-2">
						<div class="group relative">
							<input
								type="text"
								bind:value={formName}
								required
								placeholder=" "
								class="peer w-full border-b border-slate-300 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
							/>
							<label class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
								Full Name
							</label>
						</div>
						<div class="group relative">
							<input
								type="email"
								bind:value={formEmail}
								required
								placeholder=" "
								class="peer w-full border-b border-slate-300 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
							/>
							<label class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
								Email Address
							</label>
						</div>
					</div>

					<!-- Company + Subject row -->
					<div class="grid gap-8 md:grid-cols-2">
						<div class="group relative">
							<input
								type="text"
								bind:value={formCompany}
								placeholder=" "
								class="peer w-full border-b border-slate-300 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
							/>
							<label class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
								Company / Organization
							</label>
						</div>
						<div class="group relative">
							<input
								type="text"
								bind:value={formSubject}
								required
								placeholder=" "
								class="peer w-full border-b border-slate-300 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
							/>
							<label class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
								Subject
							</label>
						</div>
					</div>

					<!-- Message -->
					<div class="group relative">
						<textarea
							bind:value={formMessage}
							required
							rows="5"
							placeholder=" "
							class="peer w-full resize-none border-b border-slate-300 bg-transparent pb-3 pt-6 text-lg font-light text-slate-800 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
						></textarea>
						<label class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
							Your Message
						</label>
					</div>

					<!-- Submit button -->
					<div class="flex flex-col-reverse items-center gap-6 pt-8 md:flex-row md:justify-between">
						<p class="text-sm font-light text-slate-400">
							{#if formStatus === 'sent'}
								Message sent successfully.
							{:else if formStatus === 'error'}
								Something went wrong. Please try again.
							{/if}
						</p>
						<div
							bind:this={magneticBtn}
							class="magnetic-btn-wrapper relative inline-block"
							onmousemove={handleMagneticMove}
							onmouseleave={handleMagneticLeave}
							role="presentation"
						>
							<button
								type="submit"
								disabled={formStatus === 'sending'}
								class="magnetic-btn group relative inline-flex overflow-hidden border border-slate-400 bg-slate-800 px-16 py-6 text-base font-light tracking-[0.3em] text-white uppercase backdrop-blur-sm transition-all duration-300 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
								style="transform: translate({btnX}px, {btnY}px)"
							>
								<span class="relative z-10 transition-transform duration-300 group-hover:scale-105">
									{#if formStatus === 'sending'}
										Sending...
									{:else if formStatus === 'sent'}
										Sent
									{:else}
										Send Message
									{/if}
								</span>
								<div class="absolute inset-0 -translate-y-full bg-slate-700 transition-transform duration-500 group-hover:translate-y-0"></div>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</section>

	<!-- ==================== FOOTER ==================== -->
	<footer class="relative z-[20] border-t border-stone-200 bg-stone-100">
		<div class="mx-auto max-w-6xl px-8 py-8">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<p class="text-sm font-light tracking-wide text-slate-500">Kleis Eschatos Group</p>
				<div class="flex gap-8">
					<a href="#about" class="text-xs font-light tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-slate-700">About</a>
					<a href="#contact" class="text-xs font-light tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-slate-700">Contact</a>
				</div>
				<p class="text-[10px] font-light tracking-[0.2em] text-slate-400">&copy; 2024 Kleis Eschatos Group</p>
			</div>
		</div>
	</footer>
</div>

<style>
	/* ==================== BASE STYLES ==================== */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* ==================== NAVBAR — LIQUID GLASS ==================== */
	.liquid-nav {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.25) 0%,
			rgba(255, 255, 255, 0.08) 40%,
			rgba(255, 255, 255, 0.15) 60%,
			rgba(255, 255, 255, 0.05) 100%
		);
		backdrop-filter: blur(24px) saturate(180%) brightness(1.1);
		-webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.1);
		border: 1px solid rgba(255, 255, 255, 0.35);
		box-shadow:
			0 0 0 0.5px rgba(255, 255, 255, 0.15) inset,
			0 1px 0 0 rgba(255, 255, 255, 0.4) inset,
			0 -1px 0 0 rgba(255, 255, 255, 0.1) inset,
			0 4px 16px rgba(0, 0, 0, 0.08),
			0 8px 40px rgba(0, 0, 0, 0.04);
	}

	.liquid-nav::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.3) 0%,
			rgba(255, 255, 255, 0.0) 50%
		);
		pointer-events: none;
		mask: linear-gradient(black, black) content-box, linear-gradient(black, black);
		mask-composite: exclude;
		-webkit-mask-composite: xor;
		padding: 1px;
	}

	.liquid-nav .nav-link {
		color: #1e293b;
	}
	.liquid-nav .nav-link:hover {
		color: #020617;
	}

	.liquid-nav.nav-dark {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.03) 40%,
			rgba(255, 255, 255, 0.06) 60%,
			rgba(255, 255, 255, 0.02) 100%
		);
		border-color: rgba(255, 255, 255, 0.15);
		box-shadow:
			0 0 0 0.5px rgba(255, 255, 255, 0.08) inset,
			0 1px 0 0 rgba(255, 255, 255, 0.15) inset,
			0 -1px 0 0 rgba(255, 255, 255, 0.05) inset,
			0 4px 16px rgba(0, 0, 0, 0.2),
			0 8px 40px rgba(0, 0, 0, 0.1);
	}

	.liquid-nav.nav-dark .nav-link {
		color: #f1f5f9;
	}
	.liquid-nav.nav-dark .nav-link:hover {
		color: #ffffff;
	}

	.nav-hidden {
		--tw-translate-y: -150%;
	}

	.mobile-menu-inner {
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s ease-in-out;
	}
	.mobile-menu-inner.mobile-menu-open {
		grid-template-rows: 1fr;
	}

	/* ==================== HERO ANIMATIONS ==================== */
	.loaded .hero-subtitle {
		animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
	}
	.loaded .hero-title {
		animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
	}
	.loaded .hero-subtitle-2 {
		animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
	}
	.loaded .hero-tagline {
		animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
	}

	@keyframes slideUp {
		to { transform: translateY(0); opacity: 1; }
	}
	@keyframes fadeUp {
		to { transform: translateY(0); opacity: 1; }
	}

	.scroll-indicator {
		animation: scrollPulse 2.5s ease-in-out infinite;
	}
	@keyframes scrollPulse {
		0%, 100% { opacity: 0.4; transform: translateY(0); }
		50% { opacity: 1; transform: translateY(5px); }
	}

	.text-gradient-light {
		background: linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(71, 85, 105) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* ==================== INVESTMENTS - Float animation ==================== */
	.float-card {
		animation: float 6s ease-in-out infinite;
	}
	.float-card:nth-child(2) { animation-delay: -2s; }
	.float-card:nth-child(3) { animation-delay: -4s; }

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	/* ==================== ENERGY - Pulse ring ==================== */
	.pulse-ring {
		animation: pulseRing 2s ease-out infinite;
	}
	@keyframes pulseRing {
		0% { transform: scale(1); opacity: 0.3; }
		100% { transform: scale(1.5); opacity: 0; }
	}

	.magnetic-btn {
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background-color 0.3s;
	}

	/* ==================== SELECTION ==================== */
	:global(::selection) {
		background: rgba(100, 116, 139, 0.2);
		color: rgb(30, 41, 59);
	}
</style>
