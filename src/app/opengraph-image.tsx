import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'STUDYSPOT — Find a place to study at VT';

/** Generated at build time so pasting the link anywhere yields a real card. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#101418',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, color: '#E5751F', letterSpacing: 4 }}>STUDYSPOT</div>
        <div style={{ fontSize: 64, color: '#F4F6F8', marginTop: 28, lineHeight: 1.15 }}>
          Find a place to study at VT
        </div>
        <div style={{ fontSize: 28, color: '#F4F6F8', opacity: 0.72, marginTop: 30, lineHeight: 1.4 }}>
          Live seat availability across Virginia Tech libraries and study spaces.
        </div>
      </div>
    ),
    size,
  );
}
