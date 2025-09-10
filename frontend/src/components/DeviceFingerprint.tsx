'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  isMobile: boolean;
  isEmulator: boolean;
}

interface DeviceFingerprintProps {
  onFingerprintGenerated?: (deviceInfo: DeviceInfo) => void;
}

const DeviceFingerprint: React.FC<DeviceFingerprintProps> = ({ onFingerprintGenerated }) => {
  const [, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateFingerprint = useCallback(async () => {
    try {
      const canvas = getCanvasFingerprint();
      const webgl = getWebGLFingerprint();
      
      const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas,
        webgl,
        timestamp: new Date().toISOString()
      };

      const fingerprintHash = hashFingerprint(fingerprint);
      
      const deviceInfo: DeviceInfo = {
        fingerprint: fingerprintHash,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isEmulator: /emulator|simulator|virtual|vmware|virtualbox|qemu|xen|hyper-v|docker|container/i.test(navigator.userAgent.toLowerCase())
      };

      setDeviceInfo(deviceInfo);
      onFingerprintGenerated?.(deviceInfo);
    } catch (error) {
      console.error('Error generating device fingerprint:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onFingerprintGenerated]);

  useEffect(() => {
    generateFingerprint();
  }, [generateFingerprint]);

  const getCanvasFingerprint = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return 'canvas_error';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Device Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 126, 234, 0.7)';
      ctx.fillText('CapitalLeaf Security', 4, 45);
      
      return canvas.toDataURL();
    } catch {
      return 'canvas_error';
    }
  };

  const getWebGLFingerprint = (): Record<string, unknown> => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return { error: 'webgl_not_supported' };
      }

      // Cast to WebGLRenderingContext to access WebGL-specific methods
      const webglContext = gl as WebGLRenderingContext;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      
      return {
        vendor: webglContext.getParameter(debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : webglContext.VENDOR),
        renderer: webglContext.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : webglContext.RENDERER),
        version: webglContext.getParameter(webglContext.VERSION),
        shadingLanguageVersion: webglContext.getParameter(webglContext.SHADING_LANGUAGE_VERSION),
        extensions: webglContext.getSupportedExtensions()
      };
    } catch {
      return { error: 'webgl_error' };
    }
  };

  const hashFingerprint = (data: Record<string, unknown>): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Analyzing device...</span>
      </div>
    );
  }

  return (
    <div className="hidden">
      {/* Device fingerprinting is complete, data is available via props */}
    </div>
  );
};

export default DeviceFingerprint;
