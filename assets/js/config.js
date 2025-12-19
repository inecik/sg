/**
 * Şenol Güneş - Site Configuration
 * Central configuration for images and content
 *
 * @author Site Author
 * @version 1.0.0
 */

const SITE_CONFIG = {
    // Site Information
    site: {
        title: 'Şenol Güneş - Bir Futbol Efsanesi',
        description: 'Türk futbolunun efsanevi teknik direktörü Şenol Güneş\'in hayatı ve kariyeri',
        author: 'Site Author',
        version: '1.0.0'
    },

    // Image Configuration
    // When you add real images, update the paths here
    images: {
        // Base path for all images
        basePath: 'assets/images/',

        // Slide background images
        // Replace these URLs with local paths when you add images
        slides: {
            'slide-1': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920',
            'slide-2': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920',
            'slide-3': 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1920',
            'slide-4': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920',
            'slide-5': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1920',
            'slide-6': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920',
            'slide-7': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920',
            'slide-8': 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1920',
            'slide-9': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920',
            'slide-10': 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1920',
            'slide-11': 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1920',
            'slide-12': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1920'
        },

        // Club logos
        logos: {
            'trabzonspor': 'logos/trabzonspor.png',
            'besiktas': 'logos/besiktas.png',
            'turkey': 'logos/turkey.png',
            'bursaspor': 'logos/bursaspor.png',
            'boluspor': 'logos/boluspor.png',
            'istanbulspor': 'logos/istanbulspor.png',
            'antalyaspor': 'logos/antalyaspor.png',
            'sakaryaspor': 'logos/sakaryaspor.png',
            'fcseoul': 'logos/fcseoul.png'
        },

        // Manager photos (add your own photos here)
        managers: {
            'okan-buruk': null,       // 'managers/okan-buruk.jpg'
            'emre-belozoglu': null,   // 'managers/emre-belozoglu.jpg'
            'abdullah-avci': null,    // 'managers/abdullah-avci.jpg'
            'sergen-yalcin': null,    // 'managers/sergen-yalcin.jpg'
            'tolunay-kafkas': null,   // 'managers/tolunay-kafkas.jpg'
            'umit-davala': null,      // 'managers/umit-davala.jpg'
            'bulent-korkmaz': null,   // 'managers/bulent-korkmaz.jpg'
            'gokdeniz-karadeniz': null, // 'managers/gokdeniz-karadeniz.jpg'
            'ilhan-mansiz': null,     // 'managers/ilhan-mansiz.jpg'
            'burak-yilmaz': null,     // 'managers/burak-yilmaz.jpg'
            'hasan-sas': null,        // 'managers/hasan-sas.jpg'
            'yildiray-basturk': null  // 'managers/yildiray-basturk.jpg'
        },

        // Main subject photos
        senolGunes: {
            portrait: null,    // 'senol-gunes/portrait.jpg'
            action: null,      // 'senol-gunes/action.jpg'
            celebration: null, // 'senol-gunes/celebration.jpg'
            worldcup: null     // 'senol-gunes/worldcup-2002.jpg'
        }
    },

    // Feature flags for development
    features: {
        showPlaceholders: true,  // Show placeholder text when images are missing
        enableParticles: true,   // Enable particle animation
        enableAnimations: true   // Enable slide animations
    }
};

// Helper function to get image path
function getImagePath(category, key) {
    const config = SITE_CONFIG.images;

    if (category === 'slides') {
        return config.slides[key] || null;
    }

    if (category === 'logos') {
        const path = config.logos[key];
        return path ? config.basePath + path : null;
    }

    if (category === 'managers') {
        const path = config.managers[key];
        return path ? config.basePath + path : null;
    }

    if (category === 'senolGunes') {
        const path = config.senolGunes[key];
        return path ? config.basePath + path : null;
    }

    return null;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, getImagePath };
}
