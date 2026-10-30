# Mosaic page content and assets

`mosaic.html` is served at `/mosaic`. Its copy, founder photo, sample images and visual direction come from `Loobow_Mosaic_Brochure_A4_Bifold_final.pdf`.

## Content

The page includes the brochure's About Us / founder story, five Our Craft services, eight Spaces We Transform applications, four process steps, five materials, tagline and contact copy. Gallery captions are descriptive names for the supplied images; they do not assert project locations, customers or completion details.

The brochure's Lato typefaces are loaded from the existing local font files. The Mosaic page uses its own cream, navy and gold stylesheet so the welcome page and Digital website retain their styling.

## Source images

The embedded JPEGs were extracted directly from the supplied PDF, without generating replacement imagery.

| Asset | Original size | PDF image object |
| --- | --- | --- |
| `images/mosaic/founder-anthony.jpg` | 362 × 642 | 19 |
| `images/mosaic/floral-wall.jpg` | 1002 × 661 | 14 |
| `images/mosaic/classical-panel.jpg` | 554 × 741 | 13 |
| `images/mosaic/botanical-cats.jpg` | 303 × 502 | 16 |
| `images/mosaic/koi-mosaic.jpg` | 364 × 488 | 17 |
| `images/mosaic/decorative-portrait.jpg` | 402 × 538 | 15 |
| `images/mosaic/garden-wall.jpg` | 364 × 488 | 18 |
| `images/home/mosaic.jpg` (hero) | 2567 × 1433 | 54 |

The six gallery images open at their full aspect ratio in a native dialog. The founder image is cropped to a circle using CSS; the source photo remains intact. Download/view links use the brochure copy at `public/loobow-mosaic-brochure.pdf`.

## Enquiry form

The Mosaic form reuses Digital's existing Web3Forms endpoint and access key. Its subject is **New Mosaic enquiry from loobow.com**, and the sender name is **Loobow Mosaic Website**. Fields are name, email and message, with the same honeypot approach as Digital.

`js/mosaic.js` validates required fields, prevents duplicate submissions, shows sending/success/error states, retains entered text after failures and aborts requests after 15 seconds. Browser checks simulate responses rather than sending live enquiries; live email delivery depends on the existing Web3Forms account configuration.

## Local preview

Restart VS Code Live Server after loading the workspace settings, then visit `/mosaic`. Both clean division routes are mapped in `.vscode/settings.json`. Production server instructions are in [ROUTING.md](ROUTING.md).
