import os
from PIL import Image

def recolor_image(img_path):
    print(f"Recoloring {os.path.basename(img_path)}...")
    img = Image.open(img_path).convert("RGBA")
    
    # Load pixels
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # If it's a green-dominant pixel, shift it to amber/orange
        # Green-dominant: green channel is significantly higher than red/blue, or the pixel has a green tint
        # In RGB, green-tinted monochrome has G > R and G > B.
        # We can map the intensity (G or average) to an amber-orange color:
        # Amber-orange is R=intensity, G=intensity*0.45, B=intensity*0.1
        
        # Calculate grayscale intensity of the pixel
        intensity = int(0.299 * r + 0.587 * g + 0.114 * b)
        
        # Let's check if the pixel is green-dominant
        # (e.g., green is the highest channel or close to it)
        if g > r * 0.9 and g > b * 0.9:
            # Shift towards amber/orange
            # We preserve some of the brightness/contrast by using the original intensity
            new_r = min(255, int(intensity * 1.5))
            new_g = min(255, int(intensity * 0.7))
            new_b = min(255, int(intensity * 0.15))
            new_data.append((new_r, new_g, new_b, a))
        else:
            # If it's not green-dominant, we still warm it up a bit to match the orange theme
            # by reducing blue and slightly boosting red/green
            new_r = min(255, int(r * 1.1))
            new_g = min(255, int(g * 0.95))
            new_b = min(255, int(b * 0.4))
            new_data.append((new_r, new_g, new_b, a))
            
    img.putdata(new_data)
    img.save(img_path, "WEBP", quality=90)
    print(f"  [OK] Saved {os.path.basename(img_path)}")

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_img = os.path.join(root, "public", "img")
    
    files = [
        "char_base.webp",
        "char_light.webp",
        "char_leather.webp",
        "char_suit.webp"
    ]
    
    for f in files:
        fpath = os.path.join(public_img, f)
        if os.path.exists(fpath):
            recolor_image(fpath)
        else:
            print(f"File not found: {fpath}")

if __name__ == "__main__":
    main()
