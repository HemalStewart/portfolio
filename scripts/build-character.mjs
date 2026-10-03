import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mkdir, writeFile } from "node:fs/promises";

globalThis.FileReader = class {
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.();
  }
};

const scene = new THREE.Scene();
const character = new THREE.Group();
character.name = "StudioEngineer";
scene.add(character);
const materials = Object.fromEntries(
  Object.entries({
    skin: "#e7b58f",
    jacket: "#ed7e49",
    trouser: "#4d4269",
    hair: "#28222a",
    cream: "#fff3dd",
    purple: "#ab8fcf",
    dark: "#262838",
    silver: "#deded8",
    green: "#99dcbd",
    screen: "#23283d",
    white: "#ffffff",
  }).map(([key, color]) => [
    key,
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.48,
      metalness: key === "silver" ? 0.4 : 0,
    }),
  ]),
);
const sphere = new THREE.SphereGeometry(1, 28, 20);
function ellipsoid(parent, name, xyz, scale, material) {
  const mesh = new THREE.Mesh(sphere, materials[material]);
  mesh.name = name;
  mesh.position.set(...xyz);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function box(parent, name, xyz, size, material, radius = 0.07) {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(...size, 3, radius),
    materials[material],
  );
  mesh.name = name;
  mesh.position.set(...xyz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function limb(name, start, end, radius, material) {
  const from = new THREE.Vector3(...start),
    to = new THREE.Vector3(...end);
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, from.distanceTo(to), 6, 16),
    materials[material],
  );
  mesh.name = name;
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    to.sub(from).normalize(),
  );
  mesh.castShadow = true;
  character.add(mesh);
}
box(character, "Seat", [0, 0.6, -0.1], [1.15, 1.05, 0.9], "purple", 0.12);
box(
  character,
  "SeatInset",
  [0, 0.62, 0.36],
  [0.65, 0.2, 0.035],
  "cream",
  0.025,
);
for (const side of [-1, 1]) {
  const x = side * 0.28;
  limb("Thigh", [x, 1.12, 0], [x, 0.95, 0.65], 0.18, "trouser");
  limb("Shin", [x, 0.88, 0.69], [x, 0.25, 0.85], 0.14, "trouser");
  box(character, "Sneaker", [x, 0.16, 0.98], [0.39, 0.26, 0.68], "cream", 0.09);
  box(
    character,
    "SneakerSole",
    [x, 0.065, 1],
    [0.4, 0.07, 0.69],
    "dark",
    0.025,
  );
  limb(
    "Sleeve",
    [side * 0.43, 1.76, 0.04],
    [side * 0.64, 1.4, 0.25],
    0.17,
    "jacket",
  );
  limb(
    "Forearm",
    [side * 0.65, 1.36, 0.28],
    [side * 0.45, 1.2, 0.77],
    0.12,
    "skin",
  );
  ellipsoid(
    character,
    "Hand",
    [side * 0.44, 1.24, 0.84],
    [0.15, 0.1, 0.14],
    "skin",
  );
}
ellipsoid(character, "Torso", [0, 1.57, 0], [0.48, 0.62, 0.32], "jacket");
box(
  character,
  "JacketZip",
  [0, 1.63, 0.318],
  [0.025, 0.7, 0.025],
  "cream",
  0.008,
);
ellipsoid(character, "Neck", [0, 2.02, 0], [0.16, 0.18, 0.15], "skin");
const head = new THREE.Group();
head.name = "Head";
head.position.set(0, 2.48, 0.025);
character.add(head);
ellipsoid(head, "Face", [0, 0, 0], [0.56, 0.6, 0.48], "skin");
ellipsoid(head, "Hair", [0, 0.36, -0.065], [0.57, 0.33, 0.47], "hair");
for (let i = 0; i < 6; i++)
  ellipsoid(
    head,
    "HairCurl",
    [
      Math.cos(i * 0.6) * 0.36,
      0.49 + Math.sin(i * 0.8) * 0.03,
      0.18 + Math.sin(i * 0.6) * 0.18,
    ],
    [0.16, 0.15, 0.16],
    "hair",
  );
ellipsoid(head, "Nose", [0, -0.03, 0.47], [0.075, 0.085, 0.1], "skin");
for (const side of [-1, 1]) {
  ellipsoid(head, "Ear", [side * 0.55, 0, 0], [0.1, 0.16, 0.095], "skin");
  ellipsoid(
    head,
    "Eye",
    [side * 0.19, 0.04, 0.442],
    [0.04, 0.055, 0.028],
    "dark",
  );
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.018, 8, 32),
    materials.dark,
  );
  frame.position.set(side * 0.19, 0.04, 0.465);
  frame.scale.y = 0.82;
  head.add(frame);
  box(
    head,
    "HeadphoneCup",
    [side * 0.59, 0.03, -0.035],
    [0.12, 0.32, 0.28],
    "purple",
    0.05,
  );
}
box(
  head,
  "GlassesBridge",
  [0, 0.045, 0.47],
  [0.12, 0.025, 0.025],
  "dark",
  0.008,
);
const band = new THREE.Mesh(
  new THREE.TorusGeometry(0.61, 0.035, 8, 40, Math.PI),
  materials.purple,
);
band.position.z = -0.07;
head.add(band);
const smile = new THREE.Mesh(
  new THREE.TorusGeometry(0.12, 0.015, 8, 24, Math.PI),
  materials.dark,
);
smile.position.set(0, -0.17, 0.455);
smile.rotation.z = Math.PI;
smile.scale.y = 0.45;
head.add(smile);
box(
  character,
  "LaptopBase",
  [0, 1.14, 0.65],
  [1.05, 0.07, 0.61],
  "silver",
  0.035,
);
const screen = box(
  character,
  "LaptopScreen",
  [0, 1.5, 0.84],
  [1.03, 0.67, 0.06],
  "silver",
  0.04,
);
screen.rotation.x = -0.15;
box(
  character,
  "Display",
  [0, 1.5, 0.883],
  [0.92, 0.55, 0.016],
  "screen",
  0.025,
);
for (let i = 0; i < 5; i++)
  box(
    character,
    "CodeLine",
    [i % 2 ? -0.04 : -0.16, 1.66 - i * 0.075, 0.9],
    [0.28 + (i % 3) * 0.12, 0.024, 0.008],
    i % 2 ? "purple" : "green",
    0.004,
  );
scene.updateMatrixWorld(true);
const data = await new GLTFExporter().parseAsync(scene, {
  binary: true,
  trs: true,
});
await mkdir(new URL("../public/models/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../public/models/studio-engineer.glb", import.meta.url),
  Buffer.from(data),
);
console.log(
  `Created original StudioEngineer GLB (${Math.round(data.byteLength / 1024)} KB)`,
);
