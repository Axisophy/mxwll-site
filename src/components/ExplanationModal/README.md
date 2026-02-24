# ExplanationModal Component

A reusable modal for presenting content at four expertise levels: child → student → undergraduate → expert.

## Purpose

Different audiences need different explanations. A child needs simple analogies. An undergraduate needs equations. An expert needs technical nuance. Showing the wrong level causes either boredom (too simple) or confusion (too complex) - cognitive scientists call this the **expertise reversal effect**.

This component lets you serve all audiences with the same content by letting them choose their level.

## Usage

```tsx
import { ExplanationModal } from '@/components/ExplanationModal'

const [isOpen, setIsOpen] = useState(false)

<ExplanationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Black Holes"
  subtitle="Objects so dense that nothing can escape"
  tiers={[
    {
      level: 'child',
      label: 'Simple',
      description: 'Anyone can understand',
      content: 'A black hole is like a cosmic vacuum cleaner - it sucks in everything nearby and nothing can escape, not even light!'
    },
    {
      level: 'student',
      label: 'Intuitive',
      description: 'High school level',
      content: 'When a massive star collapses, it creates a region where gravity is so strong that the escape velocity exceeds the speed of light. This is the event horizon.'
    },
    {
      level: 'undergraduate',
      label: 'Technical',
      description: 'University level',
      content: 'The Schwarzschild radius R_s = 2GM/c² defines the event horizon. For a solar mass black hole, R_s ≈ 3 km. Time dilation approaches infinity at the horizon.'
    },
    {
      level: 'expert',
      label: 'Advanced',
      description: 'Graduate/research level',
      content: 'Kerr metric describes rotating black holes. Frame-dragging in the ergosphere allows Penrose process for energy extraction. Hawking radiation implies black holes have entropy S = A/4 in Planck units.'
    }
  ]}
  defaultTier="student"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Called when modal should close |
| `title` | `string` | Yes | Modal heading |
| `subtitle` | `string` | No | Optional subtitle/tagline |
| `tiers` | `ExplanationTier[]` | Yes | Array of 1-4 explanation tiers |
| `defaultTier` | `'child' \| 'student' \| 'undergraduate' \| 'expert'` | No | Initial level (default: 'student') |

## Tier Structure

Each tier has:
- `level`: One of `'child' \| 'student' \| 'undergraduate' \| 'expert'`
- `label`: Display name for the tab (e.g., "Simple", "Intuitive")
- `description`: Shown below tabs (e.g., "Anyone can understand")
- `content`: String or React node with the explanation

## Cognitive Science Rationale

**Expertise Reversal Effect**: When beginners are shown expert explanations, they suffer cognitive overload. When experts are shown beginner explanations, they suffer redundancy. The optimal explanation depends on prior knowledge.

**Four Levels**:
1. **Child (8-12 years)**: Concrete analogies, everyday examples, no jargon
2. **Student (High school)**: First principles, qualitative reasoning, minimal math
3. **Undergraduate**: Equations, technical terms, quantitative reasoning
4. **Expert (Graduate/research)**: Full formalism, current research, subtleties

Not all content needs all four levels. Provide only the tiers that make sense for your subject matter.

## Design System

- Uses MXWLL font classes: `font-display` (headings), `font-nhg` (UI), `font-sabon` (prose), `font-input` (labels)
- Dark overlay with `bg-black/80 backdrop-blur-sm`
- White modal with `border-black/10`
- ESC key closes the modal
- Prevents body scroll when open
- Fully accessible with ARIA roles and labels

## Notes

- The four-level pattern was inspired by the Permissible Universe visualisation in the Maxwell archive
- Consider adding more levels if your audience warrants it (e.g., "researcher", "lay public")
- Don't force content into levels where it doesn't fit - omit levels that don't add value
- Content can be React nodes for rich formatting (images, diagrams, interactive elements)

## Related Reading

- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). "The Expertise Reversal Effect". *Educational Psychologist*, 38(1), 23-31.
- Cognitive Load Theory and the design of multi-level explanations
