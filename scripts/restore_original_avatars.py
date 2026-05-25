import os
from PIL import Image

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    img_old = os.path.join(root, "imgOld")
    public_img = os.path.join(root, "public", "img")
    
    files = [
        "char_base.png",
        "char_light.png",
        "char_leather.png",
        "char_suit.png"
    ]
    
    for f in files:
        src = os.path.join(img_old, f)
        dst_name = os.path.splitext(f)[0] + ".webp"
        dst = os.path.join(public_img, dst_name)
        
        if os.path.exists(src):
            print(f"Restoring and converting {f} to {dst_name}...")
            with Image.open(src) as img:
                if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
                img.save(dst, "WEBP", quality=90, method=6)
            print(f"  [OK] Restored {dst_name}")
        else:
            print(f"Original file not found: {src}")

if __name__ == "__main__":
    main()
