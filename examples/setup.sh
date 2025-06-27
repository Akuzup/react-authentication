#!/bin/bash

echo "🚀 Setting up ReactCore Auth Example Project..."

# Check if we're in the examples directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the examples directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Firebase configuration"
else
    echo "✅ .env file already exists"
fi

# Build the auth module from parent directory
echo "🔨 Building auth module..."
cd ..
npm run build
cd examples

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Firebase configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 See README.md for detailed instructions"
