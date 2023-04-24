import * as THREE from 'three';

interface ThreeJsOptions {
	canvas: HTMLCanvasElement;
	cameraType: 'perspective' | 'orthographic';
	cameraOptions?: {
		fov?: number;
		near?: number;
		far?: number;
		orthoSize?: number;
	};
}

export function setupThreeJsScene(options: ThreeJsOptions) {
	const { canvas, cameraType, cameraOptions } = options;

	const w = canvas.offsetWidth;
	const h = canvas.offsetHeight;

	canvas.width = w;
	canvas.height = h;

	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({ canvas });

	// Set up the camera
	let camera: THREE.Camera;
	const defaultOptions = {
		fov: 75,
		near: 0.1,
		far: 1000,
		orthoSize: 10
	};

	const mergedOptions = { ...defaultOptions, ...cameraOptions };
	const aspect = w / h;

	if (cameraType === 'perspective') {
		camera = new THREE.PerspectiveCamera(
			mergedOptions.fov,
			aspect,
			mergedOptions.near,
			mergedOptions.far
		);
	} else {
		const height = mergedOptions.orthoSize;
		const width = height * aspect;
		camera = new THREE.OrthographicCamera(
			-width / 2,
			width / 2,
			height / 2,
			-height / 2,
			mergedOptions.near,
			mergedOptions.far
		);
	}

	// Set up the light
	const light = new THREE.DirectionalLight(0xffffff, 1);

	light.position.set(0, 0, 10);
	scene.add(light);

	// Set up the cube
	const geometry = new THREE.BoxGeometry(5, 5, 5);
	const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// Set the camera position and look at the cube
	camera.position.z = 20;
	camera.lookAt(cube.position);

	// Update on resize
	window.addEventListener('resize', () => {
		const w = canvas.offsetWidth;
		const h = canvas.offsetHeight;
		const aspect = w / h;
		if (camera instanceof THREE.PerspectiveCamera) {
			camera.aspect = aspect;
			camera.updateProjectionMatrix();
		} else if (camera instanceof THREE.OrthographicCamera) {
			const height = mergedOptions.orthoSize;
			const width = height * aspect;
			camera.left = -width / 2;
			camera.right = width / 2;
			camera.top = height / 2;
			camera.bottom = -height / 2;
			camera.updateProjectionMatrix();
		}
		renderer.setSize(w, h, false);
		// console.log(w, h);
		// resizeRendererToDisplaySize(renderer);
	});

	// Animation loop
	function animate() {
		requestAnimationFrame(animate);

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		renderer.render(scene, camera);
	}

	animate();
}

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
	const canvas = renderer.domElement;
	const pixelRatio = window.devicePixelRatio;
	const width = (canvas.clientWidth * pixelRatio) | 0;
	const height = (canvas.clientHeight * pixelRatio) | 0;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}
