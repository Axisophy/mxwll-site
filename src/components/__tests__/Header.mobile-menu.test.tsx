import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type AnchorHTMLAttributes, type ReactNode } from 'react'
import { vi } from 'vitest'
import Header from '../Header'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  ),
}))

describe('Header mobile menu', () => {
  it('opens from the hamburger button and closes after clicking a mobile link', async () => {
    const user = userEvent.setup()
    const { container } = render(<Header />)

    const menu = container.querySelector('#mobile-menu')
    expect(menu).not.toBeNull()
    expect(menu).toHaveClass('opacity-0')

    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveClass('opacity-100')

    const mobileWorkLink = within(menu as HTMLElement).getByRole('link', { name: 'Work' })
    await user.click(mobileWorkLink)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveClass('opacity-0')
  })
})
