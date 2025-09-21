import { ImageResponse } from 'next/og'

// App icon
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 10L19 10L16 18L12 22L8 18L5 10Z"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="12" y1="22" x2="12" y2="24" stroke="white" strokeWidth="2"/>
          <line x1="8" y1="24" x2="16" y2="24" stroke="white" strokeWidth="2"/>
          <path d="M7 11L17 11L15 16L9 16L7 11Z" fill="rgba(255,255,255,0.3)"/>
          <circle cx="18" cy="8" r="2" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="8" y="4" width="1.5" height="10" fill="white" transform="rotate(-15 8 4)"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}