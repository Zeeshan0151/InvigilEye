#!/bin/bash

echo "📦 Creating Python bundle tarball for hosting..."

# Check if python-portable exists
if [ ! -d "python-portable" ]; then
    echo "❌ python-portable directory not found!"
    echo "Please run ./scripts/setup-python-bundle.sh first"
    exit 1
fi

# Create tarball
echo "Compressing python-portable directory..."
tar -czf python-portable.tar.gz -C python-portable .

# Check if successful
if [ -f "python-portable.tar.gz" ]; then
    SIZE=$(du -h python-portable.tar.gz | cut -f1)
    echo "✅ Tarball created successfully!"
    echo "📁 File: python-portable.tar.gz"
    echo "📊 Size: $SIZE"
    echo ""
    echo "Next steps:"
    echo "1. Upload this file to GitHub Releases:"
    echo "   - Go to: https://github.com/Zeeshan0151/InvigilEye/releases"
    echo "   - Click 'Create a new release'"
    echo "   - Tag: v1.0.0-python"
    echo "   - Upload: python-portable.tar.gz"
    echo ""
    echo "2. Update the download URL in main/python-downloader.js:"
    echo "   this.downloadUrl = 'https://github.com/Zeeshan0151/InvigilEye/releases/download/v1.0.0-python/python-portable.tar.gz';"
    echo ""
    echo "Alternative hosting options:"
    echo "- AWS S3: https://your-bucket.s3.amazonaws.com/python-portable.tar.gz"
    echo "- Google Cloud Storage: https://storage.googleapis.com/your-bucket/python-portable.tar.gz"
    echo "- DigitalOcean Spaces: https://your-space.nyc3.digitaloceanspaces.com/python-portable.tar.gz"
else
    echo "❌ Failed to create tarball"
    exit 1
fi

