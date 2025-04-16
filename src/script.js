console.log ( 'test' )

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { step, uint } from 'three/tsl'


// GRAPHICAL USER INTER FACE ANNOUNCEMENT

const gui = new GUI ({
    width: 200,
    title: 'gui',
    })
const debugObject =
    {
        // color of object in speaking
        //mesh color needs to be renamed debugObject.color to recall said color
        color: '#' + '469ef8',
        meshCount: 750,
        wireframe: true,
        amplitude: 0,
        repulsionDistance: 0.5,
        repulsionForce: 2
    }

//hiding the gui with event listener, allowing for the debug menu
// to be made visible/invisible when typing 'h' (sick guy)
gui
.hide ()

// Declaring event as 'keydown' function
window.addEventListener ('keydown', (event) =>
{
    if (event.key == 'h')
        gui.show(gui._hidden)
})


/**
 * Base
 */


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object

// Always GEOMETRY > MATERIAL > MESH

const geometry = new THREE.BufferGeometry()

// Generative Random Triangle Sequence using LOOPS and FLOAT32ARRAY
//  Random Triangle Generator Loop
// - count = number of triangles we want
// - Each triangle has 3 vertices
// - Each vertex has 3 values (x, y, z)
// count * 3 * 3 = total number of float values needed
// This loop fills the Float32Array with random positions between -0.5 and 0.5
// Each 3 values = 1 vertex position in 3D space

const count = debugObject.meshCount
// Count * 3 positions for vertex * 3 *
const positionsARRAY = new Float32Array(count * 3 * 3)

// LOOP code (maybe look into this one chump)
for(let i = 0; i < count * 3 *3; i++)
{
    positionsARRAY[i] = Math.random() - 0.5

}

const positionsAttribute = new THREE.BufferAttribute(positionsARRAY, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ 
    color: debugObject.color,
    wireframe: debugObject.wireframe

 }) 
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

function regenerateGeometry () 
{
const newPositions = new Float32Array (debugObject.meshCount * 3 * 3)
for (let i = 0; i < newPositions.length; i++) {
    newPositions[i] = Math.random () - 5
}
const newAttribute = new THREE.BufferAttribute(newPositions, 3)
geometry.setAttribute ('position', newAttribute)


}

gui
.addColor (debugObject, 'color')
.onChange(() =>
{
    material.color.set(debugObject.color)
})

gui
.add (debugObject, 'meshCount')
.min (1)
.max (3000)
.step(1)
.onFinishChange(() =>
{
regenerateGeometry()
})
   
    


gui
.add (debugObject, 'wireframe') .onChange(() =>
{
    material.wireframe = debugObject.wireframe
})

gui.
add (debugObject, 'amplitude')
.min(0)
.max(1)
.step (0.001)


gui
.add (debugObject, 'repulsionDistance')
.min (0)
.max (2)
.step (0.001)

gui
.add (debugObject, 'repulsionForce')
.min (0)
.max (20)
.step (0.001)



// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Mouse Interaction
const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Adding function for canvas to react to mouse movement (refer to why it is multiplied and then minused for the x and similar for the y)
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = (event.clientY / sizes.height) * 2 + 1
})


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate

const clock = new THREE.Clock()

// TICK FUNCTION COME ON BRO 

//MOUSE MOVEMENT REACTION 
function animationMouseReact (positionAttr, elapsedTime, mouse3D) {
for (let i =0; i < positionAttr.count; i++) {
    
    const offset = Math.sin(elapsedTime + i) * debugObject.amplitude

    const x = positionAttr.getX(i)
    const y = positionAttr.getY(i)
    const z = positionAttr.getZ(i)

    const vertex = new THREE.Vector3(x, y, z)
    const dir = vertex.clone().sub(mouse3D) // direction away from mouse
    const distance = dir.length()

    // Only affect vertices within a certain radius
    if (distance < debugObject.repulsionDistance) {
        dir.normalize().multiplyScalar(debugObject.repulsionForce) // move a little away
        vertex.add(dir)
    } else {
        // breathting still applied
        const offset = Math.sin(elapsedTime + i) * 0.005
        vertex.addScalar(offset)
    }

    positionAttr.setXYZ(i, vertex.x, vertex.y, vertex.z)
}
positionAttr.needsUpdate = true
}
const tick = () =>
{

     //raycast
     raycaster.setFromCamera(mouse, camera)
     const mouse3D = new THREE.Vector3()
     raycaster.ray.at(1, mouse3D)

//  Animated possitions
const elapsedTime = clock.getElapsedTime()

animationMouseReact(geometry.attributes.position, elapsedTime, mouse3D)
   
    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

console.log('Triangle Count:', geometry.attributes.position.count / 3)