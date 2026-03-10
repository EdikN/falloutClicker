# Universal Cookie Loader

A standalone, framework-agnostic splash screen loader featuring a dynamic chocolate cookie fill animation. It is designed to be universally compatible with React, Vue, HTML5 games, Unity WebGL, and static sites.

## Integration

1.  **Include the script in your `index.html`** before your app initializes:
    ```html
    <script src="public/cookie-loader/cookie-loader.js"></script>
    ```

2.  **Update progress** while your assets/scripts load:
    ```javascript
    // Call this repeatedly during loading
    if (window.Splash) {
        window.Splash.setProgress(45); // Value between 0 and 100
    }
    ```

3.  **Hide the loader** when your app is fully ready:
    ```javascript
    if (window.Splash) {
        window.Splash.setProgress(100);
        setTimeout(() => window.Splash.hide(), 500); // Optional small delay for UX
    }
    ```

## Customization
The loader is pure JavaScript and injects its own CSS cleanly. You can easily modify the base colors, scale, or sizes in the `cookie-loader.js` file by tweaking the CSS variables / values directly in the template string.
