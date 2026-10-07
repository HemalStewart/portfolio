# Wayline sources

Wayline is a fictional logistics brand and portfolio concept by Hemal Herath.
This working revision is an independent motion study of https://unitedcarriers.com/.
The globe and animation/compositor code are independently implemented.
`study/` contains publicly served reference artwork: crane/truck sequences, vehicle parts,
clouds, map, stars and ocean texture. `study/manifest.json` records original URLs;
`sequences.json` lists local optimized frames. Reference artwork is credited to
United Carriers / Bearplus and is not claimed as original or as freely licensed stock.
The original reference application's domain-restricted script is not bundled or executed.
The six `*-v2.webp` generated substitutes are an abandoned local draft and are unused.

Derived crops (cut from the reference artwork above, same credit applies):
- `study/cont-white.webp`: the lifted white container, cropped from a reference crane frame.
- `study/crane-head.webp`, `study/crane-base.webp`: crane boom head and chassis, cropped
  from reference crane frames so the stack can be layered independently.
`water.js` draws the moving sea and foam procedurally over `study/ocean.jpg`.

Photography is used under the free Pexels license: https://www.pexels.com/license/

- port.jpg: Tom Fisk — https://www.pexels.com/photo/top-view-photography-of-cargo-ship-with-intermodal-containers-3057963/
- road.jpg: https://www.pexels.com/photo/a-trailer-truck-on-the-road-5410923/
- warehouse.jpg: Tiger Lily — https://www.pexels.com/photo/shelves-on-a-warehouse-4483608/
- containers.jpg: https://www.pexels.com/photo/an-aerial-photography-of-cargo-containers-near-the-ocean-7519262/

land.geojson: Natural Earth ne_110m_land, public domain.
https://www.naturalearthdata.com/about/terms-of-use/
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

The overall freight storytelling direction is inspired by United Carriers / Bearplus:
https://unitedcarriers.com/
Reference visual assets are included as credited study material. No carrier testimonials, statistics, logo or proprietary application code is included.

Fonts use open-license Chakra Petch (OFL-Chakra-Petch.txt), plus the portfolio's bundled Archivo and JetBrains Mono. The reference's BT Steinhart font is not bundled.
Three.js and Lenis reuse the portfolio's local vendor modules and license files.
