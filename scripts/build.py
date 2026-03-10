"""
build.py — Скрипт сборки проекта falloutClicker
Упаковывает все нужные файлы проекта в ZIP архив.
Использование: python scripts/build.py
"""

import os
import sys
import zipfile
from datetime import datetime

# --- Настройки ---
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "build")

# Папки которые исключаем (по имени директории)
EXCLUDE_DIRS = {
    ".git",
    "scripts",
    "imgOld",
    "build",
    "__pycache__",
    "node_modules",
    ".gemini",
    ".vscode",
    ".idea",
}

# Файлы которые исключаем (по имени)
EXCLUDE_FILES = {
    ".gitkeep",
    ".gitignore",
    ".gitattributes",
    "read",          # служебный файл проекта
}

# Расширения которые исключаем
EXCLUDE_EXTENSIONS = {
    ".py",
    ".md",
    ".log",
    ".bak",
}


def should_exclude(rel_path: str) -> bool:
    """Возвращает True если файл или папку нужно исключить."""
    parts = rel_path.replace("\\", "/").split("/")
    # Исключаем если любая из родительских папок в списке
    for part in parts[:-1]:
        if part in EXCLUDE_DIRS:
            return True
    filename = parts[-1]
    if filename in EXCLUDE_FILES:
        return True
    _, ext = os.path.splitext(filename)
    if ext.lower() in EXCLUDE_EXTENSIONS:
        return True
    return False


def collect_files() -> list[tuple[str, str]]:
    """Собирает все файлы проекта кроме исключённых."""
    result = []
    for dirpath, dirnames, filenames in os.walk(PROJECT_ROOT):
        # Фильтруем исключённые папки прямо в os.walk чтобы не заходить в них
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

        for fname in filenames:
            abs_path = os.path.join(dirpath, fname)
            rel_path = os.path.relpath(abs_path, PROJECT_ROOT)
            if not should_exclude(rel_path):
                result.append((abs_path, rel_path))

    return result


def build():
    print("=" * 50)
    print("  falloutClicker — Скрипт сборки")
    print("=" * 50)

    # Создаём папку build если нет
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_name = f"falloutClicker_{timestamp}.zip"
    zip_path = os.path.join(OUTPUT_DIR, zip_name)

    files = collect_files()
    if not files:
        print("Ошибка: файлы для сборки не найдены.")
        sys.exit(1)

    print(f"\nСобираем {len(files)} файлов...")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for abs_path, arc_path in sorted(files):
            zf.write(abs_path, arc_path)
            print(f"  + {arc_path}")

    size_kb = os.path.getsize(zip_path) / 1024
    print(f"\n✅ Сборка завершена!")
    print(f"   Архив: build/{zip_name}")
    print(f"   Размер: {size_kb:.1f} KB")
    print(f"   Файлов: {len(files)}")


if __name__ == "__main__":
    build()
