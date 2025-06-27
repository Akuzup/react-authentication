#!/bin/bash

echo "🧪 Testing ReactCore Auth Example Build..."

# Check if we're in the examples directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the examples directory"
    exit 1
fi

# Build the auth module first
echo "🔨 Building auth module..."
cd ..
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Auth module build failed"
    exit 1
fi

cd examples

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

# Build the example project
echo "🏗️ Building example project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Example build failed"
    exit 1
fi

echo "✅ All builds successful!"
echo ""
echo "You can now:"
echo "1. Run 'npm run preview' to test the production build"
echo "2. Run 'npm run dev' to start development server"
