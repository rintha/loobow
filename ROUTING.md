# Clean page URLs

| Public URL | HTML file served internally |
| --- | --- |
| `https://loobow.com/` | `index.html` |
| `https://loobow.com/digital` | `digital.html` |
| `https://loobow.com/mosaic` | `mosaic.html` |

Navigation and canonical metadata use these public URLs. The page contents, CSS and agency JavaScript remain in their existing files; no React migration is needed.

## Hosting

Upload the updated HTML, JavaScript and routing configuration files to the website's document root.

- **IIS / Windows hosting:** `web.config` uses the [Microsoft URL Rewrite module](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/url-rewrite-module-configuration-reference). The host must have this module installed and allow site-level rewrite rules. The previous ASP.NET configuration is preserved.
- **Apache hosting:** `.htaccess` provides matching rules using [mod_rewrite](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html). The host must enable that module and allow rewrite directives in `.htaccess` (`AllowOverride FileInfo`, or equivalent). Include the hidden `.htaccess` file when uploading.
- **Other servers:** equivalent routing is needed in that server's configuration; these files do not configure Nginx or static hosting platforms that ignore both files.

Only the three named pages are routed. Assets and unrelated URLs retain normal server handling; unknown paths are not rewritten to the homepage.

## Redirects and bookmarks

- `/index.html` permanently redirects to `/`.
- `/digital.html` and `/mosaic.html` permanently redirect to `/digital` and `/mosaic`.
- `/digital/` and `/mosaic/` permanently redirect to the corresponding URL without a trailing slash, keeping relative asset paths correct.
- Redirects preserve query strings. Browsers retain fragment identifiers when following these redirects, so division bookmarks such as `/digital.html#work` continue to point to the same section.
- Older homepage section links such as `/?source=bookmark#work` are forwarded by `js/welcome.js` to `/digital?source=bookmark#work`.

## Local preview and verification

### VS Code Live Server

The workspace settings in `.vscode/settings.json` map `/digital` and `/mosaic` to their HTML files for the Live Server extension. These local mappings let the existing clean navigation work without installing another server.

1. Open this project folder in VS Code.
2. Stop Live Server if it is already running, then click **Go Live** again so it loads the workspace mappings.
3. Open the local welcome page (normally `http://127.0.0.1:5500/`) and click either division. Direct visits and refreshes at `/digital` and `/mosaic` work as well.

Live Server mappings serve these two pages locally; the production redirects from `.html` URLs and trailing slashes remain the responsibility of IIS or Apache. Use the clean paths without a trailing slash for local preview.

### Other preview servers

Use an HTTP server that supports the rewrite rules, with this checkout mounted at the server root. Opening an HTML file directly, or using a basic static preview server that ignores both the hosting configuration and Live Server workspace settings, will not resolve `/digital` and `/mosaic`.

After uploading, verify the three public URLs, refresh each division directly, follow the division switch, and check the old `.html` addresses redirect once to the clean URLs. Also check `/digital?source=check#work` and `/mosaic/` so query strings, section links and asset paths are exercised.
