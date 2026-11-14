"""
Studio render of the gold shears for the intro loader.

Renders each blade-half on its own transparent PNG with an identical orthographic camera, so the
loader can open and close the blades in 2D around the pivot (the pivot's pixel position is written
to pivot.json).

Run:
  "C:\\Program Files\\Blender Foundation\\Blender 5.3\\blender.exe" --background --factory-startup \
      --python scripts/blender_loader_shears.py -- public/models/shears.glb <out_dir>
"""
import bpy, sys, os, json, math
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--") + 1:]
GLB, OUT = argv[0], argv[1]
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=GLB)

objs = {o.name.split(".")[0]: o for o in scene.objects if o.type == "MESH"}
A, B, P = objs["HalfA"], objs["HalfB"], objs["Pivot"]


# ---------------------------------------------------------------- materials (richer than the web ones)
def pbsdf(name, color, rough, coat=0.0, aniso=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = 1.0
    b.inputs["Roughness"].default_value = rough
    for k, v in (("Coat Weight", coat), ("Coat Roughness", 0.08), ("Anisotropic", aniso)):
        if k in b.inputs:
            b.inputs[k].default_value = v
    return m


GOLD = pbsdf("Gold", (0.86, 0.60, 0.30), 0.16, coat=0.5)
STEEL = pbsdf("Steel", (0.93, 0.88, 0.80), 0.07, aniso=0.6)
SCREW = pbsdf("Screw", (0.62, 0.45, 0.26), 0.22)

for ob in (A, B, P):
    for slot in ob.material_slots:
        n = (slot.material.name if slot.material else "").lower()
        slot.material = STEEL if "steel" in n else SCREW if "screw" in n else GOLD
    for poly in ob.data.polygons:
        poly.use_smooth = True

# a touch of perspective tilt so the metal catches light like a product shot
for ob in (A, B, P):
    ob.rotation_euler.x += math.radians(-10)

# ---------------------------------------------------------------- lighting: warm softboxes reflected in the metal
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.34, 0.29, 0.25, 1)
bg.inputs["Strength"].default_value = 0.55


def softbox(loc, size, energy, color=(1, 0.95, 0.88)):
    bpy.ops.object.light_add(type="AREA", location=loc)
    L = bpy.context.active_object
    L.data.shape = "RECTANGLE"
    L.data.size, L.data.size_y = size
    L.data.energy = energy
    L.data.color = color
    L.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()


softbox((3.5, 2.0, 7.0), (9, 1.6), 1400)
softbox((-4.5, -1.5, 5.0), (7, 3.0), 700, (1, 0.86, 0.68))
softbox((0.5, 6.0, 3.0), (6, 1.2), 500)
softbox((0.0, -6.0, 2.5), (8, 2.0), 380, (1, 0.9, 0.78))
# overhead strips behind the camera: the flat blades mirror these as bright polished gleams
softbox((0.0, -2.6, 22.0), (10, 2.2), 5200)
softbox((0.0, 2.8, 22.0), (10, 0.9), 2600, (1, 0.92, 0.82))

# ---------------------------------------------------------------- camera
bpy.ops.object.camera_add(location=(0, 0, 12))
cam = bpy.context.active_object
cam.data.type = "ORTHO"
cam.data.ortho_scale = 6.2
scene.camera = cam

scene.render.engine = "CYCLES"
scene.cycles.samples = 160
scene.cycles.use_denoising = True
scene.render.film_transparent = True
scene.render.resolution_x = 560
scene.render.resolution_y = 1120
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = "AgX" if "AgX" in [i.identifier for i in scene.view_settings.bl_rna.properties["view_transform"].enum_items] else "Filmic"
scene.view_settings.look = "None"
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"

# pivot position in image space (0..1 from the top-left)
bpy.context.view_layer.update()
u, v, _ = world_to_camera_view(scene, cam, Vector((0, 0, 0)))
with open(os.path.join(OUT, "pivot.json"), "w") as f:
    json.dump({"x": round(u, 4), "y": round(1 - v, 4), "w": scene.render.resolution_x, "h": scene.render.resolution_y}, f)


def only(*keep, name):
    for ob in (A, B, P):
        ob.hide_render = ob not in keep
    scene.render.filepath = os.path.join(OUT, name)
    bpy.ops.render.render(write_still=True)


only(A, P, name="shear-a.png")   # upper half carries the pivot screw
only(B, name="shear-b.png")
print("DONE", OUT)
