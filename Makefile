# Makefile for RipWise iOS app development

# Variables
APP_DIR = expense-splitter
IOS_DIR = $(APP_DIR)/ios
BUILD_DIR = $(APP_DIR)/build

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make build      - Build React app"
	@echo "  make ios        - Build and open in Xcode"
	@echo "  make sync       - Sync changes to iOS project"
	@echo "  make clean      - Clean build files"
	@echo "  make icons      - Generate app icons and splash screens"

# Install dependencies
.PHONY: install
install:
	@echo "Installing dependencies..."
	cd $(APP_DIR) && npm install

# Build React app
.PHONY: build
build:
	@echo "Building React app..."
	cd $(APP_DIR) && npm run build

# Add iOS platform, sync and open in Xcode
.PHONY: ios
ios: build
	@echo "Setting up iOS app..."
	cd $(APP_DIR) && npx cap sync ios
	@if [ ! -d "$(IOS_DIR)" ]; then \
		echo "Adding iOS platform..."; \
		cd $(APP_DIR) && npx cap add ios; \
	fi
	@echo "Opening in Xcode..."
	cd $(APP_DIR) && npx cap open ios || open $(IOS_DIR)/App/App.xcworkspace

# Sync changes to existing iOS project
.PHONY: sync
sync: build
	@echo "Syncing with iOS project..."
	cd $(APP_DIR) && npx cap sync ios

# Clean build files
.PHONY: clean
clean:
	@echo "Cleaning build files..."
	rm -rf $(BUILD_DIR)
	@echo "Build directory cleaned."

# Generate app icons and splash screens
.PHONY: icons
icons:
	@echo "Generating app icons and splash screens..."
	cd $(APP_DIR) && npx @capacitor/assets generate --iconBackgroundColor '#4a6fa5' --splashBackgroundColor '#ffffff'
	@echo "Remember to run 'make sync' to update iOS project with new assets."

# Set up Fastlane with bundler
.PHONY: fastlane-setup
fastlane-setup:
	@echo "Setting up Fastlane with Bundler..."
	cd $(IOS_DIR)/App && \
	bundle init && \
	bundle add fastlane && \
	bundle exec fastlane init

# Deploy to App Store
.PHONY: publish
publish: build sync
	@echo "Building and uploading to App Store..."
	cd $(IOS_DIR)/App && bundle exec fastlane release

# Create a distributable archive that can be uploaded via Xcode
.PHONY: archive
archive: build sync
	@echo "Creating app archive for App Store distribution..."
	cd $(IOS_DIR) && xcodebuild -workspace App/App.xcworkspace -scheme App -configuration Release -archivePath ./RipWise.xcarchive clean archive
	@echo "Archive created at $(IOS_DIR)/RipWise.xcarchive"
	@echo "Open Xcode's Organizer (Window > Organizer) to validate and distribute the archive" 