import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as THREE from 'three';

interface Model3DViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    modelUrl: string;
    modelName: string;
}

export default function Model3DViewerModal({ isOpen, onClose, modelUrl, modelName }: Readonly<Model3DViewerModalProps>) {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !mountRef.current || !modelUrl?.trim()) return;

        const loadOBJModel = async (scene: THREE.Scene, url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
            
            const objText = await response.text();
            const lines = objText.split('\n');
            const vertices: THREE.Vector3[] = [];
            const faces: number[][] = [];

            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                if (parts[0] === 'v' && parts.length >= 4) {
                    vertices.push(new THREE.Vector3(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    ));
                } else if (parts[0] === 'f' && parts.length >= 4) {
                    const faceVertices = parts.slice(1).map(v => parseInt(v) - 1);
                    faces.push(faceVertices);
                }
            }

            if (vertices.length === 0 || faces.length === 0) {
                throw new Error('Fichier OBJ invalide: aucune géométrie trouvée');
            }
            
            const geometry = new THREE.BufferGeometry();
            const positions: number[] = [];

            for (const face of faces) {
                if (face.length === 3) {
                    for (const vertexIndex of face) {
                        if (vertices[vertexIndex]) {
                            const vertex = vertices[vertexIndex];
                            positions.push(vertex.x, vertex.y, vertex.z);
                        }
                    }
                } else if (face.length === 4) {
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

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.computeVertexNormals();

            const material = new THREE.MeshPhongMaterial({
                color: 0x4A90E2,
                shininess: 100,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Centrer et redimensionner
            const box = new THREE.Box3().setFromObject(mesh);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            mesh.position.sub(center);
            
            const maxDimension = Math.max(size.x, size.y, size.z);
            if (maxDimension > 0) {
                mesh.scale.multiplyScalar(2 / maxDimension);
            }

            scene.add(mesh);

            // Animation de rotation
            let rotation = 0;
            (mesh as THREE.Mesh & { customAnimation?: () => void }).customAnimation = () => {
                rotation += 0.01;
                mesh.rotation.y = rotation;
            };
        };

        const init3DViewer = async () => {
            try {
                setIsLoading(true);
                setError(null);
                cleanup();

                const mount = mountRef.current!;
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf0f0f0);
                sceneRef.current = scene;

                const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
                camera.position.set(0, 0, 5);

                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(mount.clientWidth, mount.clientHeight);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                rendererRef.current = renderer;
                mount.appendChild(renderer.domElement);

                // Lighting
                scene.add(new THREE.AmbientLight(0x404040, 0.6));
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(1, 1, 1);
                directionalLight.castShadow = true;
                scene.add(directionalLight);

                // Load model (only OBJ supported)
                const extension = modelUrl.split('.').pop()?.toLowerCase();
                if (extension !== 'obj') {
                    throw new Error(`Format ${extension} non supporté. Utilisez un fichier OBJ.`);
                }
                
                await loadOBJModel(scene, modelUrl);

                // Mouse controls
                let isDragging = false;
                let previousMouse = { x: 0, y: 0 };

                const onMouseDown = (e: MouseEvent) => {
                    isDragging = true;
                    previousMouse = { x: e.clientX, y: e.clientY };
                };

                const onMouseMove = (e: MouseEvent) => {
                    if (!isDragging) return;
                    const delta = { x: e.clientX - previousMouse.x, y: e.clientY - previousMouse.y };
                    const speed = 0.005;
                    
                    const x = camera.position.x * Math.cos(delta.x * speed) - camera.position.z * Math.sin(delta.x * speed);
                    const z = camera.position.x * Math.sin(delta.x * speed) + camera.position.z * Math.cos(delta.x * speed);
                    camera.position.x = x;
                    camera.position.z = z;
                    camera.lookAt(scene.position);
                    
                    previousMouse = { x: e.clientX, y: e.clientY };
                };

                const onMouseUp = () => { isDragging = false; };

                const onWheel = (e: WheelEvent) => {
                    e.preventDefault();
                    camera.position.multiplyScalar(1 + (e.deltaY > 0 ? 0.1 : -0.1));
                    camera.lookAt(scene.position);
                };

                renderer.domElement.addEventListener('mousedown', onMouseDown);
                renderer.domElement.addEventListener('mousemove', onMouseMove);
                renderer.domElement.addEventListener('mouseup', onMouseUp);
                renderer.domElement.addEventListener('wheel', onWheel);

                // Animation loop
                const animate = () => {
                    animationIdRef.current = requestAnimationFrame(animate);
                    scene.children.forEach(child => {
                        const mesh = child as THREE.Mesh & { customAnimation?: () => void };
                        mesh.customAnimation?.();
                    });
                    renderer.render(scene, camera);
                };
                animate();

                setIsLoading(false);
            } catch (err) {
                setError(`Erreur: ${(err as Error).message}`);
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
