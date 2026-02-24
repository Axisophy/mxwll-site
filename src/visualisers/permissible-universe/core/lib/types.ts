// ===========================================
// THE PERMISSIBLE UNIVERSE - TYPE DEFINITIONS
// ===========================================

// Import and re-export core types from centralized data
import type {
  CosmicObject as CosmicObjectBase,
  ObjectCategory as ObjectCategoryBase,
  CategoryMeta as CategoryMetaBase
} from '@/lib/data/cosmic-objects'

export type CosmicObject = CosmicObjectBase
export type ObjectCategory = ObjectCategoryBase
export type CategoryMeta = CategoryMetaBase

// Additional types specific to the visualisation

export interface Boundary {
  id: string
  name: string
  shortName: string
  equation: string
  equationExplained: string
  lineType: 'schwarzschild' | 'compton' | 'planck-vertical' | 'hubble-horizontal'
  slope?: number
  intercept?: number
  constantValue?: number
  forbiddenSide: 'above' | 'below' | 'left' | 'right'
  color: string
  fillColor: string
  dashPattern?: number[]
  explanations: {
    accessible: string
    intuitive: string
    technical: string
    advanced: string
  }
  counterfactual: string
  implications: string[]
  definingObjects: string[]
}

export interface Epoch {
  id: string
  name: string
  shortName: string
  timeAfterBigBang: string
  logTime: number
  temperature: string
  logTemperature: number
  energy: string
  logEnergy: number
  logRadiusIntercept: number
  description: string
  keyEvents: string[]
  dominantPhysics: string
  particlesPresent: string[]
  color: string
  labelPosition: { logR: number; logM: number }
}

export type DominationType = 'planckian' | 'radiation' | 'matter' | 'dark-energy'

export interface DominationEra {
  id: DominationType
  name: string
  symbol: string
  region: [number, number][]
  color: string
  description: string
  startTime?: string
  endTime?: string
}

export type ViewMode = 'map' | 'limits'

export interface ViewState {
  mode: ViewMode
  center: { logR: number; logM: number }
  zoom: number
  visibleCategories: Set<ObjectCategory>
  showEpochs: boolean
  showDomination: boolean
  showBoundaryLabels: boolean
  selectedObject: string | null
  selectedBoundary: string | null
  hoveredObject: string | null
  searchQuery: string
}

export interface ModalState {
  type: 'object' | 'boundary' | null
  id: string | null
  explanationLevel: 1 | 2 | 3 | 4
}

export interface ChartConfig {
  logRadiusRange: [number, number]
  logMassRange: [number, number]
  showMpcAxis: boolean
  showGeVAxis: boolean
  showSolarMassAxis: boolean
  gridSpacing: number
  minorGridSpacing: number
}

export interface TooltipData {
  type: 'object' | 'boundary'
  id: string
  position: { x: number; y: number }
}

export interface BigQuestion {
  id: string
  number: number
  title: string
  hook: string
  content: string
  relatedConcepts: string[]
  diagramHighlight?: {
    massMin: number
    massMax: number
    radiusMin: number
    radiusMax: number
  }
}

export interface DarkMatterCandidate {
  id: string
  name: string
  massMin: number
  massMax: number
  radiusMin: number
  radiusMax: number
  line: 'compton' | 'schwarzschild'
  motivation: string
  status: 'searching' | 'constrained' | 'ruled_out_partially'
  experiments: string[]
  description: string
}

export interface EMSpectrumBand {
  id: string
  label: string
  color: string
  massMin: number
  massMax: number
}
