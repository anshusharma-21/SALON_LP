"""
Blender script: builds premium salon shears and exports a GLB for the web.

Run:
  blender --background --python scripts/blender_scissors.py -- <out_dir>

Outputs:
  <out_dir>/shears.glb      (objects: HalfA, HalfB, Pivot — origin at the pivot,
                             so the site can open/close the blades by rotating Z)
  <out_dir>/shears_preview.png
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = os.path.abspath(argv[0] if argv else "public/models")
PREVIEW_DIR = os.path.abspath("scripts")
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def material(name, color, rough, aniso=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = 1.0
    b.inputs["Roughness"].default_value = rough
    for key, val in (("Anisotropic", aniso), ("Coat Weight", coat)):
        if key in b.inputs:
            b.inputs[key].default_value = val
    return m


GOLD = material("Gold", (0.83, 0.58, 0.30), 0.18, coat=0.4)
STEEL = material("Champagne Steel", (0.90, 0.85, 0.78), 0.08, aniso=0.5)
SCREW = material("Screw", (0.55, 0.40, 0.24), 0.30)


def to_mesh(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    return bpy.context.active_object


def smooth(obj, angle=35):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    if hasattr(bpy.ops.object, "shade_smooth_by_angle"):
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    else:
        bpy.ops.object.shade_smooth()


# ---------------------------------------------------------------- blade
def blade(name):
    """Tapered blade. Straight cutting edge on -x, curved spine on +x, tip at +y."""
    L, base = 2.55, -0.46
    n = 48
    edge, spine = [], []
    for i in range(n + 1):
        t = i / n
        y = base + (L - base) * t
        # cutting edge: nearly straight, converges to the tip
        xe = -0.13 * (1 - t) ** 1.05
        # spine: full near the pivot, elegant convex taper to the point
        xs = 0.19 * (1 - t) ** 0.75 + 0.035 * math.sin(math.pi * t) * (1 - t)
        edge.append((xe, y))
        spine.append((xs, y))
    # rounded heel behind the pivot
    heel = [(0.03 + 0.16 * math.cos(a), base + 0.16 * math.sin(a) * 0.9)
            for a in [math.radians(d) for d in range(0, -181, -15)]]
    outline = spine[::-1] + heel[1:-1] + edge
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    verts = [bm.verts.new((x, y, 0)) for x, y in outline]
    bm.faces.new(verts)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    sol = ob.modifiers.new("solid", "SOLIDIFY")
    sol.thickness = 0.07
    sol.offset = 0
    bev = ob.modifiers.new("bevel", "BEVEL")
    bev.width = 0.014
    bev.segments = 4
    bev.limit_method = "ANGLE"
    ob.data.materials.append(STEEL)
    ob = to_mesh(ob)
    smooth(ob, 40)
    return ob


# ---------------------------------------------------------------- handle
def tube(name, points, radius, mat, cyclic=False, scale=(1, 1)):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 6
    cu.resolution_u = 24
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(points) - 1)
    for bp, p in zip(sp.bezier_points, points):
        bp.co = (p[0] * scale[0], p[1] * scale[1], 0)
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    sp.use_cyclic_u = cyclic
    ob = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    ob = to_mesh(ob)
    smooth(ob, 60)
    return ob


def ring(name, center, rx, ry, radius):
    pts = [(center[0] + rx * math.cos(a), center[1] + ry * math.sin(a))
           for a in [2 * math.pi * k / 12 for k in range(12)]]
    return tube(name, pts, radius, GOLD, cyclic=True)


def half(name, finger_rest=False):
    parts = [blade(name + "_blade")]
    # shank: from the pivot sweeping down to the ring, on the opposite side
    parts.append(tube(name + "_shank",
                      [(0.02, -0.30), (-0.12, -0.70), (-0.36, -1.06), (-0.52, -1.24)],
                      0.092, GOLD))
    parts.append(ring(name + "_ring", (-0.70, -1.72), 0.40, 0.50, 0.088))
    if finger_rest:  # the curled tang that marks professional shears
        parts.append(tube(name + "_tang",
                          [(-0.98, -2.05), (-1.18, -2.32), (-1.12, -2.58), (-0.96, -2.62)],
                          0.055, GOLD))
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    ob = bpy.context.active_object
    ob.name = name
    return ob


a = half("HalfA", finger_rest=True)
a.location.z = 0.036

b = half("HalfB")
b.scale.x = -1
bpy.ops.object.select_all(action="DESELECT")
b.select_set(True)
bpy.context.view_layer.objects.active = b
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode="OBJECT")
b.location.z = -0.036

# pivot screw
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.12, depth=0.24, location=(0, 0, 0))
pv = bpy.context.active_object
pv.name = "Pivot"
pv.rotation_euler.x = 0
bev = pv.modifiers.new("bevel", "BEVEL")
bev.width = 0.025
bev.segments = 4
pv.data.materials.append(SCREW)
pv = to_mesh(pv)
smooth(pv, 40)

# ---------------------------------------------------------------- export
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=os.path.join(OUT, "shears.glb"),
    export_format="GLB",
    export_apply=True,
    use_selection=True,
)

# ---------------------------------------------------------------- preview render
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.96, 0.93, 0.89, 1)
bg.inputs["Strength"].default_value = 1.0

for ob, ang in ((a, -0.22), (b, 0.22)):
    ob.rotation_euler.z = ang

for loc, energy, size in (((4, 3, 6), 900, 4), ((-5, -2, 4), 400, 6), ((0, 6, -4), 300, 5)):
    bpy.ops.object.light_add(type="AREA", location=loc)
    L = bpy.context.active_object
    L.data.energy = energy
    L.data.size = size
    L.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()

bpy.ops.object.camera_add(location=(0, 0, 11))
cam = bpy.context.active_object
cam.data.lens = 70
scene.camera = cam
for ob in (a, b, pv):
    ob.rotation_euler.x = math.radians(-12)

for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "CYCLES"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
if scene.render.engine == "CYCLES":
    scene.cycles.samples = 64
scene.render.resolution_x = 900
scene.render.resolution_y = 1100
scene.render.filepath = os.path.join(PREVIEW_DIR, "shears_preview.png")
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
