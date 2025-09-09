/**
 * CapitalLeaf Logo Component
 * Professional branding with dual-font styling
 */

class CapitalLeafLogo {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            size: options.size || 'large',
            showSubtitle: options.showSubtitle !== false,
            subtitle: options.subtitle || 'Zero Trust Security Framework',
            className: options.className || 'capital-leaf-logo'
        };
        
        this.init();
    }

    /**
     * Initialize the logo
     */
    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Logo container with ID '${this.containerId}' not found`);
            return;
        }

        this.render(container);
    }

    /**
     * Render the logo
     * @param {HTMLElement} container - Container element
     */
    render(container) {
        const logoElement = this.createLogoElement();
        container.appendChild(logoElement);
    }

    /**
     * Create logo element
     * @returns {HTMLElement} Logo element
     */
    createLogoElement() {
        const logoDiv = document.createElement('div');
        logoDiv.className = `logo ${this.options.className}`;
        
        const logoText = document.createElement('div');
        logoText.className = 'logo-text';
        
        const capitalSpan = document.createElement('span');
        capitalSpan.className = 'capital-text';
        capitalSpan.textContent = 'Capital';
        
        const leafSpan = document.createElement('span');
        leafSpan.className = 'leaf-text';
        leafSpan.textContent = 'Leaf';
        
        logoText.appendChild(capitalSpan);
        logoText.appendChild(leafSpan);
        logoDiv.appendChild(logoText);

        if (this.options.showSubtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'subtitle';
            subtitle.textContent = this.options.subtitle;
            logoDiv.appendChild(subtitle);
        }

        // Apply size-specific styling
        this.applySizeStyling(logoDiv);

        return logoDiv;
    }

    /**
     * Apply size-specific styling
     * @param {HTMLElement} logoElement - Logo element
     */
    applySizeStyling(logoElement) {
        const logoText = logoElement.querySelector('.logo-text');
        
        switch (this.options.size) {
            case 'small':
                logoText.style.fontSize = '1.2rem';
                break;
            case 'medium':
                logoText.style.fontSize = '1.8rem';
                break;
            case 'large':
                logoText.style.fontSize = '2.5rem';
                break;
            case 'xlarge':
                logoText.style.fontSize = '3.5rem';
                break;
            default:
                logoText.style.fontSize = '2.5rem';
        }
    }

    /**
     * Update logo subtitle
     * @param {string} newSubtitle - New subtitle text
     */
    updateSubtitle(newSubtitle) {
        const subtitle = document.querySelector(`#${this.containerId} .subtitle`);
        if (subtitle) {
            subtitle.textContent = newSubtitle;
        }
    }

    /**
     * Add animation to logo
     * @param {string} animationType - Type of animation
     */
    addAnimation(animationType = 'fadeIn') {
        const logoElement = document.querySelector(`#${this.containerId} .logo`);
        if (logoElement) {
            logoElement.classList.add(`logo-${animationType}`);
        }
    }

    /**
     * Remove animation from logo
     */
    removeAnimation() {
        const logoElement = document.querySelector(`#${this.containerId} .logo`);
        if (logoElement) {
            logoElement.className = logoElement.className.replace(/logo-\w+/g, '');
        }
    }
}

// CSS for logo animations
const logoStyles = `
.logo-fadeIn {
    animation: logoFadeIn 1s ease-in-out;
}

.logo-pulse {
    animation: logoPulse 2s ease-in-out infinite;
}

.logo-glow {
    animation: logoGlow 3s ease-in-out infinite alternate;
}

@keyframes logoFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes logoPulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes logoGlow {
    from {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    to {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(49, 130, 206, 0.3);
    }
}
`;

// Inject logo styles
if (!document.getElementById('capital-leaf-logo-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'capital-leaf-logo-styles';
    styleSheet.textContent = logoStyles;
    document.head.appendChild(styleSheet);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CapitalLeafLogo;
} else {
    window.CapitalLeafLogo = CapitalLeafLogo;
}
