from PIL import Image
import os

# Path to your sprite sheet
sprite_sheet_path = "characters.png"  # File is in the same directory

# Output directory for extracted sprites
output_dir = "sprites"
os.makedirs(output_dir, exist_ok=True)  # Create the folder if it doesn't exist

# Load the sprite sheet
sprite_sheet = Image.open(sprite_sheet_path)

# Define sprite dimensions
SPRITE_WIDTH = 32  # Adjust based on the actual sprite size
SPRITE_HEIGHT = 32

# Calculate number of rows and columns
NUM_COLS = sprite_sheet.width // SPRITE_WIDTH
NUM_ROWS = sprite_sheet.height // SPRITE_HEIGHT

# Extract each sprite
for row in range(NUM_ROWS):
    for col in range(NUM_COLS):
        left = col * SPRITE_WIDTH
        upper = row * SPRITE_HEIGHT
        right = left + SPRITE_WIDTH
        lower = upper + SPRITE_HEIGHT

        # Crop the sprite
        sprite = sprite_sheet.crop((left, upper, right, lower))

        # Save the sprite
        sprite_name = f"sprite_{row}_{col}.png"
        sprite.save(os.path.join(output_dir, sprite_name))

print(f"Extracted {NUM_ROWS * NUM_COLS} sprites to {output_dir}/")
