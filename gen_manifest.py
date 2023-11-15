import json
import pathlib

project_path = pathlib.Path("./public/images/projects")
manifest = json.loads(pathlib.Path("./public/manifest.json").read_text())
image_paths = []
for project_image in project_path.iterdir():
    if project_image.is_file():
        print(project_image.as_posix())
        image_paths.append(project_image.as_posix().replace("public/",""))
manifest["images"] = image_paths
with pathlib.Path("./public/manifest.json").open("w") as f:
    json.dump(manifest, f)