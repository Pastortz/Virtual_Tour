import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from "../hooks/loadModel";
import '../styles/model.css';

export default function ModelContainer({ nameModel }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 30);
        const modelGroup = new THREE.Group();
        const renderer = new THREE.WebGLRenderer({ alpha: true, powerPreference: 'high-performance', precision: 'lowp' });
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        let shouldAnimate = true;

        orbitControls.enableDamping = true;
        camera.position.set(0, 0, 10);

        const currentRef = mountRef.current;

        // Inicializa el renderer
        const initRenderer = (ref, renderer) => {
            const { clientWidth: width, clientHeight: height } = ref;
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
        };

        // Crear escena con luces y cámara
        const createScene = () => {
            const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.8);
            const pointLight = new THREE.PointLight(0xffffff, 0.5);
            scene.add(ambientLight);
            scene.add(pointLight);
            scene.add(camera);

            // Cargar modelo
            importModel();
        };

        // Importar modelo según `nameModel`
        const importModel = () => {
            if (nameModel === 'flowerVase') {
                const { ModelFlowerVase } = Model();
                ModelFlowerVase(modelGroup);
            }
            scene.add(modelGroup);
        };

        // Animación
        const animate = () => {
            if (shouldAnimate) {
                requestAnimationFrame(animate);
                orbitControls.autoRotate = true;
                orbitControls.update();
                renderer.render(scene, camera);
            }
        };

        // Inicialización
        initRenderer(currentRef, renderer);
        createScene();
        animate();

        currentRef.appendChild(renderer.domElement);

        // Cleanup cuando el componente se desmonta
        return () => {
            shouldAnimate = false;
            orbitControls.dispose();
            renderer.dispose();
            currentRef.removeChild(renderer.domElement);
            scene.clear();
        };
    }, [nameModel]);

    return (
        <div className="container3d" ref={mountRef} />
    );
}
