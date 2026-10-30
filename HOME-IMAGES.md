# Welcome page images

The two welcome panels use local JPEG images. Replace the files below to change the images without changing the HTML or CSS. These are separate assets from the existing Digital website.

| Panel | File | Recommended replacement size |
| --- | --- | --- |
| Loobow Mosaic | `images/home/mosaic-cover.jpg` | **2400 × 1600 px** |
| Loobow Digital | `images/home/digital-video-still.jpg` | **1920 × 1080 px** |

- Use JPGs, ideally under 500 KB each. Keep the exact filenames above. WebP is also suitable if the image paths in the HTML are updated. Update the image's HTML width and height if the replacement has different dimensions.
- Keep the main subject near the centre. The panels crop the image to fill their area, with different crops on desktop and mobile. Avoid essential details close to the edges.
- Leave the lower third visually simple: the website adds the heading, description and link over a dark gradient. Do not add text or buttons to the image itself.
- The Mosaic image is the cover artwork extracted from the updated eight-page brochure (2567 × 1433 px). It is shared with the Mosaic hero.
- The Digital image is a static frame captured at **2.2 seconds** from the Digital hero video, `images/option2_vdo.mp4`, at its native **1920 × 1080 px** resolution. It also supplies the Digital video's poster image.
- Unused previous covers, duplicate campaign images, retired Mosaic samples, QR exports, template icons and favicon variants have been removed. The current assets above, the root `favicon.ico`, and all 15 dynamically loaded portfolio pages are retained.
- Change `.world--mosaic .world-image` or `.world--digital .world-image` in `css/welcome.css` if a replacement needs a different `object-position`.

## Page structure

- `index.html`: welcome page, served at `/`, with a white Loobow header, a primary Mosaic panel occupying 65% of the desktop width, and a secondary Digital panel occupying 35%. Phones show Mosaic first as the larger section and Digital below; short screens can scroll to keep the larger text readable.
- `digital.html`: original agency page with shared division navigation added, served at `/digital`.
- `mosaic.html`: full brochure-based Mosaic website, served at `/mosaic`, including the founder, craft, spaces, sample works, process, materials and enquiry form.
- `css/welcome.css`: welcome page styles.
- Both panels share the same title, Loobow prefix, description and link typography at each responsive breakpoint; Mosaic retains the larger panel area.
- `css/mosaic.css` / `js/mosaic.js`: the light Mosaic theme, mobile navigation, sample-work previews and enquiry form. See [MOSAIC-CONTENT.md](MOSAIC-CONTENT.md) for source assets.
- `css/divisions.css`: shared fixed division switch on Digital and Mosaic.
- `js/welcome.js`: routes old homepage section bookmarks (for example `/#work`) to `/digital#work`.
- `web.config` / `.htaccess`: IIS / Apache clean URL routing. See [ROUTING.md](ROUTING.md) for hosting and preview requirements.

The existing `css/agency.css` and `js/agency.js` are unchanged.
