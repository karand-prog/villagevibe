import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsPage from '@/app/settings/page'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockedUseRouter = useRouter as jest.Mock

describe('SettingsPage Buttons', () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: jest.fn() })
  })

  it('renders Save Preferences button and it is clickable', async () => {
    render(<SettingsPage />)
    const saveBtn = await screen.findByRole('button', { name: /save preferences/i })
    userEvent.click(saveBtn)
    // Preferences should be saved (could check for success message)
  })

  it('renders notification toggles and they are clickable', async () => {
    render(<SettingsPage />)
    const toggles = await screen.findAllByRole('checkbox')
    toggles.forEach(toggle => {
      userEvent.click(toggle)
      // State should change
    })
  })
}) 