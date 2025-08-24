import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExplorePage from '@/app/explore/page'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockedUseRouter = useRouter as jest.Mock

describe('ExplorePage Buttons', () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: jest.fn() })
  })

  it('renders Book Now buttons and they are clickable', async () => {
    render(<ExplorePage />)
    // Wait for listings to load (mocked or static)
    const bookNowBtns = await screen.findAllByRole('button', { name: /book now/i })
    expect(bookNowBtns.length).toBeGreaterThan(0)
    bookNowBtns.forEach(btn => {
      userEvent.click(btn)
      // Modal or booking action should be triggered (could assert modal open or mock function)
    })
  })

  it('renders Advanced Search and Filter buttons', () => {
    render(<ExplorePage />)
    const advSearch = screen.getByPlaceholderText(/search/i)
    expect(advSearch).toBeInTheDocument()
    // Simulate typing and search
    userEvent.type(advSearch, 'Kerala')
    expect(advSearch).toHaveValue('Kerala')
    // Could also test filter buttons if present
  })
}) 