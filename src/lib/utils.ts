
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Building calculation utilities
export const calculateWallArea = (length: number, width: number, height: number) => {
  // Calculate perimeter
  const perimeter = 2 * (length + width);
  // Calculate wall area (perimeter × height)
  return perimeter * height;
};

export const calculateFloorArea = (length: number, width: number) => {
  return length * width;
};

export const calculateRoofArea = (length: number, width: number, roofType: string) => {
  // Basic flat roof
  if (roofType === "flat") {
    return length * width;
  }
  // Gable roof (additional 15% for pitch)
  else if (roofType === "gable") {
    return length * width * 1.15;
  }
  // Hip roof (additional 30% for pitch and complexity)
  else if (roofType === "hip") {
    return length * width * 1.3;
  }
  return length * width;
};

type CementUsage = "plastering" | "bricklaying" | "flooring" | "foundation";

export const calculateCementBags = (area: number, thickness: number, usage: CementUsage) => {
  // Cement usage in bags per square meter at 1cm thickness
  const cementPerSqMeterPerCm = {
    "plastering": 0.07,
    "bricklaying": 0.12,
    "flooring": 0.09,
    "foundation": 0.15
  };
  
  return Math.ceil(area * (thickness / 100) * cementPerSqMeterPerCm[usage]);
};

export type BrickType = "standard" | "hollow" | "face";

export const calculateBricks = (wallArea: number, brickType: BrickType) => {
  // Bricks per square meter (including typical mortar thickness)
  const bricksPerSqMeter = {
    "standard": 50, // standard brick
    "hollow": 25,   // hollow blocks which are larger
    "face": 45      // face bricks with thinner mortar joints
  };
  
  return Math.ceil(wallArea * bricksPerSqMeter[brickType]);
};

export const calculatePaint = (wallArea: number, coats: number) => {
  // One liter covers approximately 10 square meters per coat
  const areaCoveredPerLiter = 10;
  return Math.ceil((wallArea * coats) / areaCoveredPerLiter);
};

export type TileSize = "small" | "medium" | "large";

export const calculateTiles = (floorArea: number, tileSize: TileSize) => {
  // Tiles per square meter based on size (including grout)
  const tilesPerSqMeter = {
    "small": 16,  // 25×25cm
    "medium": 4,  // 50×50cm
    "large": 1    // 100×100cm
  };
  
  // Add 10% extra for cutting and waste
  return Math.ceil(floorArea * tilesPerSqMeter[tileSize] * 1.1);
};
