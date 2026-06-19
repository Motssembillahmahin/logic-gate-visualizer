import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CPULayer from './CPULayer.jsx'

describe('CPULayer', () => {
  it('always shows its title', () => {
    render(<CPULayer title="Fetch" isOpen={false} onToggle={() => {}}>body</CPULayer>)
    expect(screen.getByText('Fetch')).toBeInTheDocument()
  })

  it('shows its body only when open', () => {
    const { rerender } = render(
      <CPULayer title="Decode" isOpen={false} onToggle={() => {}}>
        <p>register values</p>
      </CPULayer>,
    )
    expect(screen.queryByText('register values')).not.toBeInTheDocument()
    rerender(
      <CPULayer title="Decode" isOpen onToggle={() => {}}>
        <p>register values</p>
      </CPULayer>,
    )
    expect(screen.getByText('register values')).toBeInTheDocument()
  })

  it('calls onToggle when the header is clicked and not locked', () => {
    const onToggle = vi.fn()
    render(<CPULayer title="Execute" isOpen={false} onToggle={onToggle}>body</CPULayer>)
    fireEvent.click(screen.getByRole('button', { name: /Execute/i }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('does not open when locked (enforces the learning sequence)', () => {
    const onToggle = vi.fn()
    render(<CPULayer title="Writeback" isOpen={false} locked onToggle={onToggle}>body</CPULayer>)
    fireEvent.click(screen.getByRole('button', { name: /Writeback/i }))
    expect(onToggle).not.toHaveBeenCalled()
    expect(screen.getByTestId('cpu-layer')).toHaveAttribute('data-locked', 'true')
  })
})
