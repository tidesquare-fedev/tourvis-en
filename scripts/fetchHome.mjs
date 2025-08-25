// Node script to fetch Tourvis home data and print structure
import fs from 'node:fs'

async function main() {
  const url = 'https://dapi.tourvis.com/api/page/getPageInfo'
  const payload = {
    brand: 'TOURVIS',
    platform: 'A',
    productDetailYn: 'Y',
    showType: 'ETC',
    svcDivn: 'COMMON',
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  try {
    const json = JSON.parse(text)
    console.log('Top-level keys:', Object.keys(json))
    fs.writeFileSync('scripts/fetchHome.json', JSON.stringify(json, null, 2))
    console.log('Saved to scripts/fetchHome.json')
  } catch (e) {
    console.log('Non-JSON response:')
    console.log(text.slice(0, 1000))
  }
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})


