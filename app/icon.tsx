import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 512,
    height: 512,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: 128, // Circle mask effect if needed, but standard is square
                }}
            >
                {/* Conceptual "Home Graph" Icon */}
                <svg
                    width="320"
                    height="320"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Abstract structure */}
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeOpacity="0.5" />

                    {/* Central Neural Node */}
                    <circle cx="12" cy="14" r="3" fill="white" stroke="none" />

                    {/* Connections / Graph */}
                    <circle cx="12" cy="14" r="6" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                    <path d="M12 8v3" strokeWidth="1" />
                    <path d="M12 17v2" strokeWidth="1" />
                    <path d="M7 14h2" strokeWidth="1" />
                    <path d="M15 14h2" strokeWidth="1" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
