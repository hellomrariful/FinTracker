#!/bin/bash

# Script to ensure correct Node version is being used
REQUIRED_NODE_VERSION="20"
CURRENT_NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$CURRENT_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
    echo "⚠️  Wrong Node version detected: v$CURRENT_NODE_VERSION"
    echo "📦 Required Node version: v$REQUIRED_NODE_VERSION"
    
    # Check if Node 20 is installed via Homebrew
    if [ -d "/opt/homebrew/opt/node@20" ]; then
        echo "✅ Node 20 is installed. Setting PATH..."
        export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
        echo "✅ Now using Node $(node --version)"
    else
        echo "❌ Node 20 is not installed."
        echo "Please run: brew install node@20 && brew link --overwrite node@20"
        exit 1
    fi
else
    echo "✅ Using correct Node version: v$CURRENT_NODE_VERSION"
fi