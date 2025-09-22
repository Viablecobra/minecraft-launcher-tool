export interface Mod {
  id: string;
  name: string;
  description: string;
  packageId: string;
  version: string;
  category: string;
  icon?: string;
  downloadUrl?: string;
  isInstalled: boolean;
}

export const mods: Mod[] = [
  {
    id: "1",
    name: "Enhanced Graphics",
    description: "Improves visual quality with better textures and lighting",
    packageId: "com.example.graphics",
    version: "1.2.0",
    category: "Graphics",
    isInstalled: false,
  },
  {
    id: "2",
    name: "Performance Booster",
    description: "Optimizes game performance for better FPS",
    packageId: "com.example.performance",
    version: "2.1.0",
    category: "Performance",
    isInstalled: true,
  },
  {
    id: "3",
    name: "Custom UI Pack",
    description: "Modern interface design with improved navigation",
    packageId: "com.example.ui",
    version: "1.0.5",
    category: "Interface",
    isInstalled: false,
  },
  {
    id: "4",
    name: "Audio Enhancement",
    description: "High-quality sound effects and music",
    packageId: "com.example.audio",
    version: "1.3.2",
    category: "Audio",
    isInstalled: true,
  },
];

export const categories = Array.from(new Set(mods.map(mod => mod.category)));