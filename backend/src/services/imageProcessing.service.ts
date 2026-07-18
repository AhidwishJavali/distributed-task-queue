import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

class ImageProcessingService {
    private inputDir = path.join(
        process.cwd(),
        "assets",
        "images"
    );

    private outputDir = path.join(
        process.cwd(),
        "output"
    );

    async ensureOutputFolder() {
        await fs.mkdir(this.outputDir, {
            recursive: true,
        });
    }

    async loadImage(imageName: string) {
    const imagePath = path.join(this.inputDir, imageName);
    console.log("Looking for:", imagePath);

    try {
        console.log("Exists:", await fs
    .access(imagePath)
    .then(() => true)
    .catch(() => false));
        const image = sharp(imagePath);
        await image.metadata();
        return image;
    } catch {
        throw new Error(
            `Input image "${imageName}" not found or is invalid.`
        );
    }
}

    async preprocess(image: sharp.Sharp) {
        return image
            .resize(800, 600, {
                fit: "inside",
            })
            .normalize();
    }

    async applyGrayscale(image: sharp.Sharp) {
        return image.grayscale();
    }

    async detectEdges(image: sharp.Sharp) {
        return image.sharpen();
    }

   async saveImage(
    image: sharp.Sharp,
    imageName: string
) {
    await this.ensureOutputFolder();

    const outputName = `processed-${imageName}`;

    const outputPath = path.join(
        this.outputDir,
        outputName
    );

    await image.toFile(outputPath);

    return outputName;
}
}

export default new ImageProcessingService();