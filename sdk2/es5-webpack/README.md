# XeoKit SDK CommonJS Webpack Example

This example demonstrates how to use the XeoKit SDK with CommonJS modules and Webpack.

## Features

- Uses CommonJS imports with require()
- Uses XeoKit SDK's CJS bundle
- Includes all the Webpack polyfills needed for browser compatibility
- Includes a sample viewer with various loaders for different 3D model formats

## Setup

1. Install dependencies:
```
npm install
```

2. Build the project:
```
npm run build
```

3. Start the development server:
```
npm run start
```

4. Run web server:
```
cd dist
npx http-server
```

## Files

- `webpack.config.js` - Webpack configuration with CommonJS module support
- `src/index.js` - Entry point that requires the viewer module
- `src/viewer.js` - Main viewer implementation using CommonJS imports
- `src/index.html` - HTML template with the canvas and UI elements

## Usage

Once running, the viewer will:
1. Load a 3D model (default: Schependomlaan.ifc.xkt from XeoKit samples)
2. Enable navigation controls
3. Provide a tree view for model hierarchy if enabled
4. Support various model formats (XKT, LAS/LAZ, OBJ, GLB/GLTF)

## URL Parameters

The viewer supports various URL parameters to customize its behavior:
- `xeokit`: Version of xeokit SDK to use (defaults to 'latest')
- `url`: URL of the 3D model to load (encoded)
- `type`: Type of model (xkt, las, laz, obj, stl, glb, gltf, bim)
- `rotation`: Model rotation as comma-separated values (x,y,z)
- `boundingBox`: Whether to show bounding box (0/1 or false/true)
- `edges`: Whether to show edges (0/1 or false/true)
- And many more... (see source code for details)