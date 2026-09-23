#!/usr/bin/env bash
# Build a sideloadable Ebenezer APK (not an AAB).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK_ROOT="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/android-sdk}}"
export ANDROID_HOME="$SDK_ROOT"
export ANDROID_SDK_ROOT="$SDK_ROOT"
export PATH="$SDK_ROOT/cmdline-tools/latest/bin:$SDK_ROOT/platform-tools:$PATH"

install_sdk() {
  if [[ -x "$SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]]; then
    return
  fi

  echo "Installing Android command-line tools into $SDK_ROOT"
  mkdir -p "$SDK_ROOT/cmdline-tools"
  local zip="$SDK_ROOT/commandlinetools.zip"
  curl -fsSL -o "$zip" \
    "https://dl.google.com/android/repository/commandlinetools-linux-14742923_latest.zip"
  rm -rf "$SDK_ROOT/cmdline-tools/latest" "$SDK_ROOT/cmdline-tools/cmdline-tools"
  unzip -q "$zip" -d "$SDK_ROOT/cmdline-tools"
  mv "$SDK_ROOT/cmdline-tools/cmdline-tools" "$SDK_ROOT/cmdline-tools/latest"
  rm -f "$zip"
}

accept_licenses() {
  yes | sdkmanager --sdk_root="$SDK_ROOT" --licenses >/dev/null || true
}

ensure_packages() {
  sdkmanager --sdk_root="$SDK_ROOT" \
    "platform-tools" \
    "platforms;android-35" \
    "build-tools;35.0.0" \
    "ndk;27.1.12297006"
}

cd "$ROOT"
export CI=1
install_sdk
accept_licenses
ensure_packages

pnpm exec expo prebuild --platform android --non-interactive --clean

cd "$ROOT/android"
chmod +x gradlew
./gradlew assembleRelease --no-daemon

mkdir -p "$ROOT/dist"
APK="$(find "$ROOT/android/app/build/outputs/apk" -name '*.apk' | head -n 1)"
if [[ -z "${APK}" ]]; then
  echo "Gradle finished but no APK was found." >&2
  exit 1
fi

DEST="$ROOT/dist/ebenezer-0.2.0.apk"
cp "$APK" "$DEST"
echo "APK ready: $DEST"
ls -lh "$DEST"
