import { render, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom'
import Counter from './Counter.vue'

describe('Counter.vue', () => {
  it('renders button', () => {
    const { getByRole } = render(Counter)
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('increases count when button is clicked', async () => {
    const { getByText, getByRole } = render(Counter)
    await fireEvent.click(getByRole('button'))
    expect(getByText('count is: 1')).toBeInTheDocument()
  })
})
