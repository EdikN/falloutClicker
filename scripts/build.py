import os
import subprocess
import shutil
import time

def build_and_zip():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    dist_dir = os.path.join(project_root, 'dist')
    zip_base_name = os.path.join(script_dir, 'build')
    
    start_time = time.time()
    print("🚀 Starting optimized build process...")
    
    # 1. Run npm run build
    print("📦 Running npm run build...")
    try:
        # Run build directly and wait for it
        result = subprocess.run("npm run build", shell=True, capture_output=True, text=True, cwd=project_root)
        
        if result.returncode != 0:
            print(f"❌ Error during build:\n{result.stderr}")
            return
            
        print("✅ Build successful!")
        if result.stdout:
            print(result.stdout.strip())
        
    except Exception as e:
        print(f"❌ Error executing build command: {e}")
        return

    # 2. Check if dist folder exists
    if not os.path.exists(dist_dir):
        print(f"❌ Error: {dist_dir} directory not found after build.")
        return

    # 3. Create zip file using fast shutil archive
    print(f"🗜️  Zipping {dist_dir} to {zip_base_name}.zip...")
    try:
        # shutil.make_archive is much faster and cleaner
        shutil.make_archive(zip_base_name, 'zip', dist_dir)
        print(f"✨ Successfully created {zip_base_name}.zip!")
    except Exception as e:
        print(f"❌ Error creating zip file: {e}")

    end_time = time.time()
    print(f"🕒 Total time: {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    build_and_zip()
