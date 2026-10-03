"use client";

import { useEffect, useRef, useState } from "react";

export function EngineerScene() {
  const mount = useRef<HTMLDivElement>(null);
  const controller = useRef<{
    rotate: (delta: number) => void;
    reset: () => void;
    wireframe: (enabled: boolean) => void;
  } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  const [meshView, setMeshView] = useState(false);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    async function init() {
      const [T, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
      ]);
      if (disposed || !mount.current) return;
      const element = mount.current;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try {
        renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        setStatus("fallback");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFShadowMap;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, 0.1, 50);
      camera.position.set(3.1, 2.65, 5.8);
      camera.lookAt(0, 1.5, 0);
      const palette = getComputedStyle(element);
      scene.add(
        new T.HemisphereLight(
          "#ffffff",
          palette.getPropertyValue("--scene-ground").trim(),
          2.4,
        ),
      );
      const key = new T.DirectionalLight("#fff1df", 4);
      key.position.set(-3, 6, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -3;
      key.shadow.camera.right = 3;
      key.shadow.camera.top = 4;
      key.shadow.camera.bottom = -2;
      key.shadow.normalBias = 0.03;
      scene.add(key);
      const fill = new T.DirectionalLight(
        palette.getPropertyValue("--scene-rim").trim(),
        2,
      );
      fill.position.set(3, 4, -2);
      scene.add(fill);
      const ground = new T.Mesh(
        new T.PlaneGeometry(20, 20),
        new T.ShadowMaterial({ opacity: 0.06 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0.02;
      ground.receiveShadow = true;
      scene.add(ground);
      let model: InstanceType<typeof T.Group> | undefined;
      let head: InstanceType<typeof T.Object3D> | undefined;
      let frame = 0,
        visible = true,
        contextAvailable = true,
        target = -0.25,
        dragging = false,
        lastX = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const render = () => {
        frame = 0;
        if (
          disposed ||
          !visible ||
          !contextAvailable ||
          document.hidden ||
          !model
        )
          return;
        model.rotation.y = reduced.matches
          ? target
          : T.MathUtils.lerp(model.rotation.y, target, 0.14);
        renderer.render(scene, camera);
        if (Math.abs(model.rotation.y - target) > 0.001 && !reduced.matches)
          frame = requestAnimationFrame(render);
      };
      const invalidate = () => {
        if (!frame && visible && !document.hidden && !disposed)
          frame = requestAnimationFrame(render);
      };
      const resize = () => {
        const { width, height } = element.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        invalidate();
      };
      const down = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        dragging = true;
        lastX = e.clientX;
        element.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!model) return;
        if (dragging) {
          target += (e.clientX - lastX) * 0.009;
          lastX = e.clientX;
        } else if (head && !reduced.matches && e.pointerType === "mouse") {
          const rect = element.getBoundingClientRect();
          head.rotation.y = ((e.clientX - rect.left) / rect.width - 0.5) * 0.35;
          head.rotation.x = ((e.clientY - rect.top) / rect.height - 0.5) * 0.15;
        }
        invalidate();
      };
      const up = () => {
        dragging = false;
      };
      const leave = () => {
        if (head) {
          head.rotation.set(0, 0, 0);
          invalidate();
        }
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      const visibility = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) invalidate();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      visibility.observe(element);
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else invalidate();
      };
      const contextLost = (event: Event) => {
        event.preventDefault();
        contextAvailable = false;
        cancelAnimationFrame(frame);
        frame = 0;
        setStatus("fallback");
      };
      const contextRestored = () => {
        contextAvailable = true;
        setStatus("ready");
        invalidate();
      };
      element.addEventListener("pointerdown", down);
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerup", up);
      element.addEventListener("pointercancel", up);
      element.addEventListener("pointerleave", leave);
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      renderer.domElement.addEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      document.addEventListener("visibilitychange", onVisibility);
      reduced.addEventListener("change", invalidate);
      controller.current = {
        wireframe: (enabled) => {
          model?.traverse((object) => {
            if (object instanceof T.Mesh) {
              const list = Array.isArray(object.material)
                ? object.material
                : [object.material];
              list.forEach((material) => {
                if (material instanceof T.MeshStandardMaterial)
                  material.wireframe = enabled;
              });
            }
          });
          renderer.shadowMap.enabled = !enabled;
          ground.visible = !enabled;
          invalidate();
        },
        rotate: (delta) => {
          target += delta;
          invalidate();
        },
        reset: () => {
          target = -0.25;
          if (head) head.rotation.set(0, 0, 0);
          invalidate();
        },
      };
      const disposeScene = () => {
        scene.traverse((object) => {
          if (object instanceof T.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
      };
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibility.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduced.removeEventListener("change", invalidate);
        element.removeEventListener("pointerdown", down);
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerup", up);
        element.removeEventListener("pointercancel", up);
        element.removeEventListener("pointerleave", leave);
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          contextLost,
        );
        renderer.domElement.removeEventListener(
          "webglcontextrestored",
          contextRestored,
        );
        controller.current = null;
        disposeScene();
        renderer.dispose();
        renderer.domElement.remove();
      };
      try {
        const gltf = await new GLTFLoader().loadAsync(
          "/models/studio-engineer.glb",
        );
        if (disposed) {
          gltf.scene.traverse((object) => {
            if (object instanceof T.Mesh) {
              object.geometry.dispose();
              (Array.isArray(object.material)
                ? object.material
                : [object.material]
              ).forEach((m) => m.dispose());
            }
          });
          return;
        }
        model = gltf.scene;
        head = model.getObjectByName("Head");
        model.rotation.y = target;
        model.traverse((object) => {
          if (object instanceof T.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        scene.add(model);
        resize();
        setStatus("ready");
        invalidate();
      } catch {
        if (!disposed) setStatus("fallback");
      }
    }
    init().catch(() => {
      if (!disposed) setStatus("fallback");
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return (
    <div className="engineer-scene" data-status={status}>
      <div
        ref={mount}
        className="scene-canvas"
        role="img"
        aria-label="Interactive 3D engineer with a laptop, web interface, mobile device, and backend layers"
      />
      {status !== "ready" && (
        <div className="scene-fallback">
          <span aria-hidden="true">&lt;/&gt;</span>
          <p>
            {status === "fallback"
              ? "The 3D scene is unavailable on this device."
              : "Loading the 3D studio…"}
          </p>
          <noscript>
            Enable JavaScript to explore the 3D model. All portfolio content
            remains available below.
          </noscript>
        </div>
      )}
      <span
        className="scene-annotation scene-annotation-web"
        aria-hidden="true"
      >
        01 / Web
      </span>
      <span
        className="scene-annotation scene-annotation-mobile"
        aria-hidden="true"
      >
        02 / Mobile
      </span>
      <div className="scene-controls">
        <div
          className="scene-modes"
          role="group"
          aria-label="3D model display mode"
        >
          {[false, true].map((mesh) => (
            <button
              key={String(mesh)}
              type="button"
              disabled={status !== "ready"}
              aria-pressed={meshView === mesh}
              onClick={() => {
                setMeshView(mesh);
                controller.current?.wireframe(mesh);
              }}
            >
              {mesh ? "Mesh" : "Solid"}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Rotate character left"
          onClick={() => controller.current?.rotate(-0.5)}
        >
          ↶
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Reset character view"
          onClick={() => controller.current?.reset()}
        >
          Reset
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Rotate character right"
          onClick={() => controller.current?.rotate(0.5)}
        >
          ↷
        </button>
      </div>
    </div>
  );
}
