import { NextResponse } from 'next/server'

export function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://www.fittersstudio.com/sitemap.xml

#DaumWebMasterTool:a2adf36c82934a69e2ae046dc871108ebb9a1a0d4aa52bdf55bf1becc3acb5b8:mw/Xf5RHiIQGISoi5Dg2Vw==`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
