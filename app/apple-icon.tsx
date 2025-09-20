import { ImageResponse } from 'next/og'

// Apple touch icon
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF69B4 0%, #4ECDC4 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <g transform="translate(16, 16)">
            <path d="M -7,-6 L 7,-6 L 3,2 L 0,7 L -3,2 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"/>
            <line x1="0" y1="7" x2="0" y2="11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"/>
            <line x1="-4" y1="11" x2="4" y2="11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"/>
            <path d="M -5,-4 L 5,-4 L 2,1 L -2,1 Z"
                  fill="rgba(255,255,255,0.3)"/>
            <circle cx="6" cy="-6" r="3"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.2"/>
            <path d="M 4,-7 L 6,-6 L 4,-5"
                  fill="white"/>
            <rect x="-4" y="-9" width="1" height="8"
                  fill="white"
                  transform="rotate(-15)"/>
            <circle cx="-2" cy="-2" r="0.8" fill="white" opacity="0.6"/>
            <circle cx="3" cy="-1" r="0.5" fill="white" opacity="0.6"/>
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}