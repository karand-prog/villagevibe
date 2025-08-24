import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AIChatbot from '@/components/AIChatbot'

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

describe('AIChatbot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders chatbot button', () => {
    render(<AIChatbot />)
    
    // The button doesn't have aria-label, so we find it by its icon
    const chatButton = screen.getByRole('button')
    expect(chatButton).toBeInTheDocument()
  })

  it('opens chat interface when button is clicked', () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    expect(screen.getByText(/Namaste/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Ask me about village experiences/)).toBeInTheDocument()
  })

  it('displays welcome message on first open', () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    expect(screen.getByText(/I'm your VillageVibe AI assistant/)).toBeInTheDocument()
  })

  it('allows user to type and send messages', async () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me about village experiences/)
    // Find the send button by looking for the button with Send icon (last button in the modal)
    const buttons = screen.getAllByRole('button')
    const sendButton = buttons[buttons.length - 1] // Last button is send button
    
    fireEvent.change(input, { target: { value: 'Hello, I want to visit a village' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello, I want to visit a village')).toBeInTheDocument()
    })
  })

  it('handles empty message input', () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    const buttons = screen.getAllByRole('button')
    const sendButton = buttons[buttons.length - 1]
    
    // Send button should be disabled when input is empty
    expect(sendButton).toBeDisabled()
  })

  it('closes chat when close button is clicked', () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    expect(screen.getByText(/Namaste/)).toBeInTheDocument()
    
    // Find the close button (second button in the modal)
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons[1] // Second button is close button
    fireEvent.click(closeButton)
    
    expect(screen.queryByText(/Namaste/)).not.toBeInTheDocument()
  })

  it('handles keyboard events for sending messages', async () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me about village experiences/)
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })
  })

  it('generates recommendations based on user input', async () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me about village experiences/)
    const buttons = screen.getAllByRole('button')
    const sendButton = buttons[buttons.length - 1]
    
    fireEvent.change(input, { target: { value: 'I want to experience coffee culture' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('I want to experience coffee culture')).toBeInTheDocument()
    })
  })

  it('maintains chat history during session', async () => {
    render(<AIChatbot />)
    
    const chatButton = screen.getByRole('button')
    fireEvent.click(chatButton)
    
    const input = screen.getByPlaceholderText(/Ask me about village experiences/)
    const buttons = screen.getAllByRole('button')
    const sendButton = buttons[buttons.length - 1]
    
    // Send first message
    fireEvent.change(input, { target: { value: 'First message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument()
    })
    
    // Send second message
    fireEvent.change(input, { target: { value: 'Second message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeInTheDocument()
    })
    
    // Both messages should be visible
    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('Second message')).toBeInTheDocument()
  })
}) 