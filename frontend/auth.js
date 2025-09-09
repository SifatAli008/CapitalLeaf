/**
 * Zero Trust Authentication Frontend
 * Handles authentication flow with adaptive MFA
 */

class ZeroTrustAuth {
    constructor() {
        this.deviceFingerprint = new DeviceFingerprint();
        this.currentUser = null;
        this.currentSession = null;
        this.apiBaseUrl = '/api'; // Adjust based on your backend
        this.init();
    }

    /**
     * Initialize authentication system
     */
    async init() {
        // Generate device fingerprint
        await this.deviceFingerprint.generateFingerprint();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check for existing session
        await this.checkExistingSession();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Login form submission
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // MFA method selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mfa-method')) {
                this.selectMFAMethod(e.target.closest('.mfa-method'));
            }
        });
    }

    /**
     * Handle login process
     */
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberDevice = document.getElementById('rememberDevice').checked;

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        this.showLoading(true);

        try {
            // Collect user context
            const userContext = await this.collectUserContext(username, rememberDevice);
            
            // Send authentication request
            const response = await this.authenticateUser(username, password, userContext);
            
            if (response.success) {
                this.currentUser = response.user;
                this.currentSession = response.session;
                
                // Handle authentication result
                await this.handleAuthResult(response);
            } else {
                this.showError(response.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            this.showError('Authentication failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Collect user context for risk assessment
     * @param {string} username - Username
     * @param {boolean} rememberDevice - Remember device flag
     * @returns {Object} User context
     */
    async collectUserContext(username, rememberDevice) {
        const fingerprint = await this.deviceFingerprint.generateFingerprint();
        const location = await this.deviceFingerprint.getLocationFingerprint();
        const isVPN = await this.deviceFingerprint.detectVPN();

        return {
            userId: username,
            timestamp: new Date().toISOString(),
            deviceFingerprint: fingerprint.fingerprint,
            deviceInfo: fingerprint.deviceInfo,
            location: location.error ? null : location,
            isMobile: this.deviceFingerprint.isMobile(),
            isEmulator: this.deviceFingerprint.isEmulator(),
            isVPN: isVPN,
            isProxy: false, // Could be enhanced with more sophisticated detection
            rememberDevice: rememberDevice,
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled
            },
            networkInfo: this.deviceFingerprint.getConnectionFingerprint(),
            screenInfo: {
                resolution: `${screen.width}x${screen.height}`,
                colorDepth: screen.colorDepth,
                pixelRatio: window.devicePixelRatio
            }
        };
    }

    /**
     * Authenticate user with backend
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {Object} userContext - User context
     * @returns {Promise<Object>} Authentication response
     */
    async authenticateUser(username, password, userContext) {
        const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                userContext
            })
        });

        return await response.json();
    }

    /**
     * Handle authentication result
     * @param {Object} response - Authentication response
     */
    async handleAuthResult(response) {
        const { accessDecision } = response;

        // Update risk score display
        this.updateRiskScore(accessDecision.riskScore);

        // Show risk factors
        this.showRiskFactors(accessDecision.riskFactors);

        // Show security recommendations
        this.showSecurityRecommendations(accessDecision.recommendations);

        if (accessDecision.allowed) {
            if (accessDecision.requiresMFA) {
                // Show MFA challenge
                this.showMFAChallenge(accessDecision.mfaMethods);
            } else {
                // Direct access granted
                this.showSecurityDashboard(accessDecision);
            }
        } else {
            // Access denied
            this.showAccessDenied(accessDecision);
        }
    }

    /**
     * Show MFA challenge
     * @param {Array} mfaMethods - Available MFA methods
     */
    showMFAChallenge(mfaMethods) {
        this.hideAllForms();
        document.getElementById('mfaForm').classList.remove('hidden');
        
        const mfaContainer = document.getElementById('mfaMethods');
        mfaContainer.innerHTML = '';

        mfaMethods.forEach(method => {
            const mfaElement = this.createMFAElement(method);
            mfaContainer.appendChild(mfaElement);
        });
    }

    /**
     * Create MFA element
     * @param {string} method - MFA method
     * @returns {HTMLElement} MFA element
     */
    createMFAElement(method) {
        const div = document.createElement('div');
        div.className = 'mfa-method';
        div.dataset.method = method;

        const methods = {
            sms: {
                icon: 'fas fa-sms',
                title: 'SMS Verification',
                description: 'We\'ll send a code to your registered phone number'
            },
            email: {
                icon: 'fas fa-envelope',
                title: 'Email Verification',
                description: 'We\'ll send a code to your registered email address'
            },
            totp: {
                icon: 'fas fa-mobile-alt',
                title: 'Authenticator App',
                description: 'Enter the code from your authenticator app'
            },
            biometric: {
                icon: 'fas fa-fingerprint',
                title: 'Biometric Verification',
                description: 'Use your fingerprint or face recognition'
            },
            push: {
                icon: 'fas fa-bell',
                title: 'Push Notification',
                description: 'Approve the login on your mobile device'
            }
        };

        const methodInfo = methods[method] || methods.totp;

        div.innerHTML = `
            <div class="mfa-method-header">
                <i class="mfa-method-icon ${methodInfo.icon}"></i>
                <span class="mfa-method-title">${methodInfo.title}</span>
            </div>
            <div class="mfa-method-description">${methodInfo.description}</div>
            <input type="text" class="mfa-input hidden" placeholder="Enter verification code" maxlength="6">
        `;

        // Add click handler
        div.addEventListener('click', () => {
            this.selectMFAMethod(div);
        });

        return div;
    }

    /**
     * Select MFA method
     * @param {HTMLElement} element - MFA element
     */
    selectMFAMethod(element) {
        // Remove previous selection
        document.querySelectorAll('.mfa-method').forEach(el => {
            el.classList.remove('selected');
            el.querySelector('.mfa-input').classList.add('hidden');
        });

        // Select current method
        element.classList.add('selected');
        const input = element.querySelector('.mfa-input');
        input.classList.remove('hidden');
        input.focus();

        // Add input handler
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 6) {
                this.verifyMFACode(element.dataset.method, e.target.value);
            }
        });
    }

    /**
     * Verify MFA code
     * @param {string} method - MFA method
     * @param {string} code - Verification code
     */
    async verifyMFACode(method, code) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/verify-mfa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: this.currentSession.sessionId,
                    method,
                    code
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSecurityDashboard(this.currentSession);
            } else {
                this.showError('Invalid verification code. Please try again.');
            }
        } catch (error) {
            console.error('MFA verification error:', error);
            this.showError('Verification failed. Please try again.');
        }
    }

    /**
     * Show security dashboard
     * @param {Object} session - Session information
     */
    showSecurityDashboard(session) {
        this.hideAllForms();
        document.getElementById('securityDashboard').classList.remove('hidden');
        
        // Update dashboard with session information
        this.updateRiskBreakdown(session.riskFactors);
        this.updateSessionsList(session);
        this.updateBehavioralAnalysis(session);
    }

    /**
     * Update risk score display
     * @param {number} riskScore - Risk score
     */
    updateRiskScore(riskScore) {
        const riskValue = document.getElementById('riskValue');
        const riskFill = document.getElementById('riskFill');
        
        riskValue.textContent = riskScore.toFixed(2);
        riskFill.style.width = `${riskScore * 100}%`;
        
        // Update risk level styling
        riskFill.className = 'risk-fill';
        if (riskScore < 0.3) {
            riskFill.classList.add('risk-low');
        } else if (riskScore < 0.6) {
            riskFill.classList.add('risk-medium');
        } else if (riskScore < 0.8) {
            riskFill.classList.add('risk-high');
        } else {
            riskFill.classList.add('risk-critical');
        }
    }

    /**
     * Show risk factors
     * @param {Object} riskFactors - Risk factors breakdown
     */
    showRiskFactors(riskFactors) {
        const container = document.getElementById('riskBreakdown');
        container.innerHTML = '';

        Object.entries(riskFactors).forEach(([factor, score]) => {
            const div = document.createElement('div');
            div.className = `risk-factor ${this.getRiskLevel(score)}`;
            
            div.innerHTML = `
                <span>${this.formatRiskFactor(factor)}</span>
                <span>${(score * 100).toFixed(0)}%</span>
            `;
            
            container.appendChild(div);
        });
    }

    /**
     * Show security recommendations
     * @param {Array} recommendations - Security recommendations
     */
    showSecurityRecommendations(recommendations) {
        const container = document.getElementById('securityRecommendations');
        
        if (recommendations && recommendations.length > 0) {
            container.innerHTML = `
                <h4><i class="fas fa-exclamation-triangle"></i> Security Recommendations</h4>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            `;
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }

    /**
     * Update risk breakdown
     * @param {Object} riskFactors - Risk factors
     */
    updateRiskBreakdown(riskFactors) {
        this.showRiskFactors(riskFactors);
    }

    /**
     * Update sessions list
     * @param {Object} session - Current session
     */
    updateSessionsList(session) {
        const container = document.getElementById('sessionsList');
        container.innerHTML = `
            <div class="session-item">
                <div class="session-info">
                    <div class="session-device">Current Device</div>
                    <div class="session-time">${new Date(session.timestamp).toLocaleString()}</div>
                </div>
                <span class="session-status session-active">Active</span>
            </div>
        `;
    }

    /**
     * Update behavioral analysis
     * @param {Object} session - Session information
     */
    updateBehavioralAnalysis(session) {
        const container = document.getElementById('behavioralAnalysis');
        const anomaly = session.behavioralAnomaly;
        
        container.innerHTML = `
            <div class="behavioral-status">
                <span class="security-status ${anomaly.detected ? 'warning' : 'secure'}">
                    <i class="fas fa-${anomaly.detected ? 'exclamation-triangle' : 'check-circle'}"></i>
                    ${anomaly.detected ? 'Anomalies Detected' : 'Normal Behavior'}
                </span>
            </div>
            ${anomaly.detected ? `
                <div class="anomaly-details">
                    <p>Detected anomalies:</p>
                    <ul>
                        ${anomaly.anomalies.map(anomaly => `<li>${anomaly}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    }

    /**
     * Show access denied
     * @param {Object} accessDecision - Access decision
     */
    showAccessDenied(accessDecision) {
        this.showError(`Access denied. Risk score: ${accessDecision.riskScore.toFixed(2)}`);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        
        // Add to page
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Show loading state
     * @param {boolean} show - Show loading
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    /**
     * Hide all forms
     */
    hideAllForms() {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.add('hidden');
        });
    }

    /**
     * Get risk level
     * @param {number} score - Risk score
     * @returns {string} Risk level
     */
    getRiskLevel(score) {
        if (score < 0.3) return 'low';
        if (score < 0.6) return 'medium';
        return 'high';
    }

    /**
     * Format risk factor name
     * @param {string} factor - Risk factor
     * @returns {string} Formatted name
     */
    formatRiskFactor(factor) {
        return factor.charAt(0).toUpperCase() + factor.slice(1).replace(/([A-Z])/g, ' $1');
    }

    /**
     * Check existing session
     */
    async checkExistingSession() {
        // Implementation for checking existing session
        // This would typically check localStorage or cookies
    }

    /**
     * Proceed to application
     */
    proceedToApp() {
        // Redirect to main application
        window.location.href = '/dashboard';
    }

    /**
     * Skip MFA (not recommended)
     */
    skipMFA() {
        if (confirm('Skipping MFA reduces security. Are you sure?')) {
            this.showSecurityDashboard(this.currentSession);
        }
    }

    /**
     * Register device
     */
    async registerDevice() {
        const deviceName = document.getElementById('deviceNameInput').value;
        
        if (!deviceName) {
            this.showError('Please enter a device name');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register-device`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: this.currentSession.sessionId,
                    deviceName,
                    deviceInfo: this.deviceFingerprint.deviceInfo
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSecurityDashboard(this.currentSession);
            } else {
                this.showError('Device registration failed');
            }
        } catch (error) {
            console.error('Device registration error:', error);
            this.showError('Device registration failed');
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zeroTrustAuth = new ZeroTrustAuth();
});
