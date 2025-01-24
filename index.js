document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('Selected file:', file);
        loadModel(file);
    } else {
        alert('No file selected.');
    }
});

function loadModel(file) {
    const url = URL.createObjectURL(file); // Dynamically create a URL for the uploaded file
    console.log('File URL:', url); // Debug the generated URL
    loader.load(
        url,
        (gltf) => {
            console.log('GLTF loaded:', gltf); // Debug the loaded glTF object
            const model = gltf.scene;

            // Center and scale the model
            model.scale.set(1, 1, 1);
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            console.log('Model position after centering:', model.position);

            // Clear the scene and add the model
            clearScene();
            scene.add(gridHelper, plane, model);

            // Adjust the camera
            fitCameraToObject(camera, model);
            console.log('Camera position after fitting:', camera.position);
            controls.update();

            console.log('Model loaded successfully!');
        },
        (xhr) => {
            console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
        },
        (error) => {
            console.error('An error occurred while loading the model:', error);
            alert('Failed to load model. Please check the file and try again.');
        }
    );
}
