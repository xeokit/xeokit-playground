// Import XEokit components from our custom wrapper
// var xeokit = require('./xeokit-sdk.es5.js');
var xeokit = require('@xeokit/xeokit-sdk/dist/xeokit-sdk.es5.js');


// // First, try to grab xeokit from the global scope if it exists
// if (typeof window !== 'undefined' && window.xeokit) {
//     // Export the global object if it exists
//     module.exports = window.xeokit;
// } else {
//     // If not available in the global scope, load it
//     // We need to load the script directly rather than require it

//     // Create a script element to load xeokit
//     var script = document.createElement('script');
//     script.src = require.resolve('@xeokit/xeokit-sdk/dist/xeokit-sdk.es5.js');
//     script.async = false; // We want it to load synchronously

//     // Wait for the script to load
//     script.onload = function() {
//         console.log('XEokit SDK loaded successfully');
//     };

//     script.onerror = function() {
//         console.error('Failed to load XEokit SDK');
//     };

//     // Append the script to the document
//     document.head.appendChild(script);

//     // Export components from the global xeokit object
//     // This will be available after the script loads
//     module.exports = window.xeokit;
// }

var Mesh = xeokit.Mesh;
var ReadableGeometry = xeokit.ReadableGeometry;
var PhongMaterial = xeokit.PhongMaterial;
var buildBoxLinesGeometryFromAABB = xeokit.buildBoxLinesGeometryFromAABB;
var NavCubePlugin = xeokit.NavCubePlugin;
var Viewer = xeokit.Viewer;
var XKTLoaderPlugin = xeokit.XKTLoaderPlugin;
var XKTDefaultDataSource = xeokit.XKTDefaultDataSource;
var OBJLoaderPlugin = xeokit.OBJLoaderPlugin;
var GLTFLoaderPlugin = xeokit.GLTFLoaderPlugin;
var GLTFDefaultDataSource = xeokit.GLTFDefaultDataSource;
var LASLoaderPlugin = xeokit.LASLoaderPlugin;
var STLLoaderPlugin = xeokit.STLLoaderPlugin;
var STLDefaultDataSource = xeokit.STLDefaultDataSource;
var TreeViewPlugin = xeokit.TreeViewPlugin;
var ContextMenu = xeokit.ContextMenu;


// Parse query params
// Parse query parameters for compatibility with older browsers
var urlParams = (function() {
    // Check if URLSearchParams is supported
    if (typeof URLSearchParams !== 'undefined') {
        return new URLSearchParams(window.location.search);
    }

    // Fallback for older browsers
    var params = {};
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        if (!vars[i]) continue;
        var pair = vars[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = pair.length > 1 ? decodeURIComponent(pair[1] || '') : null;
        params[key] = value;
    }

    return {
        get: function(name) {
            return params[name] !== undefined ? params[name] : null;
        }
    };
})();

var xeokitModelUrl = decodeURIComponent(urlParams.get('url') || 'https://xeokit.github.io/xeokit-sdk/assets/models/xkt/v8/ifc/Schependomlaan.ifc.xkt');
var xeokitModelType = urlParams.get('type') || 'xkt';
var xeokitRotation = urlParams.get('rotation') ? urlParams.get('rotation').split(',').map(function(v) { return parseInt(v); }) : [-90, 0, 0];
var xeokitBoundingBox = urlParams.get('boundingBox') ? urlParams.get('boundingBox') === '1' || urlParams.get('boundingBox') === 'true' : false;
var xeokitEdges = urlParams.get('edges') ? urlParams.get('edges') === '1' || urlParams.get('edges') === 'true' : false;
var xeokitColorTextureEnabled = urlParams.get('colorTextureEnabled') ? urlParams.get('colorTextureEnabled') === '1' || urlParams.get('colorTextureEnabled') === 'true' : true;
var xeokitDtxEnabled = urlParams.get('dtxEnabled') ? urlParams.get('dtxEnabled') === '1' || urlParams.get('dtxEnabled') === 'true' : true;
var xeokitTreeViewEnabled = urlParams.get('treeViewEnabled') ? urlParams.get('treeViewEnabled') === '1' || urlParams.get('treeViewEnabled') === 'true' : true;
var xeokitTransparent = urlParams.get('transparent') ? urlParams.get('transparent') === '1' || urlParams.get('transparent') === 'true' : true;
var xeokitBackfaces = urlParams.get('backfaces') ? urlParams.get('backfaces') === '1' || urlParams.get('backfaces') === 'true' : true;
var xeokitTreeViewHierarchy = urlParams.get('treeViewHierarchy') ? urlParams.get('treeViewHierarchy') : "containment"; // containment | types | storeys
var xeokitSaoEnabled = urlParams.get('saoEnabled') ? urlParams.get('saoEnabled') === '1' || urlParams.get('saoEnabled') === 'true' : true;
var xeokitFP64 = urlParams.get('fp64') ? urlParams.get('fp64') === '1' || urlParams.get('fp64') === 'true' : true;
var xeokitCacheBuster = urlParams.get('cacheBuster') ? urlParams.get('cacheBuster') === '1' || urlParams.get('cacheBuster') === 'true' : false;

// Main viewer initialization
document.addEventListener('DOMContentLoaded', function() {
    var viewer = new xeokit.Viewer({
        canvasId: "myCanvas",
        transparent: xeokitTransparent,
        dtxEnabled: xeokitDtxEnabled,
        colorTextureEnabled: xeokitColorTextureEnabled,
    });

    viewer.scene.camera.eye = [26.543735598689356, 29.295147183337072, 36.20021104566069];
    viewer.scene.camera.look = [-23.51624377290216, -8.263137541594404, -21.650089870476542];
    viewer.scene.camera.up = [-0.2883721466119999, 0.897656342963939, -0.3332485483764247];

    new NavCubePlugin(viewer, {
        canvasId: "myNavCubeCanvas",
        visible: true,
        size: 250,
        alignment: "bottomRight",
        bottomMargin: 100,
        rightMargin: 10
    });

    viewer.scene.xrayMaterial.fill = true;
    viewer.scene.xrayMaterial.fillAlpha = 0.1;
    viewer.scene.xrayMaterial.fillColor = [0, 0, 0];
    viewer.scene.xrayMaterial.edgeAlpha = 0.3;
    viewer.scene.xrayMaterial.edgeColor = [0, 0, 0];

    viewer.scene.highlightMaterial.fill = true;
    viewer.scene.highlightMaterial.edges = true;
    viewer.scene.highlightMaterial.fillAlpha = 0.1;
    viewer.scene.highlightMaterial.edgeAlpha = 0.1;
    viewer.scene.highlightMaterial.edgeColor = [1, 1, 0];

    viewer.scene.selectedMaterial.fill = true;
    viewer.scene.selectedMaterial.edges = true;
    viewer.scene.selectedMaterial.fillAlpha = 0.5;
    viewer.scene.selectedMaterial.edgeAlpha = 0.6;
    viewer.scene.selectedMaterial.edgeColor = [0, 1, 1];

    viewer.cameraControl.navMode = "orbit";
    viewer.cameraControl.followPointer = true;

    var getCanvasPosFromEvent = function (event) {
        var canvasPos = [];
        if (!event) {
            event = window.event;
            canvasPos[0] = event.x;
            canvasPos[1] = event.y;
        } else {
            var element = event.target;
            var totalOffsetLeft = 0;
            var totalOffsetTop = 0;
            var totalScrollX = 0;
            var totalScrollY = 0;
            while (element.offsetParent) {
                totalOffsetLeft += element.offsetLeft;
                totalOffsetTop += element.offsetTop;
                totalScrollX += element.scrollLeft;
                totalScrollY += element.scrollTop;
                element = element.offsetParent;
            }
            canvasPos[0] = event.pageX + totalScrollX - totalOffsetLeft;
            canvasPos[1] = event.pageY + totalScrollY - totalOffsetTop;
        }
        return canvasPos;
    };

    function removeModelBoundingBox(viewer, sceneModelId) {
        if (!viewer) return;

        if (viewer.scene.objects[sceneModelId + "#boundingBox"]) {
            viewer.scene.objects[sceneModelId + "#boundingBox"].destroy();
        }
    }

    function drawModelBoundingBox(viewer, sceneModelId, aabb) {
        if (!viewer) return;

        if (!viewer.scene.objects[sceneModelId + "#boundingBox"]) {
            new xeokit.Mesh(viewer.scene, {
                id: sceneModelId + "#boundingBox",
                isObject: true,
                geometry: new ReadableGeometry(viewer.scene, buildBoxLinesGeometryFromAABB({ aabb: aabb })),
                material: new PhongMaterial(viewer.scene, { ambient: [255, 0, 0] }),
            });
        }
    }

    // Load model
    var loader = null;
    var sceneModel = null;

    if (xeokitModelType === 'xkt') {
        // Load XKT model with cache busting if enabled
        loader = new XKTLoaderPlugin(viewer);

        sceneModel = loader.load({
            id: "myModel",
            src: xeokitModelUrl + (xeokitCacheBuster ? "?cacheBuster=" + new Date().getTime() : ""),
            edges: xeokitEdges,
            backfaces: xeokitBackfaces
        });
    } else if (xeokitModelType === 'las' || xeokitModelType === 'laz') {
        // Load LAS/LAZ point cloud model
        loader = new LASLoaderPlugin(viewer, {
            fp64: xeokitFP64,
            colorDepth: 'auto'
        });

        sceneModel = loader.load({
            id: "myModel",
            src: xeokitModelUrl + (xeokitCacheBuster ? "?cacheBuster=" + new Date().getTime() : ""),
            rotation: xeokitRotation,
        });
    } else if (xeokitModelType === 'obj') {
        // Load OBJ model
        loader = new OBJLoaderPlugin(viewer);

        sceneModel = loader.load({
            id: "myModel",
            src: xeokitModelUrl + (xeokitCacheBuster ? "?cacheBuster=" + new Date().getTime() : ""),
            edges: xeokitEdges
        });
    } else if (xeokitModelType === 'stl') {
        console.warn('STL support removed in this simplified browser bundle');

        // Show error message in the footer
        var footer = document.getElementById('footer');
        if (footer) {
            footer.innerText = 'STL format not supported in this browser bundle';
        }

        // Return to avoid error
        return;
    } else if (xeokitModelType === 'glb' || xeokitModelType === 'gltf') {
        // Load GLTF/GLB model
        loader = new GLTFLoaderPlugin(viewer);

        sceneModel = loader.load({
            id: "myModel",
            src: xeokitModelUrl + (xeokitCacheBuster ? "?cacheBuster=" + new Date().getTime() : ""),
            colorTextureEnabled: xeokitColorTextureEnabled,
            autoMetaModel: true,
            saoEnabled: xeokitSaoEnabled,
            edges: xeokitEdges,
            dtxEnabled: xeokitDtxEnabled
        });
    } else if (xeokitModelType === 'bim') {
        console.warn('BIM support removed in this simplified browser bundle');

        // Show error message in the footer
        var footer = document.getElementById('footer');
        if (footer) {
            footer.innerText = 'BIM format not supported in this browser bundle';
        }

        // Return to avoid error
        return;
    }

    var t0 = performance.now();

    sceneModel.on("loaded", function () {
        var t1 = performance.now();
        console.log("Model loaded in " + (Math.floor(t1 - t0) / 1000.0) + " seconds, Objects: " + sceneModel.numEntities);

        var footer = document.getElementById('footer');
        if (footer) {
            footer.innerText = "Model loaded in " + (Math.floor(t1 - t0) / 1000.0) + " seconds, Objects: " + sceneModel.numEntities;
        }

        viewer.cameraFlight.jumpTo({
            projection: "perspective",
            aabb: viewer.scene.getAABB({}),
        });

        if (xeokitBoundingBox) {
            var model = viewer.scene.models['myModel'];
            drawModelBoundingBox(viewer, 'myModel', model.aabb);
        }
    });

    // Create a tree view
    if (xeokitTreeViewEnabled) {
        var treeView = new TreeViewPlugin(viewer, {
            containerElement: document.getElementById("treeViewContainer"),
            hierarchy: xeokitTreeViewHierarchy,
            autoExpandDepth: 1
        });

        var treeViewContextMenu = new ContextMenu({
            items: [
                [
                    {
                        title: "View Fit",
                        doAction: function (context) {
                            var scene = context.viewer.scene;
                            var objectIds = [];
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    objectIds.push(treeViewNode.objectId);
                                }
                            });
                            scene.setObjectsVisible(objectIds, true);
                            scene.setObjectsHighlighted(objectIds, true);
                            context.viewer.cameraFlight.flyTo({
                                projection: "perspective",
                                aabb: scene.getAABB(objectIds),
                                duration: 0.5
                            }, function() {
                                setTimeout(function () {
                                    scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                                }, 500);
                            });
                        }
                    },
                    {
                        title: "View Fit All",
                        doAction: function (context) {
                            var scene = context.viewer.scene;
                            context.viewer.cameraFlight.flyTo({
                                projection: "perspective",
                                aabb: scene.getAABB({}),
                                duration: 0.5
                            });
                        }
                    }
                ],
                [
                    {
                        title: "Hide",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.visible = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Hide Others",
                        doAction: function (context) {
                            var scene = context.viewer.scene;
                            scene.setObjectsVisible(scene.visibleObjectIds, false);
                            scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                            scene.setObjectsSelected(scene.selectedObjectIds, false);
                            scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.visible = true;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Hide All",
                        getEnabled: function (context) {
                            return (context.viewer.scene.visibleObjectIds.length > 0);
                        },
                        doAction: function (context) {
                            context.viewer.scene.setObjectsVisible(context.viewer.scene.visibleObjectIds, false);
                        }
                    }
                ],
                [
                    {
                        title: "Show",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.visible = true;
                                        entity.xrayed = false;
                                        entity.selected = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Show Others",
                        doAction: function (context) {
                            var scene = context.viewer.scene;
                            scene.setObjectsVisible(scene.objectIds, true);
                            scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                            scene.setObjectsSelected(scene.selectedObjectIds, false);
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.visible = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Show All",
                        getEnabled: function (context) {
                            var scene = context.viewer.scene;
                            return (scene.numVisibleObjects < scene.numObjects);
                        },
                        doAction: function (context) {
                            var scene = context.viewer.scene;
                            scene.setObjectsVisible(scene.objectIds, true);
                            scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                            scene.setObjectsSelected(scene.selectedObjectIds, false);
                        }
                    }
                ],
                [
                    {
                        title: "X-Ray",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.xrayed = true;
                                        entity.visible = true;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Undo X-Ray",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.xrayed = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "X-Ray Others",
                        doAction: function (context) {
                            var scene = context.viewer.scene;
                            scene.setObjectsVisible(scene.objectIds, true);
                            scene.setObjectsXRayed(scene.objectIds, true);
                            scene.setObjectsSelected(scene.selectedObjectIds, false);
                            scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.xrayed = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Reset X-Ray",
                        getEnabled: function (context) {
                            return (context.viewer.scene.numXRayedObjects > 0);
                        },
                        doAction: function (context) {
                            context.viewer.scene.setObjectsXRayed(context.viewer.scene.xrayedObjectIds, false);
                        }
                    }
                ],
                [
                    {
                        title: "Select",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.selected = true;
                                        entity.visible = true;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Deselect",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, function(treeViewNode) {
                                if (treeViewNode.objectId) {
                                    var entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.selected = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Clear Selection",
                        getEnabled: function (context) {
                            return (context.viewer.scene.numSelectedObjects > 0);
                        },
                        doAction: function (context) {
                            context.viewer.scene.setObjectsSelected(context.viewer.scene.selectedObjectIds, false);
                        }
                    }
                ]
            ]
        });

        // Right-clicking on a tree node shows the context menu for that node
        treeView.on("contextmenu", function(e) {
            treeViewContextMenu.context = { // Must set context before opening menu
                viewer: e.viewer,
                treeViewPlugin: e.treeViewPlugin,
                treeViewNode: e.treeViewNode,
                entity: e.viewer.scene.objects[e.treeViewNode.objectId] // Only defined if tree node is a leaf node
            };

            treeViewContextMenu.show(e.event.pageX, e.event.pageY);
        });

        // Left-clicking on a tree node isolates that object in the 3D view
        treeView.on("nodeTitleClicked", function(e) {
            var scene = viewer.scene;
            var objectIds = [];

            e.treeViewPlugin.withNodeTree(e.treeViewNode, function(treeViewNode) {
                if (treeViewNode.objectId) {
                    objectIds.push(treeViewNode.objectId);
                }
            });

            e.treeViewPlugin.unShowNode();
            scene.setObjectsXRayed(scene.objectIds, true);
            scene.setObjectsVisible(scene.objectIds, true);
            scene.setObjectsXRayed(objectIds, false);
            viewer.cameraFlight.flyTo({
                aabb: scene.getAABB(objectIds),
                duration: 0.5
            }, function() {
                setTimeout(function () {
                    scene.setObjectsVisible(scene.xrayedObjectIds, false);
                    scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                }, 500);
            });
        });
    }

    // Expose viewer globally for debugging
    window.viewer = viewer;
});

// module.exports = {};