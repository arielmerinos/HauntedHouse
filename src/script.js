import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbienOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const bricksAOTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

const grassAOTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassAOTexture.repeat.set(8,8)
grassColorTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassAOTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassAOTexture.wrapT= THREE.RepeatWrapping
grassColorTexture.wrapT= THREE.RepeatWrapping
grassNormalTexture.wrapT= THREE.RepeatWrapping
grassRoughnessTexture.wrapT= THREE.RepeatWrapping

/**
 * House
 */
// Temporary sphere
const house = new THREE.Group();
scene.add(house)
// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAOTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    }), 1 
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

house.add(walls)
walls.position.y = 2.5 / 2

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)
house.add(roof)
roof.position.y = 2.5 + 0.5
roof.rotation.y = (Math.PI * 0.25 ) 

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial(
        {
            //color: '#aa7b7b', 
            metalnessMap: doorMetalnessTexture,
            normalMap: doorNormalTexture,
            roughnessMap: doorRoughnessTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            map: doorColorTexture,
            aoMap: doorAmbienOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.1
        })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.z = 2 + 0.0001
door.position.y = 1
house.add(door)


// Bushes

const bushGeometry = new THREE.SphereGeometry(1, 18, 18)
const bushMaterial = new THREE.MeshStandardMaterial({map: grassColorTexture,
    aoMap: grassAOTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.22)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.7, 0.7, 0.7)
bush3.position.set(-1, 0.1, 2.1)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.4, 0.4, 0.4)
bush4.position.set(-1.8, 0.1, 2.1)

house.add(bush1, bush2, bush3, bush4)



// Graves

const graves = new THREE.Group()
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for (let index = 0; index < 100; index++) {
    
    const angle = Math.random() *  Math.PI * 2
    const radius = 4 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(
        graveGeometry, 
        graveMaterial
    )
    grave.rotation.y = (Math.random() - 0.4)
    grave.rotation.z =   (Math.random() * 0.2 )
    grave.position.set(x, 0.4, z) 
    grave.castShadow = true
    graves.add(grave)
    
}

scene.add(graves)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial(
        {
            map: grassColorTexture,
            aoMap: grassAOTexture,
            normalMap: grassNormalTexture,
            roughnessMap: grassRoughnessTexture
        }
    ),1
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight( '#333333', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight( '#333333', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight( '#0000ff', 2, 3)
scene.add(ghost3)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.22)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.22)
moonLight.position.set(4, 5, - 2)

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.22, 2.7)

const doorLightHelper = new THREE.PointLightHelper(doorLight)

house.add(doorLight, doorLightHelper)


// Fog
const fog = new THREE.Fog('#262837', 3, 15)
scene.fog = fog


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


moonLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Animate ghosts
    const x = Math.cos(elapsedTime * 0.7) * 6
    const y = Math.abs(Math.sin(elapsedTime))
    const z = Math.sin(elapsedTime * 0.7)  * 4
    ghost1.position.set(x, y, z)
    
    ghost2.position.x = Math.cos( - elapsedTime * 0.7) * 6
    ghost2.position.y = Math.abs(Math.sin(- elapsedTime))
    ghost2.position.z = Math.sin(- 0.55 *elapsedTime * 0.7)  * 4

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()