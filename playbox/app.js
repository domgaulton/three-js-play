//Variables for setup

let container;
let camera;
let renderer;
let scene;
let house;

// Light Source
let geometrySphere;
let materialSphere;
let light;
let sphere;
let pivotPoint;

const init = () => {
  container = document.querySelector(".scene");

  //Create scene
  scene = new THREE.Scene();

  const fov = 35; // 
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 30);

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(5, 5, 10);
  scene.add(light);

  geometrySphere = new THREE.SphereBufferGeometry( 1, 32, 32 );
  materialSphere = new THREE.MeshBasicMaterial( { color: 0xFFFFE0 } );
  sphere = new THREE.Mesh( geometrySphere, materialSphere );
  sphere.position.set(5, 5, 5);
  scene.add(sphere);

  pivotPoint = new THREE.Object3D();
  pivotPoint.add(sphere);
  pivotPoint.add(light);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./house/scene.gltf", gltf => {
    scene.add(gltf.scene);
    house = gltf.scene.children[0];
    house.receiveShadow = true;
    house.castShadow = true;
    house.add(pivotPoint);
    animate();
  });
}

const animate = () => {
  requestAnimationFrame(animate);
  house.rotation.z += 0.005;
  sphere.rotation.z += 0.01;
  pivotPoint.rotation.z -= (0.05 * Math.cos(0.05));
  if ( sphere.getWorldPosition().y < 4.5 || sphere.getWorldPosition().y > 5.5  ) {
    pivotPoint.rotation.x += (0.005 * Math.sin(1));;
  } else {
    pivotPoint.rotation.x -= (0.005 * Math.sin(1));;
  }
  
  renderer.render(scene, camera);
}

init();

const onWindowResize = () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
