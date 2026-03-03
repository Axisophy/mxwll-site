'use client'

// ===========================================
// THE PERMISSIBLE UNIVERSE (Simplified)
// ===========================================
// Interactive mass-radius diagram - just The Map

import React, { useState, useCallback } from 'react'
import { ModalState } from './lib/types'
import {
  ALL_OBJECTS,
  getObject,
  INITIAL_VIEW,
  BOUNDARY_LIST,
  BOUNDARIES,
} from './lib/index'
import { CosmicDiagram, ObjectModal, BoundaryModal } from './components'

export default function PermissibleUniversePage() {
  const [modal, setModal] = useState<ModalState>({
    type: null,
    id: null,
    explanationLevel: 1,
  })

  const handleObjectClick = useCallback((id: string) => {
    setModal({ type: 'object', id, explanationLevel: 1 })
  }, [])

  const handleBoundaryClick = useCallback((id: string) => {
    setModal({ type: 'boundary', id, explanationLevel: 1 })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal({ type: null, id: null, explanationLevel: 1 })
  }, [])

  const handleExplanationLevelChange = useCallback((level: 1 | 2 | 3 | 4) => {
    setModal(prev => ({ ...prev, explanationLevel: level }))
  }, [])

  return (
    <div className="w-full h-full relative">
      <CosmicDiagram
        objects={ALL_OBJECTS}
        boundaries={BOUNDARY_LIST}
        showEpochs={false}
        showDomination={false}
        showTimeView={false}
        showDarkMatter={false}
        showEMSpectrum={false}
        darkMatterCandidates={[]}
        emSpectrum={[]}
        onObjectClick={handleObjectClick}
        onObjectHover={() => {}}
        onBoundaryClick={handleBoundaryClick}
        initialView={INITIAL_VIEW}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs max-w-xs">
        <div className="font-medium text-white/80 mb-2">Forbidden Zones</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-800"></div>
            <span className="text-white/60">Schwarzschild (black hole)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-800"></div>
            <span className="text-white/60">Compton (quantum limit)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-500 opacity-50" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-white/60">Planck scale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-teal-800 opacity-50"></div>
            <span className="text-white/60">Hubble radius</span>
          </div>
        </div>
      </div>

      {/* Object count */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/40 font-nhg">
        {ALL_OBJECTS.length} objects
      </div>

      {/* Object Modal */}
      {modal.type === 'object' && modal.id && (
        <ObjectModal
          object={getObject(modal.id)!}
          explanationLevel={modal.explanationLevel}
          onLevelChange={handleExplanationLevelChange}
          onClose={handleCloseModal}
          onObjectClick={handleObjectClick}
        />
      )}

      {/* Boundary Modal */}
      {modal.type === 'boundary' && modal.id && (
        <BoundaryModal
          boundary={BOUNDARIES[modal.id]}
          explanationLevel={modal.explanationLevel}
          onLevelChange={handleExplanationLevelChange}
          onClose={handleCloseModal}
          onObjectClick={handleObjectClick}
        />
      )}
    </div>
  )
}
