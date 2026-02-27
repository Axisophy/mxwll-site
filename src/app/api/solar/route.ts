import { NextRequest, NextResponse } from 'next/server';

// Helioviewer API endpoint
const HELIOVIEWER_API = 'https://api.helioviewer.org/v2/takeScreenshot/';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wavelength = searchParams.get('wavelength') || '171';
  const date = searchParams.get('date') || '2024-05-10T18:00:00Z';
  const _sourceId = searchParams.get('sourceId') || '10';
  const size = searchParams.get('size') || '1024';

  // Build the layer string for AIA
  const layer = `[SDO,AIA,AIA,${wavelength},1,100]`;

  // Construct Helioviewer API URL
  const params = new URLSearchParams({
    date: date,
    layers: layer,
    imageScale: '1.2',
    x0: '0',
    y0: '0',
    width: size,
    height: size,
    watermark: 'false',
    display: 'true',
  });

  const helioviewerUrl = `${HELIOVIEWER_API}?${params.toString()}`;

  try {
    const response = await fetch(helioviewerUrl, {
      headers: {
        'Accept': 'image/png,image/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Helioviewer API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching from Helioviewer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solar image' },
      { status: 500 }
    );
  }
}
