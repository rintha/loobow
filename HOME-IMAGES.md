# Welcome page images

The two welcome panels use local JPEG images. Replace the files below to change the images without changing the HTML or CSS. These are separate assets from the existing Digital website.

| Panel | File | Recommended replacement size |
| --- | --- | --- |
| Loobow Mosaic | `images/home/mosaic.jpg` | **1600 × 1600 px** |
| Loobow Digital | `images/home/digital.jpg` | **1600 × 1600 px** |

- Use square JPGs, ideally under 500 KB each. Keep the exact filenames above. WebP is also suitable if the image paths in the HTML are updated.
- Keep the main subject near the centre. The panels crop the image to fill their area, with different crops on desktop and mobile. Avoid essential details close to the edges.
- Leave the lower third visually simple: the website adds the heading, description and link over a dark gradient. Do not add text or buttons to the image itself.
- The temporary Mosaic image is extracted from the supplied brochure (2567 × 1433 px). It is also used on the first-stage Mosaic introduction page. The temporary Digital image is a copy of the existing campaign collage (2000 × 1125 px).
- Change `.world--mosaic .world-image` or `.world--digital .world-image` in `css/welcome.css` if a replacement needs a different `object-position`.

## Page structure

- `index.html`: two-division welcome page, served at `/`.
- `digital.html`: original agency page with shared division navigation added, served at `/digital`.
- `mosaic.html`: full brochure-based Mosaic website, served at `/mosaic`, including the founder, craft, spaces, sample works, process, materials and enquiry form.
- `css/welcome.css`: welcome page styles.
- `css/mosaic.css` / `js/mosaic.js`: the light Mosaic theme, mobile navigation, sample-work previews and enquiry form. See [MOSAIC-CONTENT.md](MOSAIC-CONTENT.md) for source assets.
- `css/divisions.css`: shared fixed division switch on Digital and Mosaic.
- `js/welcome.js`: routes old homepage section bookmarks (for example `/#work`) to `/digital#work`.
- `web.config` / `.htaccess`: IIS / Apache clean URL routing. See [ROUTING.md](ROUTING.md) for hosting and preview requirements.

The existing `css/agency.css` and `js/agency.js` are unchanged.
