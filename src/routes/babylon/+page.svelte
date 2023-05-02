<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine } from '@babylonjs/core/Engines/engine';
	import { Scene } from '@babylonjs/core/scene';
	import { Vector3 } from '@babylonjs/core/Maths/math';
	import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { Mesh } from '@babylonjs/core/Meshes/mesh';

	// Side-effects only imports allowing the standard material to be used as default.
	import '@babylonjs/core/Materials/standardMaterial';
	// // Side-effects only imports allowing Mesh to create default shapes (to enhance tree shaking, the construction methods on mesh are not available if the meshbuilder has not been imported).
	import '@babylonjs/core/Meshes/Builders/sphereBuilder';
	import '@babylonjs/core/Meshes/Builders/boxBuilder';
	import '@babylonjs/core/Meshes/Builders/groundBuilder';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

	let container: HTMLElement;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		// This creates a basic Babylon Scene object (non-mesh)
		const engine = new Engine(canvas);
		var scene = new Scene(engine);

		// This creates and positions a free camera (non-mesh)
		var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

		// This targets the camera to scene origin
		camera.setTarget(Vector3.Zero());

		// This attaches the camera to the canvas
		camera.attachControl(canvas, true);

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;

		// Our built-in 'sphere' shape.
		var sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene);

		// Move the sphere upward 1/2 its height
		sphere.position.y = 1;

		// Our built-in 'ground' shape.
		var ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);

		window.addEventListener('resize', () => {
			const w = canvas.offsetWidth;
			const h = canvas.offsetHeight;
			canvas.width = w;
			canvas.height = h;
		});

		engine.runRenderLoop(() => {
			scene.render();
		});
	});
</script>

<div bind:this={container}>
	<canvas bind:this={canvas} />
</div>

<style>
	div {
		width: 80%;
		height: 80%;
	}

	canvas {
		width: 100%;
		height: 100%;
		outline: 1px solid red;
	}
</style>
