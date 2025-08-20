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

    // MTL parser function
    const parseMTL = async (mtlText: string, baseUrl: string): Promise<Map<string, THREE.Material>> => {
        const materials = new Map<string, THREE.Material>();
        const lines = mtlText.split('\n');
        let currentMaterial: THREE.MeshPhongMaterial | null = null;
        let currentMaterialName = '';

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            
            if (parts[0] === 'newmtl' && parts.length >= 2) {
                // Save previous material
                if (currentMaterial && currentMaterialName) {
                    materials.set(currentMaterialName, currentMaterial);
                }
                
                // Start new material
                currentMaterialName = parts[1];
                currentMaterial = new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide
                });
            } else if (currentMaterial) {
                if (parts[0] === 'Kd' && parts.length >= 4) {
                    // Diffuse color
                    currentMaterial.color.setRGB(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                } else if (parts[0] === 'Ks' && parts.length >= 4) {
                    // Specular color
                    currentMaterial.specular.setRGB(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                } else if (parts[0] === 'Ns' && parts.length >= 2) {
                    // Shininess
                    currentMaterial.shininess = parseFloat(parts[1]);
                } else if (parts[0] === 'd' && parts.length >= 2) {
                    // Opacity
                    const opacity = parseFloat(parts[1]);
                    currentMaterial.opacity = opacity;
                    currentMaterial.transparent = opacity < 1.0;
                } else if (parts[0] === 'map_Kd' && parts.length >= 2) {
                    // Diffuse texture
                    try {
                        const texturePath = parts.slice(1).join(' ');
                        const textureUrl = new URL(texturePath, baseUrl).href;
                        const textureLoader = new THREE.TextureLoader();
                        currentMaterial.map = textureLoader.load(textureUrl);
                    } catch {
                        // Texture loading failed, continue without texture
                    }
                }
            }
        }

        // Save last material
        if (currentMaterial && currentMaterialName) {
            materials.set(currentMaterialName, currentMaterial);
        }

        return materials;
    };

    useEffect(() => {
        if (!isOpen || !mountRef.current || !modelUrl?.trim()) return;

        const loadOBJModel = async (scene: THREE.Scene, url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
            
            const objText = await response.text();
            
            // Try to load MTL file if referenced
            let mtlMaterials: Map<string, THREE.Material> = new Map();
            const mtlUrl = url.replace('.obj', '.mtl');
            
            try {
                const mtlResponse = await fetch(mtlUrl);
                if (mtlResponse.ok) {
                    const mtlText = await mtlResponse.text();
                    mtlMaterials = await parseMTL(mtlText, url);
                }
            } catch {
                // MTL file not found or invalid, use default materials
                console.log('MTL file not found, using default materials');
            }
            
            const lines = objText.split('\n');
            
            // Parse OBJ data
            const vertices: THREE.Vector3[] = [];
            const normals: THREE.Vector3[] = [];
            const uvs: THREE.Vector2[] = [];
            const faces: { v: number[], vt: number[], vn: number[] }[] = [];
            const materials: Map<string, THREE.Material> = new Map();
            let currentMaterial = 'default';
            const groups: { material: string, faces: typeof faces }[] = [];

            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                
                if (parts[0] === 'v' && parts.length >= 4) {
                    // Vertex positions
                    vertices.push(new THREE.Vector3(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    ));
                } else if (parts[0] === 'vn' && parts.length >= 4) {
                    // Vertex normals
                    normals.push(new THREE.Vector3(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    ));
                } else if (parts[0] === 'vt' && parts.length >= 3) {
                    // Texture coordinates
                    uvs.push(new THREE.Vector2(
                        parseFloat(parts[1]),
                        parseFloat(parts[2])
                    ));
                } else if (parts[0] === 'usemtl' && parts.length >= 2) {
                    // Material usage
                    if (faces.length > 0) {
                        groups.push({ material: currentMaterial, faces: [...faces] });
                        faces.length = 0;
                    }
                    currentMaterial = parts[1];
                } else if (parts[0] === 'f' && parts.length >= 4) {
                    // Face definition
                    const faceVertices: number[] = [];
                    const faceTextures: number[] = [];
                    const faceNormals: number[] = [];
                    
                    for (let i = 1; i < parts.length; i++) {
                        const indices = parts[i].split('/');
                        faceVertices.push(parseInt(indices[0]) - 1);
                        faceTextures.push(indices[1] ? parseInt(indices[1]) - 1 : -1);
                        faceNormals.push(indices[2] ? parseInt(indices[2]) - 1 : -1);
                    }
                    
                    faces.push({
                        v: faceVertices,
                        vt: faceTextures,
                        vn: faceNormals
                    });
                }
            }

            // Add remaining faces to groups
            if (faces.length > 0) {
                groups.push({ material: currentMaterial, faces: [...faces] });
            }

            if (vertices.length === 0) {
                throw new Error('Fichier OBJ invalide: aucune géométrie trouvée');
            }

            // Merge MTL materials with default materials
            mtlMaterials.forEach((material, name) => {
                materials.set(name, material);
            });

            // Create default material if needed
            if (!materials.has('default')) {
                const defaultMaterial = new THREE.MeshPhongMaterial({
                    color: 0xcccccc,
                    shininess: 30,
                    side: THREE.DoubleSide
                });
                materials.set('default', defaultMaterial);
            }

            // Create geometries for each material group
            const meshes: THREE.Mesh[] = [];
            
            for (const group of groups.length > 0 ? groups : [{ material: 'default', faces: faces }]) {
                const geometry = new THREE.BufferGeometry();
                const positions: number[] = [];
                const textureCoords: number[] = [];
                const vertexNormals: number[] = [];

                for (const face of group.faces) {
                    if (face.v.length === 3) {
                        // Triangle face
                        for (let i = 0; i < 3; i++) {
                            const vertexIndex = face.v[i];
                            const uvIndex = face.vt[i];
                            const normalIndex = face.vn[i];

                            if (vertices[vertexIndex]) {
                                const vertex = vertices[vertexIndex];
                                positions.push(vertex.x, vertex.y, vertex.z);
                            }

                            if (uvIndex >= 0 && uvs[uvIndex]) {
                                const uv = uvs[uvIndex];
                                textureCoords.push(uv.x, uv.y);
                            } else {
                                textureCoords.push(0, 0);
                            }

                            if (normalIndex >= 0 && normals[normalIndex]) {
                                const normal = normals[normalIndex];
                                vertexNormals.push(normal.x, normal.y, normal.z);
                            } else {
                                vertexNormals.push(0, 0, 1);
                            }
                        }
                    } else if (face.v.length === 4) {
                        // Quad face - split into two triangles
                        const indices = [0, 1, 2, 0, 2, 3];
                        
                        for (const i of indices) {
                            const vertexIndex = face.v[i];
                            const uvIndex = face.vt[i];
                            const normalIndex = face.vn[i];

                            if (vertices[vertexIndex]) {
                                const vertex = vertices[vertexIndex];
                                positions.push(vertex.x, vertex.y, vertex.z);
                            }

                            if (uvIndex >= 0 && uvs[uvIndex]) {
                                const uv = uvs[uvIndex];
                                textureCoords.push(uv.x, uv.y);
                            } else {
                                textureCoords.push(0, 0);
                            }

                            if (normalIndex >= 0 && normals[normalIndex]) {
                                const normal = normals[normalIndex];
                                vertexNormals.push(normal.x, normal.y, normal.z);
                            } else {
                                vertexNormals.push(0, 0, 1);
                            }
                        }
                    }
                }

                if (positions.length === 0) continue;

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geometry.setAttribute('uv', new THREE.Float32BufferAttribute(textureCoords, 2));
                
                if (vertexNormals.every(n => n !== 0)) {
                    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(vertexNormals, 3));
                } else {
                    geometry.computeVertexNormals();
                }

                // Get material or use default
                const material = materials.get(group.material) || materials.get('default')!;
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                meshes.push(mesh);
            }

            // Group all meshes
            const group = new THREE.Group();
            meshes.forEach(mesh => group.add(mesh));

            // Center and scale the entire group
            const box = new THREE.Box3().setFromObject(group);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            group.position.sub(center);
            
            const maxDimension = Math.max(size.x, size.y, size.z);
            if (maxDimension > 0) {
                group.scale.multiplyScalar(2 / maxDimension);
            }

            scene.add(group);

            // Animation de rotation for the entire group
            let rotation = 0;
            (group as THREE.Group & { customAnimation?: () => void }).customAnimation = () => {
                rotation += 0.01;
                group.rotation.y = rotation;
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

                // Enhanced lighting setup for better material visualization
                const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
                scene.add(ambientLight);
                
                // Main directional light
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(5, 5, 5);
                directionalLight.castShadow = true;
                directionalLight.shadow.mapSize.width = 2048;
                directionalLight.shadow.mapSize.height = 2048;
                scene.add(directionalLight);
                
                // Fill light from opposite side
                const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
                fillLight.position.set(-5, -5, -5);
                scene.add(fillLight);
                
                // Rim light for better edge definition
                const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
                rimLight.position.set(0, 10, -5);
                scene.add(rimLight);

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
