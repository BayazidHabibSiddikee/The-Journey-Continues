import os
import itertools
from PIL import Image
import imagehash

DIR = "/home/sword/Documents/Certifcates"

def get_images(directory):
    images = []
    for f in os.listdir(directory):
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            images.append(os.path.join(directory, f))
    return images

def main():
    images = get_images(DIR)
    hashes = {}
    
    print(f"Processing {len(images)} images...")
    for img_path in images:
        try:
            with Image.open(img_path) as img:
                h = imagehash.phash(img)
                hashes[img_path] = h
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            
    print("Finding visually similar images...")
    
    # Group similar images
    groups = []
    for img1, img2 in itertools.combinations(hashes.keys(), 2):
        if hashes[img1] - hashes[img2] <= 8:  # 8 is a good threshold for phash
            found_group = False
            for group in groups:
                if img1 in group or img2 in group:
                    group.add(img1)
                    group.add(img2)
                    found_group = True
                    break
            if not found_group:
                groups.append(set([img1, img2]))
                
    if not groups:
        print("No visually similar images found.")
    else:
        for i, group in enumerate(groups, 1):
            print(f"Group {i} (Visually Similar):")
            for img in group:
                print(f" - {os.path.basename(img)}")
            print()

if __name__ == "__main__":
    main()
