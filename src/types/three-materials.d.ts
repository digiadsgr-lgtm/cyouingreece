// Global JSX type declarations for custom Three.js materials (used in HeroSection.tsx)
// The `extend({ OceanMaterial })` call in @react-three/fiber requires this declaration
// to prevent TypeScript errors when using <oceanMaterial> as a JSX element.

declare namespace JSX {
  interface IntrinsicElements {
    oceanMaterial: React.PropsWithRef<{
      ref?: React.Ref<any>;
      side?: number;
      [key: string]: any;
    }>;
  }
}
