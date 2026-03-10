"""
convert_to_webp.py — Конвертер PNG → WebP для проекта falloutClicker.
- Сохраняет прозрачность (RGBA)
- Делает бэкап оригиналов в imgOld/
- Обновляет ссылки в index.html, js/data.js, js/game.js

Требования: pip install Pillow
Использование: python scripts/convert_to_webp.py
"""

import os
import sys
import shutil
import re

# Проверяем Pillow
try:
    from PIL import Image
except ImportError:
    print("Ошибка: библиотека Pillow не установлена.")
    print("Запустите: pip install Pillow")
    sys.exit(1)

# --- Настройки ---
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IMG_DIR = os.path.join(PROJECT_ROOT, "img")
BACKUP_DIR = os.path.join(PROJECT_ROOT, "imgOld")
WEBP_QUALITY = 90

# Файлы в которых нужно заменить ссылки
FILES_TO_PATCH = [
    os.path.join(PROJECT_ROOT, "index.html"),
    os.path.join(PROJECT_ROOT, "styles.css"),
    os.path.join(PROJECT_ROOT, "js", "data.js"),
    os.path.join(PROJECT_ROOT, "js", "game.js"),
]


def backup_originals():
    """Копирует PNG файлы в imgOld/ (если ещё не скопированы)."""
    if not os.path.isdir(IMG_DIR):
        print(f"Ошибка: папка img/ не найдена по пути {IMG_DIR}")
        sys.exit(1)

    os.makedirs(BACKUP_DIR, exist_ok=True)
    png_files = [f for f in os.listdir(IMG_DIR) if f.lower().endswith(".png")]

    if not png_files:
        print("PNG файлы в img/ не найдены — конвертация не нужна.")
        sys.exit(0)

    print(f"Бэкап {len(png_files)} PNG → imgOld/ ...")
    for fname in png_files:
        src = os.path.join(IMG_DIR, fname)
        dst = os.path.join(BACKUP_DIR, fname)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
            print(f"  → imgOld/{fname}")
        else:
            print(f"  ~ imgOld/{fname} (уже есть)")

    return png_files


def convert_to_webp(png_files: list[str]):
    """Конвертирует PNG файлы в WebP с сохранением прозрачности."""
    print(f"\nКонвертация {len(png_files)} файлов в WebP (качество {WEBP_QUALITY})...")
    converted = []
    errors = []

    for fname in png_files:
        src_path = os.path.join(IMG_DIR, fname)
        webp_name = os.path.splitext(fname)[0] + ".webp"
        dst_path = os.path.join(IMG_DIR, webp_name)

        try:
            with Image.open(src_path) as img:
                # Сохраняем прозрачность: конвертируем в RGBA если нужно
                if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

                img.save(dst_path, "WEBP", quality=WEBP_QUALITY, method=6)

            # Удаляем оригинальный PNG
            os.remove(src_path)
            size_orig = os.path.getsize(os.path.join(BACKUP_DIR, fname)) / 1024
            size_new = os.path.getsize(dst_path) / 1024
            saving = (1 - size_new / size_orig) * 100
            print(f"  ✓ {fname} → {webp_name} ({size_orig:.0f}KB → {size_new:.0f}KB, -{saving:.0f}%)")
            converted.append((fname, webp_name))

        except Exception as e:
            print(f"  ✗ {fname}: {e}")
            errors.append(fname)

    return converted, errors


def patch_references(conversions: list[tuple[str, str]]):
    """Заменяет ссылки .png → .webp в коде проекта."""
    print(f"\nОбновление ссылок в {len(FILES_TO_PATCH)} файлах...")

    for filepath in FILES_TO_PATCH:
        if not os.path.isfile(filepath):
            print(f"  ~ Пропущен (не найден): {os.path.basename(filepath)}")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        original = content
        replaced_count = 0

        for png_name, webp_name in conversions:
            # Заменяем все вхождения img/name.png → img/name.webp
            pattern = re.escape(f"img/{png_name}")
            replacement = f"img/{webp_name}"
            new_content, n = re.subn(pattern, replacement, content)
            if n:
                content = new_content
                replaced_count += n

        if content != original:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            rel = os.path.relpath(filepath, PROJECT_ROOT)
            print(f"  ✓ {rel} — заменено вхождений: {replaced_count}")
        else:
            rel = os.path.relpath(filepath, PROJECT_ROOT)
            print(f"  ~ {rel} — изменений нет")


def main():
    print("=" * 55)
    print("  falloutClicker — Конвертер PNG → WebP")
    print("=" * 55)

    # 1. Бэкап
    png_files = backup_originals()

    # 2. Конвертация
    converted, errors = convert_to_webp(png_files)

    # 3. Патч ссылок
    if converted:
        patch_references(converted)

    # Итог
    print("\n" + "=" * 55)
    print(f"✅ Готово! Конвертировано: {len(converted)}, ошибок: {len(errors)}")
    if errors:
        print(f"   Ошибки: {', '.join(errors)}")
    print(f"   Оригиналы сохранены в: imgOld/")
    print("=" * 55)


if __name__ == "__main__":
    main()
