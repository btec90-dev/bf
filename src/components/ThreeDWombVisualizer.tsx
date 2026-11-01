import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, RotateCcw, Sparkles, Heart } from 'lucide-react';
import { TIMELINE_WEEKS } from '../data/pregnancyData';

interface Props {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export const ThreeDWombVisualizer: React.FC<Props> = ({ currentWeek, onWeekChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayingHeartbeat, setIsPlayingHeartbeat] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sacMesh: THREE.Mesh;
    fetusGroup: THREE.Group;
    cordMesh: THREE.Line;
    particles: THREE.Points;
    heartGlowMesh: THREE.Mesh;
    animationId: number;
  } | null>(null);

  // Play gentle synthetic stethoscope heartbeat using Web Audio API
  const toggleHeartbeat = () => {
    if (isPlayingHeartbeat) {
      if (heartbeatIntervalRef.current) {
        window.clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      setIsPlayingHeartbeat(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const playThump = (freq: number, duration: number, gainVal: number) => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        const filter = audioCtxRef.current.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, audioCtxRef.current.currentTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtxRef.current.currentTime + duration);

        gain.gain.setValueAtTime(gainVal, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
      };

      const triggerLubDub = () => {
        // Fetal heart rate ~140 bpm = 2.3 beats per sec (~430ms per cycle)
        playThump(85, 0.08, 0.25); // Lub
        window.setTimeout(() => {
          playThump(70, 0.09, 0.18); // Dub
        }, 110);
      };

      triggerLubDub();
      heartbeatIntervalRef.current = window.setInterval(triggerLubDub, 430);
      setIsPlayingHeartbeat(true);
    } catch {
      // Audio not supported or blocked
      setIsPlayingHeartbeat(false);
    }
  };

  useEffect(() => {
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffe4e6, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff8a9e, 2.0);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0xff6b81, 3, 15);
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    const blueRimLight = new THREE.PointLight(0xfb7185, 1.5, 20);
    blueRimLight.position.set(-6, -4, -4);
    scene.add(blueRimLight);

    // AMNIOTIC SAC (Translucent soft pearlescent egg)
    const sacGeo = new THREE.SphereGeometry(3.2, 48, 48);
    // Deform into slightly organic womb egg shape
    const pos = sacGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const scale = 1.0 + (y > 0 ? y * 0.08 : y * 0.04);
      pos.setX(i, pos.getX(i) * scale);
      pos.setZ(i, pos.getZ(i) * scale);
    }
    sacGeo.computeVertexNormals();

    const sacMat = new THREE.MeshPhysicalMaterial({
      color: 0xfda4af,
      transmission: 0.85,
      opacity: 0.45,
      transparent: true,
      roughness: 0.25,
      metalness: 0.1,
      ior: 1.33,
      thickness: 1.2,
      specularIntensity: 0.8,
      clearcoat: 0.6,
      side: THREE.DoubleSide,
    });
    const sacMesh = new THREE.Mesh(sacGeo, sacMat);
    scene.add(sacMesh);

    // FLOATING PARTICLES (Amniotic nutrients and soft light motes)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 0.5 + Math.random() * 2.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffedd5,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // FETUS GROUP
    const fetusGroup = new THREE.Group();
    scene.add(fetusGroup);

    // Fetal Material: soft pearlescent warm skin
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffcdb2,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.name = 'head';
    fetusGroup.add(headMesh);

    // Torso / Body (curved fetus posture)
    const bodyGeo = new THREE.SphereGeometry(0.65, 32, 32);
    bodyGeo.scale(0.9, 1.4, 0.85);
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
    bodyMesh.name = 'body';
    bodyMesh.position.set(0, -1.0, -0.15);
    bodyMesh.rotation.x = 0.25;
    fetusGroup.add(bodyMesh);

    // Limb buds / Arms & Legs
    const limbGeo = new THREE.CapsuleGeometry(0.18, 0.6, 16, 16);
    
    // Left Arm
    const leftArm = new THREE.Mesh(limbGeo, skinMat);
    leftArm.name = 'leftArm';
    leftArm.position.set(-0.55, -0.7, 0.3);
    leftArm.rotation.set(0.6, 0.4, 0.5);
    fetusGroup.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(limbGeo, skinMat);
    rightArm.name = 'rightArm';
    rightArm.position.set(0.55, -0.7, 0.3);
    rightArm.rotation.set(0.6, -0.4, -0.5);
    fetusGroup.add(rightArm);

    // Left Leg
    const leftLeg = new THREE.Mesh(limbGeo, skinMat);
    leftLeg.name = 'leftLeg';
    leftLeg.position.set(-0.4, -1.7, 0.4);
    leftLeg.rotation.set(1.1, 0.3, 0.2);
    fetusGroup.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(limbGeo, skinMat);
    rightLeg.name = 'rightLeg';
    rightLeg.position.set(0.4, -1.7, 0.4);
    rightLeg.rotation.set(1.1, -0.3, -0.2);
    fetusGroup.add(rightLeg);

    // Pulsing Heart Center
    const heartGeo = new THREE.SphereGeometry(0.2, 20, 20);
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: 0.85,
    });
    const heartGlowMesh = new THREE.Mesh(heartGeo, heartMat);
    heartGlowMesh.position.set(0, -0.7, 0.35);
    fetusGroup.add(heartGlowMesh);

    // UMBILICAL CORD (Curved tube/line connecting to placenta wall)
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.1, 0.3),
      new THREE.Vector3(0.6, -1.4, 0.8),
      new THREE.Vector3(1.4, -1.8, 1.2),
      new THREE.Vector3(2.2, -1.2, 1.7),
      new THREE.Vector3(2.7, 0.2, 1.9),
    ]);
    const cordPoints = cordCurve.getPoints(50);
    const cordGeo = new THREE.BufferGeometry().setFromPoints(cordPoints);
    const cordMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2.5 });
    const cordMesh = new THREE.Line(cordGeo, cordMat);
    scene.add(cordMesh);

    // Mouse / Touch Interaction for orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 380;
      if (newW === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // ResizeObserver for reliable Google Sites iframe & embed resizing
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / scene rotation interpolation
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.08;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.08;

      // Subtle natural floating womb undulation
      fetusGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;
      fetusGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.04;

      // Heartbeat pulse calculation (~140 bpm = 2.33 Hz)
      const pulse = 1.0 + Math.pow(Math.sin(elapsedTime * 7.5), 8) * 0.45;
      heartGlowMesh.scale.set(pulse, pulse, pulse);

      // Rotating floating particles
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      sacMesh,
      fetusGroup,
      cordMesh,
      particles,
      heartGlowMesh,
      animationId,
    };

    return () => {
      cancelAnimationFrame(animationId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.dispose();
      sacGeo.dispose();
      sacMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      headGeo.dispose();
      bodyGeo.dispose();
      skinMat.dispose();
    };
  }, []);

  // Update scale and anatomical visibility when currentWeek changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const { fetusGroup, cordMesh } = sceneRef.current;

    // Biological growth scale mapping from 1 SA to 40 SA
    // In early weeks (< 5 SA), microscopic / tiny grain
    // In mid weeks (20 SA), half size
    // In late weeks (38-40 SA), fills womb
    let scale = 0.15;
    if (currentWeek <= 3) {
      scale = 0.12;
    } else if (currentWeek <= 8) {
      scale = 0.2 + (currentWeek - 4) * 0.04;
    } else if (currentWeek <= 14) {
      scale = 0.38 + (currentWeek - 9) * 0.06;
    } else if (currentWeek <= 26) {
      scale = 0.72 + (currentWeek - 15) * 0.035;
    } else {
      scale = 1.1 + (currentWeek - 27) * 0.025;
    }

    fetusGroup.scale.set(scale, scale, scale);

    // Anatomical visibility: limb buds appear around week 6-8
    const leftArm = fetusGroup.getObjectByName('leftArm');
    const rightArm = fetusGroup.getObjectByName('rightArm');
    const leftLeg = fetusGroup.getObjectByName('leftLeg');
    const rightLeg = fetusGroup.getObjectByName('rightLeg');

    const hasLimbs = currentWeek >= 7;
    if (leftArm) leftArm.visible = hasLimbs;
    if (rightArm) rightArm.visible = hasLimbs;
    if (leftLeg) leftLeg.visible = hasLimbs;
    if (rightLeg) rightLeg.visible = hasLimbs;

    // Cord visible from week 4+
    cordMesh.visible = currentWeek >= 4;
  }, [currentWeek]);

  const weekInfo = TIMELINE_WEEKS.find((w) => w.week === currentWeek) || TIMELINE_WEEKS[21];

  const resetView = () => {
    if (sceneRef.current) {
      sceneRef.current.scene.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#382315] via-[#231a13] to-[#15100c] text-white overflow-hidden border border-[#5c402d] shadow-xl">
      {/* Top Header Overlay */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#eedacb] font-semibold">
              Vue Immersive &amp; Anatomique
            </span>
            <span className="text-xs text-[#eedacb]/60">·</span>
            <span className="text-[10px] sm:text-xs text-[#eedacb]/80 font-mono">3D WebGL</span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
            Dans le Ventre — Semaine {currentWeek} SA
          </h3>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto self-start sm:self-auto">
          <button
            onClick={toggleHeartbeat}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
              isPlayingHeartbeat
                ? 'bg-[#8a5732] text-white shadow-lg shadow-[#8a5732]/30 animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-[#f2e6dc] border border-white/10'
            }`}
            title="Activer le son du stéthoscope fœtal"
          >
            {isPlayingHeartbeat ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isPlayingHeartbeat ? 'Cœur (~140 bpm)' : 'Écouter le cœur'}</span>
          </button>

          <button
            onClick={resetView}
            type="button"
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#f2e6dc] border border-white/10 transition-colors cursor-pointer"
            title="Réinitialiser l'angle de vue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-[300px] sm:h-[380px] md:h-[420px] cursor-grab active:cursor-grabbing" />

      {/* Interactive Controls & Obstetric Metrics Strip */}
      <div className="p-3.5 sm:p-5 bg-[#231a13]/95 backdrop-blur-md border-t border-[#4a3424]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Week Selector Slider */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between text-xs text-[#eedacb] mb-1.5">
              <span className="font-medium text-[#eedacb]">Progression Gestationnelle :</span>
              <span className="font-mono text-white font-semibold">{currentWeek} SA / 40 SA</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={currentWeek}
              onChange={(e) => onWeekChange(Number(e.target.value))}
              className="w-full h-2 bg-[#423124] rounded-lg appearance-none cursor-pointer accent-[#8a5732]"
            />
            {/* Trimester Quick Jumps */}
            <div className="flex items-center justify-between mt-2 text-[11px] text-[#c4b5a6]">
              <button
                type="button"
                onClick={() => onWeekChange(12)}
                className={`hover:text-[#eedacb] transition-colors cursor-pointer ${currentWeek <= 13 ? 'text-[#eedacb] font-semibold' : ''}`}
              >
                T1 (1-13 SA)
              </button>
              <button
                type="button"
                onClick={() => onWeekChange(20)}
                className={`hover:text-[#eedacb] transition-colors cursor-pointer ${currentWeek >= 14 && currentWeek <= 26 ? 'text-[#eedacb] font-semibold' : ''}`}
              >
                T2 (14-26 SA)
              </button>
              <button
                type="button"
                onClick={() => onWeekChange(34)}
                className={`hover:text-[#eedacb] transition-colors cursor-pointer ${currentWeek >= 27 ? 'text-[#eedacb] font-semibold' : ''}`}
              >
                T3 (27-40 SA)
              </button>
            </div>
          </div>

          {/* Fruit / Object Comparator */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8a5732]/30 text-[#eedacb] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#eedacb]/80 uppercase tracking-wider block">Équivalent Taille</span>
              <p className="text-sm font-semibold text-white truncate">{weekInfo.sizeComparison}</p>
              <span className="text-xs text-[#c4b5a6] font-mono">{weekInfo.approxSize}</span>
            </div>
          </div>

          {/* Heart rate & Activity status */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8a5732]/30 text-[#eedacb] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 animate-pulse text-[#eedacb]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#eedacb]/80 uppercase tracking-wider block">Activité Cardiaque</span>
              <p className="text-sm font-semibold text-white">~140–160 bpm</p>
              <span className="text-xs text-[#c4b5a6]">Poche amniotique protectrice</span>
            </div>
          </div>
        </div>

        {/* Anatomical Summary Quote */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#eedacb] gap-2">
          <p className="line-clamp-2">
            <strong className="text-[#eedacb] font-medium">Développement fœtal : </strong>
            {weekInfo.fetalDevelopment}
          </p>
          <span className="shrink-0 text-[#c4b5a6] italic">Glissez pour faire pivoter la vue 3D</span>
        </div>
      </div>
    </div>
  );
};
