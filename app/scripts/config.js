(function () {
    window.CONFIG = {
        // Toggle this property on for server interaction. WARNING All root urls must point to a real database API
        online: false,

        // Load in data when application boots up, recommended for testing purposes only
        populate: true,

        // Force loads in dummy data
        debug: false,

        // Whether or not hitboxes are visible
        hitBoxVisible: true,

        // Current zoom amount at load
        scale: 4,

        images: {
            // Replace with an actual URL to your images root
            root: './data/images.json'
        },

        sprites: {
            // Also replace with a real url
            root: './data/sprites.json'
        },

        animationGroups: {
            root: './data/animation-groups.json',
            defaultWidth: 20,
            defaultHeight: 20
        },

        animations: {
            root: './data/animations.json',
            defaultSpeed: 0.3,
            defaultLength: 10
        },

        timelines: {
            root: './data/timelines.json'
        },

        frames: {
            root: './data/frames.json'
        }
    };
}());