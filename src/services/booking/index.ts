import type { BookingService } from './BookingService'
import { MockBookingService } from './MockBookingService'

export const bookingService: BookingService = new MockBookingService()
