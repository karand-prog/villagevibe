import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ListingDetailsPage from '@/app/explore/[id]/page'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockedUseRouter = useRouter as jest.Mock

describe('ListingDetailsPage Buttons', () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: jest.fn() })
  })

  it('renders Book Now button and it is clickable', async () => {
    render(<ListingDetailsPage />)
    const bookNowBtn = await screen.findByRole('button', { name: /book now/i })
    userEvent.click(bookNowBtn)
    // Modal or booking action should be triggered
  })

  it('renders Contact Host button and it is clickable', async () => {
    render(<ListingDetailsPage />)
    const contactBtn = await screen.findByRole('button', { name: /contact host/i })
    userEvent.click(contactBtn)
    // Contact modal/action should be triggered
  })

  it('renders Write Review button and it is clickable', async () => {
    render(<ListingDetailsPage />)
    const writeReviewBtn = await screen.findByRole('button', { name: /write a review|write the first review/i })
    userEvent.click(writeReviewBtn)
    // Review modal/action should be triggered
  })
}) 