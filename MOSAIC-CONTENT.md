# Mosaic page content and assets

`mosaic.html` is served at `/mosaic`. Its current copy, collections and cover artwork follow the updated `Loobow_Mosaic_Brochure_A4_Bifold_8pages.pdf`. The cream, navy and gold theme and recent compact header styling are retained.

## Content

The page includes the revised founder story, five craft services (including Custom Portraits & Name Plaques), eight spaces, four process steps and seven detailed materials. The work is organised into Bespoke & Contemporary, Byzantine-Inspired, Architectural Mosaics and Personal Work. The first three collections have 16 enlarged-image previews; Custom Pieces has eight static photos. The six Byzantine-inspired examples include the dimensions, materials and descriptions printed in the new brochure.

Byzantine-inspired pieces use rectangular cards with white footers: the artwork name and a larger, bold gold size line appear on the left, with a plain View details ↗ control on the right. Images fill consistent 3:4 frames; the earth-tone Krishna thumbnail uses a CSS crop to match the brochure's close-up of the artwork. Source images remain intact. Materials and descriptions are stored in each card's HTML template and displayed in the preview dialog. The popup leads with the size in larger, bold gold type and puts the artwork name below in smaller text, without a dash between them. The dialog places details beside the image on desktop and below it on smaller screens, and clears them when moving to another collection.

Material wording follows the update: **gold-effect / imitation gold smalti**, rather than the earlier brochure's gold-leaf wording. New content includes studio photographs, custom-piece enquiry links and WhatsApp/Instagram icon links. Gallery captions are descriptive names; they do not assert project locations, customers or completion details. Custom Pieces has no visible captions or preview controls.

Bespoke & Contemporary follows the brochure's full-width feature image above the seascape, eagle and tall garden mosaic grouping. The floral wall and classical panel form a further wide / portrait row. Bespoke and Architectural image titles appear at the bottom-left over a navy gradient, with arrows at the top-right, on hover or keyboard focus. On touch screens, tapping an image opens its preview while the resting image stays free of captions and controls. Phones reflow the smaller pieces into pairs and give tall pieces a full row. The brochure link is a solid navy button; the collection shortcut buttons have been removed. Image numbering is omitted from all Mosaic collections and from the preview dialog.

Header links follow the page order: About, Our Craft, Sample Works, Spaces, Process, then the contact button. Active-link underlines match the full text width with a small gap below the label, including in the mobile menu. The contact button stays filled while the contact section is active and has no underline. Section labels use 14–18 px type with tighter tracking; headings, gold rules and section padding use smaller gaps on desktop and mobile.

The brochure's Lato typefaces are loaded from the existing local font files. The Mosaic page uses its own cream, navy and gold stylesheet so the welcome page and Digital website retain their styling.

The Mosaic hero uses the brochure cover as a full-width background under a navy gradient, with centered cream and gold text. A gold button opens Sample Works, and an outlined button downloads the brochure. The hero fills the available screen below the header and can grow on short screens to keep its content readable.

Main CTA buttons share a left-to-right hover/focus sweep and bare arrow transformations, including the header contact button, brochure, custom-piece and enquiry buttons. Their existing colors and rectangular shapes are retained. Disabled enquiry buttons do not animate; reduced-motion settings remove the transitions.

## Source images

The embedded JPEGs were extracted directly from the supplied PDFs, without generating replacement imagery. The existing higher-resolution founder, floral wall and classical panel photographs remain from the original brochure.

| Asset | Original size | PDF image object |
| --- | --- | --- |
| `images/mosaic/founder-anthony.jpg` | 362 × 642 | 19 |
| `images/mosaic/floral-wall.jpg` | 1002 × 661 | 14 |
| `images/mosaic/classical-panel.jpg` | 554 × 741 | 13 |
| `images/home/mosaic-cover.jpg` (new cover, both homepages) | 2567 × 1433 | 108 in the updated PDF |

Updated collection and workshop images are under `images/mosaic/updated/`:

| Updated PDF objects | Assets |
| --- | --- |
| 24, 23, 28, 26, 27 | Abstract calligraphy wall, seascape room, seascape panel, eagle mosaic, garden wall |
| 34, 32, 33, 35, 37, 36 | Islamic medallion, Virgin Mary, Krishna in blue, Arabic calligraphy, Krishna in earth tones, quatrefoil medallion |
| 44, 45, 48, 47 | Architectural wall, floral panel, koi pool, floor medallion |
| 53, 55, 56 | Cutting tesserae, drawing the design, laying the mosaic |
| 66, 62, 65, 63, 64, 61, 60, 67 | Botanical cats, dog portrait, child portrait, name plaque, club emblem, date palm, planters, bird mosaic |

The contact section uses inline SVG icons with labeled links: WhatsApp opens `https://wa.me/971557991690`, and Instagram opens `https://www.instagram.com/loobowmosaic/`. Unused QR image exports and superseded Mosaic samples have been removed; the QR artwork remains embedded in the brochure PDF. The footer's contact column contains email and phone links. A navy-and-gold floating back-to-top button follows Digital's behavior, appearing after 600 px of scrolling and respecting reduced-motion preferences.

The 16 interactive gallery samples open at their full aspect ratio in the existing native dialog. Custom Pieces follows the brochure's three / two / three arrangement, with equal portrait frames and wider landscape frames. On phones up to 540 px wide, portraits form pairs and the two landscape photos each fill a row; the date palm moves alongside the child portrait to keep every row filled. These eight photos are excluded from the preview carousel. The founder remains cropped to a circle using CSS; its source photo is intact. Download/view links use `public/loobow-mosaic-brochure-8pages.pdf`, and the current cover is `images/home/mosaic-cover.jpg`.

## Enquiry form

The Mosaic form reuses Digital's existing Web3Forms endpoint and access key. Its subject is **New Mosaic enquiry from loobow.com**, and the sender name is **Loobow Mosaic Website**. Fields are name, email and message, with the same honeypot approach as Digital.

`js/mosaic.js` validates required fields, prevents duplicate submissions, shows sending/success/error states, retains entered text after failures and aborts requests after 15 seconds. Browser checks simulate responses rather than sending live enquiries; live email delivery depends on the existing Web3Forms account configuration.

## Local preview

Restart VS Code Live Server after loading the workspace settings, then visit `/mosaic`. Both clean division routes are mapped in `.vscode/settings.json`. Production server instructions are in [ROUTING.md](ROUTING.md).
