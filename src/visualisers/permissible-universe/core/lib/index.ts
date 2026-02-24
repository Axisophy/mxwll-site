// ===========================================
// PERMISSIBLE UNIVERSE - LIB INDEX
// ===========================================

// Use centralized data from src/lib/data/cosmic-objects.ts
export {
  type CosmicObject,
  type ObjectCategory,
  type CategoryMeta,
  COSMIC_OBJECTS as ALL_OBJECTS,
  OBJECTS_MAP,
  getObject,
  searchObjects,
  CATEGORIES
} from '@/lib/data/cosmic-objects'

export * from './constants'
export * from './boundaries'
export * from './epochs'

// Re-export boundaries and epochs
export { BOUNDARIES, BOUNDARY_LIST, getBoundaryLogRadius } from './boundaries'
export { EPOCH_LIST, DOMINATION_LIST } from './epochs'
