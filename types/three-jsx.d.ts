import { Object3DNode } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>
      sprite: Object3DNode<THREE.Sprite, typeof THREE.Sprite>
      spriteMaterial: Object3DNode<THREE.SpriteMaterial, typeof THREE.SpriteMaterial>
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>
      meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
      color: Object3DNode<THREE.Color, typeof THREE.Color>
    }
  }
} 