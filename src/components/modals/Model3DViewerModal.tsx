import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as THREE from 'three';

interface Model3DViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    modelUrl: string;
    modelName: string;
}

export default function Model3DViewerModal({ isOpen, onClose, modelUrl, modelName }: Model3DViewerModalProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !mountRef.current) return;

        const loadGLTFModel = async (scene: THREE.Scene) => {
            // Pour GLTF, on aurait besoin du GLTFLoader
            // Pour l'instant, on charge un modèle de base
            loadDemoModel(scene);
        };

        const loadFBXModel = async (scene: THREE.Scene) => {
            // Pour FBX, on aurait besoin du FBXLoader
            // Pour l'instant, on charge un modèle de base
            loadDemoModel(scene);
        };

        const loadDemoModel = (scene: THREE.Scene) => {
            // Créer un modèle de démonstration (cube avec textures)
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                shininess: 100
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);

            // Animation de rotation
            let rotation = 0;
            const animateCube = () => {
                rotation += 0.01;
                cube.rotation.x = rotation;
                cube.rotation.y = rotation;
            };

            // Stocker l'animation
            (cube as THREE.Mesh & { customAnimation?: () => void }).customAnimation = animateCube;
        };

        const loadOBJModel = async (scene: THREE.Scene, url: string) => {
            try {
                console.log('🔄 Tentative de chargement du modèle OBJ:', url);
                
                // Charger le fichier OBJ depuis l'URL
                const response = await fetch(url);
                console.log('📡 Réponse serveur:', response.status, response.statusText);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const objText = await response.text();
                console.log('📄 Contenu OBJ chargé, taille:', objText.length, 'caractères');
                console.log('📄 Début du contenu:', objText.substring(0, 200) + '...');

                // Parser simple pour fichiers OBJ
                const lines = objText.split('\n');
                const vertices: THREE.Vector3[] = [];
                const faces: number[][] = [];

                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    if (parts[0] === 'v' && parts.length >= 4) {
                        // Vertex: v x y z
                        vertices.push(new THREE.Vector3(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3])
                        ));
                    } else if (parts[0] === 'f' && parts.length >= 4) {
                        // Face: f v1 v2 v3 [v4]
                        const faceVertices = parts.slice(1).map(v => parseInt(v) - 1); // OBJ uses 1-based indexing
                        faces.push(faceVertices);
                    }
                }

                // Créer la géométrie
                console.log('🔢 Parsing terminé - Vertices trouvés:', vertices.length, 'Faces trouvées:', faces.length);
                
                const geometry = new THREE.BufferGeometry();
                const positions: number[] = [];

                // Convertir les faces en triangles
                for (const face of faces) {
                    if (face.length === 3) {
                        // Triangle
                        for (const vertexIndex of face) {
                            if (vertices[vertexIndex]) {
                                positions.push(vertices[vertexIndex].x, vertices[vertexIndex].y, vertices[vertexIndex].z);
                            }
                        }
                    } else if (face.length === 4) {
                        // Quad -> 2 triangles
                        const quad = face.map(i => vertices[i]).filter(v => v !== undefined);
                        if (quad.length === 4) {
                            // Triangle 1: 0,1,2
                            positions.push(quad[0].x, quad[0].y, quad[0].z);
                            positions.push(quad[1].x, quad[1].y, quad[1].z);
                            positions.push(quad[2].x, quad[2].y, quad[2].z);
                            // Triangle 2: 0,2,3
                            positions.push(quad[0].x, quad[0].y, quad[0].z);
                            positions.push(quad[2].x, quad[2].y, quad[2].z);
                            positions.push(quad[3].x, quad[3].y, quad[3].z);
                        }
                    }
                }

                // Calculer les normales automatiquement
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geometry.computeVertexNormals();

                // Créer le matériau et le mesh
                const material = new THREE.MeshPhongMaterial({
                    color: 0x4A90E2,
                    shininess: 100,
                    side: THREE.DoubleSide
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Centrer et redimensionner le modèle
                const box = new THREE.Box3().setFromObject(mesh);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Centrer
                mesh.position.sub(center);

                // Redimensionner pour s'adapter à la vue (max 2 unités)
                const maxDimension = Math.max(size.x, size.y, size.z);
                if (maxDimension > 0) {
                    const scale = 2 / maxDimension;
                    mesh.scale.multiplyScalar(scale);
                }

                scene.add(mesh);
                console.log('✅ Modèle OBJ ajouté à la scène avec succès!', mesh);

                // Ajouter une rotation automatique
                let rotation = 0;
                const animate = () => {
                    rotation += 0.01;
                    mesh.rotation.y = rotation;
                };

                // Stocker la fonction d'animation pour l'utiliser dans la boucle principale
                (mesh as THREE.Mesh & { customAnimation?: () => void }).customAnimation = animate;

            } catch (error) {
                console.error('❌ Erreur lors du chargement du modèle OBJ:', error);
                console.error('❌ Détails de l\'erreur:', {
                    message: (error as Error).message,
                    stack: (error as Error).stack,
                    url: url
                });
                // Fallback vers le modèle de démonstration
                console.log('🔄 Basculement vers le modèle de démonstration...');
                loadDemoModel(scene);
            }
        };

        const init3DViewer = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Nettoyage de la scène précédente
                cleanup();

                const mount = mountRef.current!;
                const width = mount.clientWidth;
                const height = mount.clientHeight;

                // Créer la scène
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf0f0f0);
                sceneRef.current = scene;

                // Créer la caméra
                const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
                camera.position.set(0, 0, 5);

                // Créer le renderer
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(width, height);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                rendererRef.current = renderer;

                mount.appendChild(renderer.domElement);

                // Ajouter des lumières
                const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(1, 1, 1);
                directionalLight.castShadow = true;
                scene.add(directionalLight);

                // Charger le modèle basé sur l'extension
                console.log('🎯 ModelUrl reçu:', modelUrl);
                const extension = modelUrl.split('.').pop()?.toLowerCase();
                console.log('🔧 Extension détectée:', extension);
                
                switch (extension) {
                    case 'gltf':
                    case 'glb':
                        console.log('📦 Chargement modèle GLTF/GLB');
                        await loadGLTFModel(scene);
                        break;
                    case 'obj':
                        console.log('📦 Chargement modèle OBJ');
                        await loadOBJModel(scene, modelUrl);
                        break;
                    case 'fbx':
                        console.log('📦 Chargement modèle FBX');
                        await loadFBXModel(scene);
                        break;
                    default:
                        console.log('📦 Chargement modèle démo (pas d\'extension reconnue)');
                        loadDemoModel(scene);
                }

                // Contrôles de la caméra (rotation avec la souris)
                let isDragging = false;
                let previousMousePosition = { x: 0, y: 0 };

                const handleMouseDown = (event: MouseEvent) => {
                    isDragging = true;
                    previousMousePosition = { x: event.clientX, y: event.clientY };
                };

                const handleMouseMove = (event: MouseEvent) => {
                    if (!isDragging) return;

                    const deltaMove = {
                        x: event.clientX - previousMousePosition.x,
                        y: event.clientY - previousMousePosition.y
                    };

                    // Rotation de la caméra autour de la scène
                    const rotationSpeed = 0.005;
                    camera.position.x = camera.position.x * Math.cos(deltaMove.x * rotationSpeed) - camera.position.z * Math.sin(deltaMove.x * rotationSpeed);
                    camera.position.z = camera.position.x * Math.sin(deltaMove.x * rotationSpeed) + camera.position.z * Math.cos(deltaMove.x * rotationSpeed);

                    camera.lookAt(scene.position);
                    previousMousePosition = { x: event.clientX, y: event.clientY };
                };

                const handleMouseUp = () => {
                    isDragging = false;
                };

                // Zoom avec la molette
                const handleWheel = (event: WheelEvent) => {
                    event.preventDefault();
                    const zoomSpeed = 0.1;
                    camera.position.multiplyScalar(1 + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed));
                    camera.lookAt(scene.position);
                };

                renderer.domElement.addEventListener('mousedown', handleMouseDown);
                renderer.domElement.addEventListener('mousemove', handleMouseMove);
                renderer.domElement.addEventListener('mouseup', handleMouseUp);
                renderer.domElement.addEventListener('wheel', handleWheel);

                // Animation loop
                const animateScene = () => {
                    animationIdRef.current = requestAnimationFrame(animateScene);

                    // Exécuter les animations personnalisées des modèles
                    scene.children.forEach(child => {
                        const meshChild = child as THREE.Mesh & { customAnimation?: () => void };
                        if (meshChild.customAnimation) {
                            meshChild.customAnimation();
                        }
                    });

                    renderer.render(scene, camera);
                };
                animateScene();

                setIsLoading(false);

            } catch (err) {
                console.error('Erreur lors du chargement du modèle 3D:', err);
                setError('Impossible de charger le modèle 3D. Vérifiez que le fichier est valide.');
                setIsLoading(false);
            }
        };

        init3DViewer();

        return () => {
            cleanup();
        };
    }, [isOpen, modelUrl]);

    const cleanup = () => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }

        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (mountRef.current && rendererRef.current.domElement.parentNode) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current = null;
        }

        if (sceneRef.current) {
            sceneRef.current.clear();
            sceneRef.current = null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <button
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 border-none cursor-pointer"
                    onClick={onClose}
                    aria-label="Fermer le modal"
                />

                {/* Modal */}
                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Visualiseur de Modèle 3D</h3>
                            <p className="text-sm text-gray-500">{modelName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* 3D Viewer */}
                    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="mt-2 text-sm text-gray-600">Chargement du modèle 3D...</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-red-500 mb-2">⚠️</div>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}

                        <div ref={mountRef} className="w-full h-full" />
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Instructions:</strong> Cliquez et glissez pour faire tourner le modèle.
                            Utilisez la molette de la souris pour zoomer/dézoomer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
