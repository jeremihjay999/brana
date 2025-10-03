import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency with thousand separators
 * @param amount - The amount to format
 * @param currency - The currency symbol (default: "Ksh")
 * @returns Formatted currency string (e.g., "Ksh 1,000.00")
 */
export function formatCurrency(amount: number, currency: string = "Ksh"): string {
  return `${currency} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * Format a number with thousand separators without currency symbol
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "1,000.00")
 */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Sanitize HTML content to prevent XSS attacks while allowing safe HTML tags
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // Basic server-side sanitization for both server and client
  let sanitized = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/<object[^>]*>.*?<\/object>/gi, '') // Remove object tags
    .replace(/<embed[^>]*>/gi, '') // Remove embed tags
  
  // Check if we're in a browser environment for additional sanitization
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = sanitized
      
      // Define allowed tags and attributes
      const allowedTags = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'hr'
      ]
      const allowedAttributes = ['style', 'class']
      
      // Remove all script tags and event handlers
      const scripts = tempDiv.querySelectorAll('script')
      scripts.forEach(script => script.remove())
      
      // Remove all elements that are not in the allowed list
      const allElements = tempDiv.querySelectorAll('*')
      allElements.forEach(element => {
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
          element.remove()
        } else {
          // Remove all attributes except allowed ones
          const attributes = Array.from(element.attributes)
          attributes.forEach(attr => {
            if (!allowedAttributes.includes(attr.name) && !attr.name.startsWith('data-')) {
              element.removeAttribute(attr.name)
            }
          })
          
          // Remove any event handlers (onclick, onload, etc.)
          const eventHandlers = ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onfocus', 'onblur']
          eventHandlers.forEach(handler => {
            element.removeAttribute(handler)
          })
        }
      })
      
      sanitized = tempDiv.innerHTML
    } catch (error) {
      console.warn('Error during client-side HTML sanitization:', error)
      // Fall back to server-side sanitization
    }
  }
  
  return sanitized
}

/**
 * Clean and format HTML content for display
 * @param html - The HTML string to clean
 * @returns Cleaned HTML string
 */
export function cleanHtmlContent(html: string): string {
  if (!html) return ''
  
  // Remove excessive whitespace and normalize line breaks
  let cleaned = html
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim()
  
  // Fix common HTML issues from copy-paste
  cleaned = cleaned
    .replace(/<p[^>]*>\s*<\/p>/g, '') // Remove empty paragraphs
    .replace(/<li[^>]*>\s*<\/li>/g, '') // Remove empty list items
    .replace(/<ul[^>]*>\s*<\/ul>/g, '') // Remove empty unordered lists
    .replace(/<ol[^>]*>\s*<\/ol>/g, '') // Remove empty ordered lists
  
  return cleaned
}

/**
 * Strip HTML tags from text to get plain text content
 * @param html - The HTML string to strip tags from
 * @returns Plain text string
 */
export function stripHtmlTags(html: string): string {
  if (!html) return ''
  
  // Use regex to strip tags (works on both server and client)
  let text = html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&amp;/g, '&') // Decode common HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim()
  
  return text
}
