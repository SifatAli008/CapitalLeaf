/**
 * Device Fingerprinting for Zero Trust Authentication
 * Collects device and browser information for security analysis
 */

class DeviceFingerprint {
    constructor() {
        this.fingerprint = null;
        this.deviceInfo = {};
    }

    /**
     * Generate comprehensive device fingerprint
     * @returns {Object} Device fingerprint and information
     */
    async generateFingerprint() {
        const canvas = this.getCanvasFingerprint();
        const webgl = this.getWebGLFingerprint();
        const audio = await this.getAudioFingerprint();
        
        const fingerprint = {
            // Browser Information
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            
            // Screen Information
            screenResolution: `${screen.width}x${screen.height}`,
            screenColorDepth: screen.colorDepth,
            screenPixelDepth: screen.pixelDepth,
            screenAvailWidth: screen.availWidth,
            screenAvailHeight: screen.availHeight,
            
            // Window Information
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            windowOuterSize: `${window.outerWidth}x${window.outerHeight}`,
            devicePixelRatio: window.devicePixelRatio,
            
            // Timezone Information
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // Hardware Information
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints,
            deviceMemory: navigator.deviceMemory,
            
            // Canvas Fingerprint
            canvas: canvas,
            
            // WebGL Fingerprint
            webgl: webgl,
            
            // Audio Fingerprint
            audio: audio,
            
            // Font Detection
            fonts: this.getFontFingerprint(),
            
            // Plugin Information
            plugins: this.getPluginFingerprint(),
            
            // Connection Information
            connection: this.getConnectionFingerprint(),
            
            // Battery Information
            battery: await this.getBatteryFingerprint(),
            
            // Geolocation (if available)
            location: await this.getLocationFingerprint(),
            
            // Touch Support
            touchSupport: this.getTouchFingerprint(),
            
            // Performance Information
            performance: this.getPerformanceFingerprint()
        };

        // Generate unique fingerprint hash
        this.fingerprint = this.hashFingerprint(fingerprint);
        this.deviceInfo = fingerprint;
        
        return {
            fingerprint: this.fingerprint,
            deviceInfo: this.deviceInfo
        };
    }

    /**
     * Get canvas fingerprint
     * @returns {string} Canvas fingerprint
     */
    getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Draw text with various fonts and styles
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Device Fingerprint', 2, 15);
            ctx.fillStyle = 'rgba(102, 126, 234, 0.7)';
            ctx.fillText('CapitalLeaf Security', 4, 45);
            
            return canvas.toDataURL();
        } catch (e) {
            return 'canvas_error';
        }
    }

    /**
     * Get WebGL fingerprint
     * @returns {Object} WebGL fingerprint
     */
    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return { error: 'webgl_not_supported' };
            }

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            
            return {
                vendor: gl.getParameter(debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : gl.VENDOR),
                renderer: gl.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                extensions: gl.getSupportedExtensions()
            };
        } catch (e) {
            return { error: 'webgl_error' };
        }
    }

    /**
     * Get audio fingerprint
     * @returns {Promise<string>} Audio fingerprint
     */
    async getAudioFingerprint() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);

            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(0);

            return new Promise((resolve) => {
                scriptProcessor.onaudioprocess = (bins) => {
                    const fingerprint = Array.from(bins.inputBuffer.getChannelData(0))
                        .slice(0, 30)
                        .map(x => x.toFixed(3))
                        .join(',');
                    
                    audioContext.close();
                    resolve(fingerprint);
                };
            });
        } catch (e) {
            return 'audio_error';
        }
    }

    /**
     * Get font fingerprint
     * @returns {Array} Available fonts
     */
    getFontFingerprint() {
        const testFonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
            'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
            'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console',
            'Tahoma', 'Geneva', 'Lucida Grande', 'Monaco', 'Menlo'
        ];

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testString = 'mmmmmmmmmmlli';
        const fontSize = '72px';

        const availableFonts = [];

        for (const font of testFonts) {
            let detected = false;
            for (const baseFont of baseFonts) {
                ctx.font = `${fontSize} ${baseFont}`;
                const baseWidth = ctx.measureText(testString).width;
                
                ctx.font = `${fontSize} ${font}, ${baseFont}`;
                const fontWidth = ctx.measureText(testString).width;
                
                if (fontWidth !== baseWidth) {
                    detected = true;
                    break;
                }
            }
            if (detected) {
                availableFonts.push(font);
            }
        }

        return availableFonts;
    }

    /**
     * Get plugin fingerprint
     * @returns {Array} Available plugins
     */
    getPluginFingerprint() {
        const plugins = [];
        for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push({
                name: navigator.plugins[i].name,
                description: navigator.plugins[i].description,
                filename: navigator.plugins[i].filename
            });
        }
        return plugins;
    }

    /**
     * Get connection fingerprint
     * @returns {Object} Connection information
     */
    getConnectionFingerprint() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return { error: 'connection_not_supported' };
    }

    /**
     * Get battery fingerprint
     * @returns {Promise<Object>} Battery information
     */
    async getBatteryFingerprint() {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                return {
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime,
                    level: battery.level
                };
            }
        } catch (e) {
            // Battery API not supported or permission denied
        }
        return { error: 'battery_not_supported' };
    }

    /**
     * Get location fingerprint (with permission)
     * @returns {Promise<Object>} Location information
     */
    async getLocationFingerprint() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ error: 'geolocation_not_supported' });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    resolve({ error: error.message });
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        });
    }

    /**
     * Get touch fingerprint
     * @returns {Object} Touch support information
     */
    getTouchFingerprint() {
        return {
            touchSupport: 'ontouchstart' in window,
            maxTouchPoints: navigator.maxTouchPoints,
            touchEventSupport: 'TouchEvent' in window,
            pointerEventSupport: 'PointerEvent' in window
        };
    }

    /**
     * Get performance fingerprint
     * @returns {Object} Performance information
     */
    getPerformanceFingerprint() {
        if ('performance' in window) {
            const timing = performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                networkLatency: timing.responseEnd - timing.requestStart,
                pageRenderTime: timing.domComplete - timing.domLoading
            };
        }
        return { error: 'performance_not_supported' };
    }

    /**
     * Hash fingerprint data
     * @param {Object} data - Fingerprint data
     * @returns {string} Hashed fingerprint
     */
    hashFingerprint(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Detect if device is mobile
     * @returns {boolean} True if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Detect if device is emulator/virtual
     * @returns {boolean} True if emulator
     */
    isEmulator() {
        const userAgent = navigator.userAgent.toLowerCase();
        const emulatorIndicators = [
            'emulator', 'simulator', 'virtual', 'vmware', 'virtualbox',
            'qemu', 'xen', 'hyper-v', 'docker', 'container'
        ];
        
        return emulatorIndicators.some(indicator => userAgent.includes(indicator));
    }

    /**
     * Detect VPN/Proxy usage
     * @returns {Promise<boolean>} True if VPN/Proxy detected
     */
    async detectVPN() {
        try {
            // Simple VPN detection based on WebRTC IP leak
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            
            return new Promise((resolve) => {
                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));
                
                pc.onicecandidate = (ice) => {
                    if (ice.candidate) {
                        const candidate = ice.candidate.candidate;
                        // Check for common VPN/proxy patterns
                        const vpnPatterns = [
                            /vpn/i, /proxy/i, /tor/i, /anonymizer/i,
                            /datacenter/i, /hosting/i, /cloud/i
                        ];
                        
                        const isVPN = vpnPatterns.some(pattern => pattern.test(candidate));
                        pc.close();
                        resolve(isVPN);
                    }
                };
                
                setTimeout(() => {
                    pc.close();
                    resolve(false);
                }, 3000);
            });
        } catch (e) {
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceFingerprint;
} else {
    window.DeviceFingerprint = DeviceFingerprint;
}
